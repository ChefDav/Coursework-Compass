import type { Metadata } from "next";
import "./globals.css";
import OnboardingPopup from "@/components/OnboardingPopup";
import SaveSuccessToast from "@/components/SaveSuccessToast";
import GlobalClock from "@/components/GlobalClock";
import CompletionWatcher from "@/components/CompletionWatcher";
import ThemeBootstrap from "@/components/ThemeBootstrap";
import BackgroundBootstrap from "@/components/BackgroundBootstrap";

export const metadata: Metadata = {
    title: "Coursework Compass",
    description:
        "Coursework Compass is a local-first coursework planning workspace for international school students with bilingual UI, saved preferences, and personalisation features.",
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

    var background = window.localStorage.getItem("coursework-compass-background");
    var validBackgrounds = ["default", "deep-ocean", "paper-light", "aurora", "minimal-slate", "exam-focus"];
    if (validBackgrounds.indexOf(background) === -1) {
      background = "default";
    }
    document.documentElement.dataset.background = background;
  } catch (error) {
    document.documentElement.dataset.theme = "dark";
    document.documentElement.style.colorScheme = "dark";
    document.documentElement.dataset.background = "default";
  }
})();
`;

export default function RootLayout({
                                       children,
                                   }: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" data-theme="dark" data-background="default" style={{ colorScheme: "dark" }} suppressHydrationWarning>
        <body>
        <script dangerouslySetInnerHTML={{ __html: themeBootstrapScript }} />
        <ThemeBootstrap />
        <BackgroundBootstrap />
        {children}
        <OnboardingPopup />
        <SaveSuccessToast />
        <CompletionWatcher />
        <GlobalClock />
        </body>
        </html>
    );
}
