"use client";

import Link from "next/link";
import { useStoredLanguage } from "@/lib/clientStores";
import { createTranslator } from "@/lib/i18n";

export default function BetaNotice() {
    const language = useStoredLanguage();
    const t = createTranslator(language);

    return (
        <section className="cc-card cc-motion-fade-up rounded-[2rem] border-cyan-400/30 p-5 sm:p-6">
            <div className="mb-5 flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                <div>
                    <p className="mb-2 text-sm font-bold text-cyan-300">
                        {t("betaNoticeEyebrow")}
                    </p>
                    <h2 className="cc-text-main text-2xl font-black sm:text-3xl">
                        {t("betaNoticeTitle")}
                    </h2>
                    <p className="cc-text-muted mt-3 max-w-3xl text-sm leading-6">
                        {t("betaNoticeDescription")}
                    </p>

                    <div className="mt-5 flex flex-col gap-3 sm:flex-row">
                        <Link
                            href="/updates"
                            className="cc-button-primary rounded-2xl px-5 py-3 text-center text-sm"
                        >
                            {t("viewReleaseNotes")}
                        </Link>

                        <Link
                            href="/test"
                            className="cc-button-success rounded-2xl px-5 py-3 text-center text-sm"
                        >
                            {t("joinStudentTest")}
                        </Link>

                        <Link
                            href="/projects/new"
                            className="cc-button-secondary rounded-2xl px-5 py-3 text-center text-sm"
                        >
                            {t("startPlanning")}
                        </Link>
                    </div>
                </div>

                <span className="w-fit rounded-full border border-emerald-400/30 bg-emerald-400/10 px-4 py-2 text-xs font-black uppercase tracking-[0.2em] text-emerald-300">
          {t("betaNoticeBadge")}
        </span>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
                <div className="cc-surface-inset cc-motion-fade-up rounded-3xl p-4">
                    <p className="mb-2 text-sm font-black text-cyan-300">
                        {t("betaCardOneNumber")}
                    </p>
                    <h3 className="cc-text-main mb-2 font-bold">
                        {t("betaCardOneTitle")}
                    </h3>
                    <p className="cc-text-subtle text-sm leading-6">
                        {t("betaCardOneDescription")}
                    </p>
                </div>

                <div className="cc-surface-inset cc-motion-fade-up rounded-3xl p-4">
                    <p className="mb-2 text-sm font-black text-cyan-300">
                        {t("betaCardTwoNumber")}
                    </p>
                    <h3 className="cc-text-main mb-2 font-bold">
                        {t("betaCardTwoTitle")}
                    </h3>
                    <p className="cc-text-subtle text-sm leading-6">
                        {t("betaCardTwoDescription")}
                    </p>
                </div>

                <div className="cc-surface-inset cc-motion-fade-up rounded-3xl p-4">
                    <p className="mb-2 text-sm font-black text-cyan-300">
                        {t("betaCardThreeNumber")}
                    </p>
                    <h3 className="cc-text-main mb-2 font-bold">
                        {t("betaCardThreeTitle")}
                    </h3>
                    <p className="cc-text-subtle text-sm leading-6">
                        {t("betaCardThreeDescription")}
                    </p>
                </div>
            </div>

            <div className="mt-5 rounded-3xl border border-amber-400/30 bg-amber-400/10 p-4">
                <p className="mb-2 text-sm font-bold text-amber-300">
                    {t("importantDataNoteTitle")}
                </p>
                <div className="cc-text-muted space-y-2 text-sm leading-6">
                    <p>{t("importantDataNoteOne")}</p>
                    <p>{t("importantDataNoteTwo")}</p>
                    <p>{t("importantDataNoteThree")}</p>
                </div>
            </div>
        </section>
    );
}
