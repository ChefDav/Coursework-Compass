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
            <div className="rounded-2xl border border-slate-800 bg-slate-950/70 px-4 py-3 text-sm font-bold text-slate-500">
                Language
            </div>
        );
    }

    if (compact) {
        return (
            <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-2">
                <p className="mb-2 px-2 text-xs font-black uppercase tracking-[0.16em] text-slate-500">
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
                                className={`rounded-xl px-3 py-2 text-xs font-black transition ${
                                    isActive
                                        ? "bg-cyan-400 text-slate-950"
                                        : "border border-slate-800 bg-slate-900 text-slate-300 hover:border-cyan-400 hover:text-cyan-300"
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
        <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-2">
            <div className="flex flex-wrap items-center gap-2">
        <span className="px-2 text-xs font-black uppercase tracking-[0.16em] text-slate-500">
          {t("language")}
        </span>

                {languages.map((item) => {
                    const isActive = item.code === language;

                    return (
                        <button
                            key={item.code}
                            type="button"
                            onClick={() => handleChangeLanguage(item.code)}
                            className={`rounded-xl px-3 py-2 text-xs font-black transition ${
                                isActive
                                    ? "bg-cyan-400 text-slate-950"
                                    : "border border-slate-800 bg-slate-900 text-slate-300 hover:border-cyan-400 hover:text-cyan-300"
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
