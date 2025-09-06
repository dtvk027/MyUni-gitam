// app/fonts.ts
import { Inter } from "next/font/google";
import { Fira_Code } from "next/font/google";

export const geistSans = Inter({
  subsets: ["latin"],
  variable: "--font-geist-sans",
});

export const geistMono = Fira_Code({
  subsets: ["latin"],
  variable: "--font-geist-mono",
});
