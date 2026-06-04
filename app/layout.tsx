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
    title: {
        default: "Coursework Compass",
        template: "%s | Coursework Compass",
    },
    description:
        "Coursework Compass helps students turn coursework deadlines into clear project plans, generated tasks, progress tracking, and daily execution.",
    applicationName: "Coursework Compass",
    keywords: [
        "coursework planner",
        "student productivity",
        "IB coursework",
        "A-Level coursework",
        "task planning",
        "deadline tracker",
        "study planner",
    ],
    authors: [
        {
            name: "Zichuan",
        },
    ],
    creator: "Zichuan",
    publisher: "Coursework Compass",
    metadataBase: new URL("https://coursework-compass.vercel.app"),
    openGraph: {
        title: "Coursework Compass",
        description:
            "Turn coursework chaos into a clear task plan. Create projects, generate tasks, track progress, and archive completed work.",
        url: "https://coursework-compass.vercel.app",
        siteName: "Coursework Compass",
        type: "website",
    },
    twitter: {
        card: "summary_large_image",
        title: "Coursework Compass",
        description:
            "A coursework planning app that turns deadlines into focused daily tasks.",
    },
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