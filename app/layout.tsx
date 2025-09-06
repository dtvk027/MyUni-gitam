import React, { Suspense } from "react";
import type { Metadata } from "next";
import { geistSans, geistMono } from "./fonts";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

export const metadata: Metadata = {
  title: "My Uni GITAM - Campus Community Platform",
  description: "Connect, collaborate, and engage with your GITAM university community",
  generator: "v0.app",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body className="font-sans">
        <Suspense fallback={null}>{children}</Suspense>
        <Analytics />
      </body>
    </html>
  );
}
