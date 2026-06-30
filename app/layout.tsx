import type { Metadata } from "next";
import "./globals.css";
import OnboardingPopup from "@/components/OnboardingPopup";
import SaveSuccessToast from "@/components/SaveSuccessToast";
import GlobalClock from "@/components/GlobalClock";
import CompletionWatcher from "@/components/CompletionWatcher";
import ThemeBootstrap from "@/components/ThemeBootstrap";

export const metadata: Metadata = {
    title: "Coursework Compass",
    description:
        "A coursework planning tool for IB, A-Level, and international school students.",
};

const themeBootstrapScript = `
(function () {
  try {
    var theme = window.localStorage.getItem("coursework-compass-theme");
    if (theme !== "dark" && theme !== "light") {
      theme = "dark";
    }
    document.documentElement.dataset.theme = theme;
    document.documentElement.style.colorScheme = theme;
  } catch (error) {
    document.documentElement.dataset.theme = "dark";
    document.documentElement.style.colorScheme = "dark";
  }
})();
`;

export default function RootLayout({
                                       children,
                                   }: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" data-theme="dark" style={{ colorScheme: "dark" }} suppressHydrationWarning>
        <body>
        <script dangerouslySetInnerHTML={{ __html: themeBootstrapScript }} />
        <ThemeBootstrap />
        {children}
        <OnboardingPopup />
        <SaveSuccessToast />
        <CompletionWatcher />
        <GlobalClock />
        </body>
        </html>
    );
}
