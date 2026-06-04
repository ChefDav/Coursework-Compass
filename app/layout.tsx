import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import CompletionWatcher from "@/components/CompletionWatcher";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Coursework Compass",
  description:
      "A coursework planning app that turns large academic projects into clear daily tasks.",
};

export default function RootLayout({
                                     children,
                                   }: Readonly<{
  children: React.ReactNode;
}>) {
  return (
      <html lang="en">
      <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
      <CompletionWatcher />
      {children}
      </body>
      </html>
  );
}