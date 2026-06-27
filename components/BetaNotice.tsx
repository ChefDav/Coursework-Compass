"use client";

import { useEffect, useState } from "react";
import {
    createTranslator,
    getStoredLanguage,
    listenForLanguageChange,
    type Language,
} from "@/lib/i18n";

export default function BetaNotice() {
    const [language, setLanguage] = useState<Language>("en");

    useEffect(() => {
        setLanguage(getStoredLanguage());

        const unsubscribe = listenForLanguageChange((nextLanguage) => {
            setLanguage(nextLanguage);
        });

        return () => {
            unsubscribe();
        };
    }, []);

    const t = createTranslator(language);

    return (
        <section className="rounded-[2rem] border border-cyan-400/30 bg-cyan-400/10 p-5 shadow-2xl shadow-cyan-950/20 sm:p-6">
            <div className="mb-5 flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                <div>
                    <p className="mb-2 text-sm font-bold text-cyan-300">
                        {t("betaNoticeEyebrow")}
                    </p>
                    <h2 className="text-2xl font-black sm:text-3xl">
                        {t("betaNoticeTitle")}
                    </h2>
                    <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-300">
                        {t("betaNoticeDescription")}
                    </p>

                    <div className="mt-5 flex flex-col gap-3 sm:flex-row">
                        <a
                            href="/updates"
                            className="rounded-2xl bg-cyan-400 px-5 py-3 text-center text-sm font-bold text-slate-950 transition hover:bg-cyan-300"
                        >
                            {t("viewReleaseNotes")}
                        </a>

                        <a
                            href="/test"
                            className="rounded-2xl bg-emerald-400 px-5 py-3 text-center text-sm font-bold text-slate-950 transition hover:bg-emerald-300"
                        >
                            {t("joinStudentTest")}
                        </a>

                        <a
                            href="/projects/new"
                            className="rounded-2xl border border-slate-700 px-5 py-3 text-center text-sm font-bold text-white transition hover:border-slate-400"
                        >
                            {t("startPlanning")}
                        </a>
                    </div>
                </div>

                <span className="w-fit rounded-full border border-emerald-400/30 bg-emerald-400/10 px-4 py-2 text-xs font-black uppercase tracking-[0.2em] text-emerald-300">
          {t("betaNoticeBadge")}
        </span>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
                <div className="rounded-3xl border border-slate-800 bg-slate-950/70 p-4">
                    <p className="mb-2 text-sm font-black text-cyan-300">
                        {t("betaCardOneNumber")}
                    </p>
                    <h3 className="mb-2 font-bold text-white">
                        {t("betaCardOneTitle")}
                    </h3>
                    <p className="text-sm leading-6 text-slate-400">
                        {t("betaCardOneDescription")}
                    </p>
                </div>

                <div className="rounded-3xl border border-slate-800 bg-slate-950/70 p-4">
                    <p className="mb-2 text-sm font-black text-cyan-300">
                        {t("betaCardTwoNumber")}
                    </p>
                    <h3 className="mb-2 font-bold text-white">
                        {t("betaCardTwoTitle")}
                    </h3>
                    <p className="text-sm leading-6 text-slate-400">
                        {t("betaCardTwoDescription")}
                    </p>
                </div>

                <div className="rounded-3xl border border-slate-800 bg-slate-950/70 p-4">
                    <p className="mb-2 text-sm font-black text-cyan-300">
                        {t("betaCardThreeNumber")}
                    </p>
                    <h3 className="mb-2 font-bold text-white">
                        {t("betaCardThreeTitle")}
                    </h3>
                    <p className="text-sm leading-6 text-slate-400">
                        {t("betaCardThreeDescription")}
                    </p>
                </div>
            </div>

            <div className="mt-5 rounded-3xl border border-amber-400/30 bg-amber-400/10 p-4">
                <p className="mb-2 text-sm font-bold text-amber-300">
                    {t("importantDataNoteTitle")}
                </p>
                <div className="space-y-2 text-sm leading-6 text-slate-300">
                    <p>{t("importantDataNoteOne")}</p>
                    <p>{t("importantDataNoteTwo")}</p>
                    <p>{t("importantDataNoteThree")}</p>
                </div>
            </div>
        </section>
    );
}