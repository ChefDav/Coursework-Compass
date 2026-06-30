"use client";

import { useEffect, useState } from "react";
import {
    BACKGROUND_PRESETS,
    getStoredBackground,
    listenForBackgroundChange,
    setStoredBackground,
    type BackgroundPreset,
} from "@/lib/background";
import {
    getStoredLanguage,
    listenForLanguageChange,
    type Language,
} from "@/lib/i18n";

const copy: Record<
    Language,
    {
        label: string;
        active: string;
        presets: Record<BackgroundPreset, string>;
    }
> = {
    en: {
        label: "Background",
        active: "Active",
        presets: {
            default: "Default Nebula",
            "deep-ocean": "Deep Ocean",
            "paper-light": "Paper Light",
            aurora: "Aurora",
            "minimal-slate": "Minimal Slate",
            "exam-focus": "Exam Focus",
        },
    },
    zh: {
        label: "背景",
        active: "已选择",
        presets: {
            default: "默认星云",
            "deep-ocean": "深海蓝",
            "paper-light": "白昼纸张",
            aurora: "极光",
            "minimal-slate": "极简灰蓝",
            "exam-focus": "考试专注",
        },
    },
};

export default function BackgroundSwitcher() {
    const [background, setBackground] =
        useState<BackgroundPreset>("default");
    const [language, setLanguage] = useState<Language>("en");

    useEffect(() => {
        setBackground(getStoredBackground());
        setLanguage(getStoredLanguage());

        const stopBackgroundListener = listenForBackgroundChange(
            (nextBackground) => {
                setBackground(nextBackground);
            },
        );
        const stopLanguageListener = listenForLanguageChange((nextLanguage) => {
            setLanguage(nextLanguage);
        });

        return () => {
            stopBackgroundListener();
            stopLanguageListener();
        };
    }, []);

    function handleChangeBackground(nextBackground: BackgroundPreset) {
        setBackground(nextBackground);
        setStoredBackground(nextBackground);
    }

    const currentCopy = copy[language];

    return (
        <div className="cc-surface-inset cc-motion-fade-up rounded-[1.5rem] p-4 sm:p-5">
            <div className="mb-4 flex items-center justify-between gap-3">
                <p className="cc-text-subtle text-xs font-black uppercase tracking-[0.16em]">
                    {currentCopy.label}
                </p>

                <span className="cc-badge-accent">
                    {currentCopy.presets[background]}
                </span>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                {BACKGROUND_PRESETS.map((preset) => {
                    const isActive = preset === background;

                    return (
                        <button
                            key={preset}
                            type="button"
                            onClick={() => handleChangeBackground(preset)}
                            aria-pressed={isActive}
                            className={`cc-focus-ring cc-interactive-card min-h-20 rounded-2xl border p-3 text-left transition ${
                                isActive
                                    ? "border-cyan-300 bg-cyan-400/10 shadow-[0_0_0_1px_rgba(34,211,238,0.22)]"
                                    : "border-[var(--cc-border)] bg-[var(--cc-panel-soft)] hover:border-[var(--cc-accent)]"
                            }`}
                        >
                            <span className="flex items-center gap-3">
                                <span
                                    aria-hidden="true"
                                    className="cc-background-swatch h-11 w-14 shrink-0 rounded-xl"
                                    data-background-preview={preset}
                                />

                                <span className="min-w-0">
                                    <span className="cc-text-main block text-sm font-black">
                                        {currentCopy.presets[preset]}
                                    </span>

                                    {isActive ? (
                                        <span className="mt-1 block text-xs font-bold text-cyan-300">
                                            {currentCopy.active}
                                        </span>
                                    ) : null}
                                </span>
                            </span>
                        </button>
                    );
                })}
            </div>
        </div>
    );
}
