'use server';

import 'server-only';

import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

import type {
  AuthSnapshot,
  BackendAuthResponse,
  SessionPayload,
} from './types';
import { AUTH_SESSION_COOKIE, AUTH_TOKEN_COOKIE } from './config';

const COOKIE_MAX_AGE_SECONDS = 60 * 60 * 24 * 7; // 7 days

function getCookieSecret(): string {
  const secret = process.env.AUTH_COOKIE_SECRET;
  if (!secret) {
    throw new Error('Missing AUTH_COOKIE_SECRET environment variable.');
  }
  return secret;
}

function base64UrlEncode(input: string): string {
  return Buffer.from(input, 'utf8')
    .toString('base64')
    .replaceAll('+', '-')
    .replaceAll('/', '_')
    .replaceAll('=', '');
}

function base64UrlDecode(input: string): string {
  const normalized = input
    .replaceAll('-', '+')
    .replaceAll('_', '/')
    .padEnd(Math.ceil(input.length / 4) * 4, '=');

  return Buffer.from(normalized, 'base64').toString('utf8');
}

async function hmacSign(value: string, secret: string): Promise<string> {
  const encoder = new TextEncoder();

  const key = await crypto.subtle.importKey(
    'raw',
    encoder.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );

  const signature = await crypto.subtle.sign(
    'HMAC',
    key,
    encoder.encode(value)
  );

  return Buffer.from(signature)
    .toString('base64')
    .replaceAll('+', '-')
    .replaceAll('/', '_')
    .replaceAll('=', '');
}

async function createSignedSession(payload: SessionPayload): Promise<string> {
  const encodedPayload = base64UrlEncode(JSON.stringify(payload));
  const signature = await hmacSign(encodedPayload, getCookieSecret());
  return `${encodedPayload}.${signature}`;
}

async function verifySignedSession(
  rawValue?: string
): Promise<SessionPayload | null> {
  if (!rawValue) return null;

  const [payloadPart, signaturePart] = rawValue.split('.');
  if (!payloadPart || !signaturePart) return null;

  const expected = await hmacSign(payloadPart, getCookieSecret());
  if (expected !== signaturePart) return null;

  try {
    return JSON.parse(base64UrlDecode(payloadPart)) as SessionPayload;
  } catch {
    return null;
  }
}

function toAuthSnapshot(session: SessionPayload | null): AuthSnapshot {
  if (!session) {
    return {
      isAuthenticated: false,
      user: null,
      role: 'guest',
      permissions: [],
      expiresAt: undefined,
    };
  }

  return {
    isAuthenticated: true,
    user: session.user,
    role: session.user.role,
    permissions: session.permissions,
    expiresAt: session.expiresAt,
  };
}

/**
 * Persist JWT in a cookie (accessible by js-cookie) and store a signed,
 * HTTP-only session snapshot for RSC/middleware authorization checks.
 */
export async function persistAuthSession(
  payload: BackendAuthResponse,
  redirectTo: string = '/'
): Promise<AuthSnapshot> {
  const cookieStore = await cookies();

  const sessionPayload: SessionPayload = {
    user: payload.user,
    permissions: payload.permissions ?? [],
    expiresAt: payload.expiresAt,
  };

  const signedSession = await createSignedSession(sessionPayload);

  cookieStore.set(AUTH_TOKEN_COOKIE, payload.token, {
    httpOnly: false,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: COOKIE_MAX_AGE_SECONDS,
  });

  cookieStore.set(AUTH_SESSION_COOKIE, signedSession, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: COOKIE_MAX_AGE_SECONDS,
  });

  revalidatePath(redirectTo);

  if (redirectTo && redirectTo !== '') {
    redirect(redirectTo);
  }

  return toAuthSnapshot(sessionPayload);
}

export async function clearAuthSession(
  redirectTo: string = '/login'
): Promise<void> {
  const cookieStore = await cookies();

  cookieStore.delete(AUTH_TOKEN_COOKIE);
  cookieStore.delete(AUTH_SESSION_COOKIE);

  revalidatePath(redirectTo);

  if (redirectTo && redirectTo !== '') {
    redirect(redirectTo);
  }
}

export async function getServerAuth(): Promise<AuthSnapshot> {
  const cookieStore = await cookies();
  const rawSession = cookieStore.get(AUTH_SESSION_COOKIE)?.value;
  const session = await verifySignedSession(rawSession);

  return toAuthSnapshot(session);
}

/**
 * Optional utility if you need to read the raw JWT on the server for
 * route handlers / BFF fetches.
 */
export async function getServerToken(): Promise<string | null> {
  const cookieStore = await cookies();
  return cookieStore.get(AUTH_TOKEN_COOKIE)?.value ?? null;
}
