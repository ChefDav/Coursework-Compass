import type { Metadata } from "next";
import "./globals.css";
import OnboardingPopup from "@/components/OnboardingPopup";
import GlobalClock from "@/components/GlobalClock";
import CompletionWatcher from "@/components/CompletionWatcher";

export const metadata: Metadata = {
    title: "Coursework Compass",
    description:
        "A coursework planning tool for IB, A-Level, and international school students.",
};

export default function RootLayout({
                                       children,
                                   }: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
        <body>
        {children}
        <OnboardingPopup />
        <CompletionWatcher />
        <GlobalClock />
        </body>
        </html>
    );
}