"use client";

import { useEffect, useState } from "react";
import {
    getStoredTheme,
    listenForThemeChange,
    setStoredTheme,
    type Theme,
} from "@/lib/theme";
import {
    getStoredLanguage,
    listenForLanguageChange,
    type Language,
} from "@/lib/i18n";

type ThemeSwitcherProps = {
    compact?: boolean;
};

const themeOptions: {
    value: Theme;
    icon: string;
    labels: Record<Language, string>;
}[] = [
    {
        value: "dark",
        icon: "🌙",
        labels: {
            en: "Dark",
            zh: "深色",
        },
    },
    {
        value: "light",
        icon: "☀️",
        labels: {
            en: "Light",
            zh: "浅色",
        },
    },
];

const groupLabels: Record<Language, string> = {
    en: "Theme",
    zh: "主题",
};

export default function ThemeSwitcher({
    compact = false,
}: ThemeSwitcherProps) {
    const [theme, setTheme] = useState<Theme>("dark");
    const [language, setLanguage] = useState<Language>("en");

    useEffect(() => {
        setTheme(getStoredTheme());
        setLanguage(getStoredLanguage());

        const stopThemeListener = listenForThemeChange((nextTheme) => {
            setTheme(nextTheme);
        });
        const stopLanguageListener = listenForLanguageChange((nextLanguage) => {
            setLanguage(nextLanguage);
        });

        return () => {
            stopThemeListener();
            stopLanguageListener();
        };
    }, []);

    function handleChangeTheme(nextTheme: Theme) {
        setTheme(nextTheme);
        setStoredTheme(nextTheme);
    }

    if (compact) {
        return (
            <div className="cc-surface-inset rounded-2xl p-2">
                <p className="cc-text-subtle mb-2 px-2 text-xs font-black uppercase tracking-[0.16em]">
                    {groupLabels[language]}
                </p>

                <div className="grid grid-cols-2 gap-2">
                    {themeOptions.map((option) => {
                        const isActive = option.value === theme;

                        return (
                            <button
                                key={option.value}
                                type="button"
                                onClick={() => handleChangeTheme(option.value)}
                                aria-pressed={isActive}
                                className={`rounded-xl px-3 py-2 text-xs font-black transition ${
                                    isActive
                                        ? "cc-button-primary"
                                        : "cc-button-secondary"
                                }`}
                            >
                                <span aria-hidden="true" className="mr-1">
                                    {option.icon}
                                </span>
                                {option.labels[language]}
                            </button>
                        );
                    })}
                </div>
            </div>
        );
    }

    return (
        <div className="cc-surface-inset rounded-2xl p-2">
            <div className="flex flex-wrap items-center gap-2">
                <span className="cc-text-subtle px-2 text-xs font-black uppercase tracking-[0.16em]">
                    {groupLabels[language]}
                </span>

                {themeOptions.map((option) => {
                    const isActive = option.value === theme;

                    return (
                        <button
                            key={option.value}
                            type="button"
                            onClick={() => handleChangeTheme(option.value)}
                            aria-pressed={isActive}
                            className={`rounded-xl px-3 py-2 text-xs font-black transition ${
                                isActive
                                    ? "cc-button-primary"
                                    : "cc-button-secondary"
                            }`}
                        >
                            <span aria-hidden="true" className="mr-1">
                                {option.icon}
                            </span>
                            {option.labels[language]}
                        </button>
                    );
                })}
            </div>
        </div>
    );
}
