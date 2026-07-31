import type { Metadata } from "next";
import { Geist_Mono } from "next/font/google";
import { Toaster } from "sonner";
import CustomCursor from "@/components/shared/CustomCursor";
import "./globals.css";

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://codernex.dev"),
  title: "Codernex (Borhan Uddin) | Full-Stack Engineer",
  description:
    "Software Engineer II specializing in high-performance backend architecture with NestJS and modern frontend experiences with Next.js.",
  keywords: [
    "Software Engineer",
    "NestJS",
    "Next.js",
    "TypeScript",
    "System Design",
    "Backend Architect",
  ],
  authors: [{ name: "Codernex (Borhan Uddin)" }],
  openGraph: {
    title: "Codernex (Borhan Uddin)| Engineering Portfolio",
    description:
      "Deep dives into system architecture and full-stack development.",
    url: "https://codernex.dev",
    siteName: "Codernex (Borhan Uddin)",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Borhan Uddin | Full-Stack Engineer",
    description:
      "Building scalable systems and high-performance web applications.",
    images: ["/og-image.png"],
  },
  manifest: "/site.webmanifest",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
      </head>
      <body {...geistMono.style} className="bg-zinc-950 cursor-default">
        <CustomCursor />
        {children}
        <Toaster />
      </body>
    </html>
  );
}
