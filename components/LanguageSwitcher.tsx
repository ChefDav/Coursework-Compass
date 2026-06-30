"use client";

import { useHasMounted, useStoredLanguage } from "@/lib/clientStores";
import {
    createTranslator,
    languages,
    saveStoredLanguage,
    type Language,
} from "@/lib/i18n";

type LanguageSwitcherProps = {
    compact?: boolean;
};

export default function LanguageSwitcher({
                                             compact = false,
                                         }: LanguageSwitcherProps) {
    const language = useStoredLanguage();
    const hasMounted = useHasMounted();

    const t = createTranslator(language);

    function handleChangeLanguage(nextLanguage: Language) {
        saveStoredLanguage(nextLanguage);
    }

    if (!hasMounted) {
        return (
            <div className="cc-surface-inset cc-text-subtle rounded-2xl px-4 py-3 text-sm font-bold">
                Language
            </div>
        );
    }

    if (compact) {
        return (
            <div className="cc-surface-inset rounded-2xl p-2">
                <p className="cc-text-subtle mb-2 px-2 text-xs font-black uppercase tracking-[0.16em]">
                    {t("language")}
                </p>

                <div className="grid grid-cols-2 gap-2">
                    {languages.map((item) => {
                        const isActive = item.code === language;

                        return (
                            <button
                                key={item.code}
                                type="button"
                                onClick={() => handleChangeLanguage(item.code)}
                                className={`cc-interactive-button rounded-xl px-3 py-2 text-xs font-black transition ${
                                    isActive
                                        ? "cc-button-primary"
                                        : "cc-button-secondary"
                                }`}
                            >
                                {item.shortLabel}
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
          {t("language")}
        </span>

                {languages.map((item) => {
                    const isActive = item.code === language;

                    return (
                        <button
                            key={item.code}
                            type="button"
                            onClick={() => handleChangeLanguage(item.code)}
                            className={`cc-interactive-button rounded-xl px-3 py-2 text-xs font-black transition ${
                                isActive
                                    ? "cc-button-primary"
                                    : "cc-button-secondary"
                            }`}
                        >
                            {item.label}
                        </button>
                    );
                })}
            </div>
        </div>
    );
}
