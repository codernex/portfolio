import { NextRequest, NextResponse } from "next/server";

import { canAccessRoute } from "./config";
import type { SessionPayload } from "./types";

const AUTH_SESSION_COOKIE = "auth_session";

function getCookieSecret(): string {
  const secret = process.env.AUTH_COOKIE_SECRET;
  if (!secret) {
    throw new Error("Missing AUTH_COOKIE_SECRET environment variable.");
  }
  return secret;
}

function base64UrlDecode(input: string): string {
  const normalized = input
    .replaceAll("-", "+")
    .replaceAll("_", "/")
    .padEnd(Math.ceil(input.length / 4) * 4, "=");

  if (typeof atob === "function") {
    return decodeURIComponent(
      Array.from(atob(normalized))
        .map((char) => `%${char.charCodeAt(0).toString(16).padStart(2, "0")}`)
        .join(""),
    );
  }

  return Buffer.from(normalized, "base64").toString("utf8");
}

function toBase64Url(bytes: ArrayBuffer): string {
  const uint8 = new Uint8Array(bytes);
  let binary = "";

  for (const byte of uint8) {
    binary += String.fromCharCode(byte);
  }

  return btoa(binary)
    .replaceAll("+", "-")
    .replaceAll("/", "_")
    .replaceAll("=", "");
}

async function hmacSign(value: string, secret: string): Promise<string> {
  const encoder = new TextEncoder();

  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );

  const signature = await crypto.subtle.sign(
    "HMAC",
    key,
    encoder.encode(value),
  );

  return toBase64Url(signature);
}

async function verifySignedSession(
  rawValue?: string,
): Promise<SessionPayload | null> {
  if (!rawValue) return null;

  const [payloadPart, signaturePart] = rawValue.split(".");
  if (!payloadPart || !signaturePart) return null;

  const expected = await hmacSign(payloadPart, getCookieSecret());
  if (expected !== signaturePart) return null;

  try {
    return JSON.parse(base64UrlDecode(payloadPart)) as SessionPayload;
  } catch {
    return null;
  }
}

function buildLoginRedirect(request: NextRequest): NextResponse {
  const loginUrl = new URL("/login", request.url);
  loginUrl.searchParams.set("next", request.nextUrl.pathname);
  return NextResponse.redirect(loginUrl);
}

export async function authMiddleware(
  request: NextRequest,
): Promise<NextResponse> {
  const pathname = request.nextUrl.pathname;

  const rawSession = request.cookies.get(AUTH_SESSION_COOKIE)?.value;
  const session = await verifySignedSession(rawSession);

  // Public paths you never want blocked.
  const isPublic = !pathname.startsWith("/dashboard");

  if (isPublic) {
    return NextResponse.next();
  }

  if (!session?.user) {
    return buildLoginRedirect(request);
  }

  if (!canAccessRoute(session.user.role, pathname)) {
    return NextResponse.redirect(new URL("/403", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*"],
};
