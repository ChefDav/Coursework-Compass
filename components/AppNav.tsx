"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import {
    createTranslator,
    getStoredLanguage,
    listenForLanguageChange,
    type Language,
} from "@/lib/i18n";
import { clearProjectPlans } from "@/lib/localStorage";

const navItems = [
    {
        labelKey: "mainMenu",
        href: "/",
    },
    {
        labelKey: "dashboard",
        href: "/dashboard",
    },
    {
        labelKey: "projects",
        href: "/projects",
    },
    {
        labelKey: "today",
        href: "/today",
    },
    {
        labelKey: "newProject",
        href: "/projects/new",
    },
    {
        labelKey: "updates",
        href: "/updates",
    },
] as const;

function isActivePath(pathname: string, href: string) {
    if (href === "/") {
        return pathname === "/";
    }

    if (href === "/projects") {
        return pathname === "/projects";
    }

    return pathname === href || pathname.startsWith(`${href}/`);
}

export default function AppNav() {
    const pathname = usePathname();
    const [language, setLanguage] = useState<Language>("en");
    const [hasMounted, setHasMounted] = useState(false);

    const t = createTranslator(language);

    useEffect(() => {
        setLanguage(getStoredLanguage());
        setHasMounted(true);

        const unsubscribe = listenForLanguageChange((nextLanguage) => {
            setLanguage(nextLanguage);
        });

        return () => {
            unsubscribe();
        };
    }, []);

    function handleResetData() {
        const message =
            language === "zh"
                ? "要重置当前浏览器中的所有 Coursework Compass 本地数据吗？这会删除保存在本浏览器中的项目和任务。"
                : "Reset all local Coursework Compass data in this browser? This will remove saved projects and tasks from this browser only.";

        const confirmed = window.confirm(message);

        if (!confirmed) {
            return;
        }

        clearProjectPlans();
        window.location.href = "/";
    }

    return (
        <header className="mb-6 rounded-[1.5rem] border border-slate-800 bg-slate-900/85 p-3 shadow-2xl shadow-cyan-950/20 backdrop-blur-md sm:mb-8 sm:rounded-[2rem] sm:p-5">
            <div className="flex items-start justify-between gap-3 lg:items-center">
                <a href="/" className="group min-w-0">
                    <p className="truncate text-lg font-black tracking-tight text-white transition group-hover:text-cyan-300 sm:text-xl">
                        {t("appName")}
                    </p>
                    <p className="mt-1 text-[0.65rem] font-bold uppercase tracking-[0.18em] text-slate-500 transition group-hover:text-cyan-400 sm:text-xs sm:tracking-[0.2em]">
                        {t("versionLabel")}
                    </p>
                </a>

                <details className="relative lg:hidden">
                    <summary className="list-none rounded-2xl border border-cyan-400/30 bg-cyan-400/10 px-4 py-3 text-sm font-black text-cyan-300">
                        {t("mainMenu")}
                    </summary>

                    <div className="absolute right-0 z-40 mt-3 w-[min(20rem,calc(100vw-2rem))] rounded-[1.5rem] border border-slate-800 bg-slate-950 p-3 shadow-2xl shadow-cyan-950/40">
                        <nav className="grid gap-2">
                            {navItems.map((item) => {
                                const isActive = isActivePath(pathname, item.href);

                                return (
                                    <a
                                        key={item.href}
                                        href={item.href}
                                        className={`rounded-2xl px-4 py-3 text-sm font-bold transition ${
                                            isActive
                                                ? "bg-cyan-400 text-slate-950"
                                                : item.href === "/"
                                                    ? "border border-emerald-400/30 bg-emerald-400/10 text-emerald-300"
                                                    : "border border-slate-800 bg-slate-900 text-slate-300"
                                        }`}
                                    >
                                        {t(item.labelKey)}
                                    </a>
                                );
                            })}

                            <LanguageSwitcher compact />

                            <button
                                type="button"
                                onClick={handleResetData}
                                className="rounded-2xl border border-red-400/30 bg-red-400/10 px-4 py-3 text-left text-sm font-bold text-red-300 transition hover:bg-red-400/20"
                            >
                                {t("resetData")}
                            </button>
                        </nav>
                    </div>
                </details>

                <nav className="hidden flex-wrap items-center justify-end gap-2 lg:flex">
                    {navItems.map((item) => {
                        const isActive = isActivePath(pathname, item.href);

                        return (
                            <a
                                key={item.href}
                                href={item.href}
                                className={`rounded-2xl px-4 py-3 text-sm font-bold transition ${
                                    isActive
                                        ? "bg-cyan-400 text-slate-950"
                                        : item.href === "/"
                                            ? "border border-emerald-400/30 bg-emerald-400/10 text-emerald-300 hover:bg-emerald-400/20"
                                            : "border border-slate-800 bg-slate-950/70 text-slate-300 hover:border-cyan-400 hover:text-cyan-300"
                                }`}
                            >
                                {t(item.labelKey)}
                            </a>
                        );
                    })}

                    <LanguageSwitcher />

                    <button
                        type="button"
                        onClick={handleResetData}
                        className="rounded-2xl border border-red-400/30 bg-red-400/10 px-4 py-3 text-sm font-bold text-red-300 transition hover:bg-red-400/20"
                    >
                        {t("resetData")}
                    </button>
                </nav>
            </div>

            <details className="mt-4 rounded-2xl border border-amber-400/30 bg-amber-400/10 p-3 sm:rounded-3xl sm:p-4 lg:hidden">
                <summary className="list-none text-sm font-black text-amber-300">
                    {t("browserOnlyStorageTitle")}
                </summary>

                <p className="mt-2 text-xs leading-5 text-slate-300">
                    {t("browserOnlyStorageShort")}
                </p>
            </details>

            <div className="mt-5 hidden rounded-3xl border border-amber-400/30 bg-amber-400/10 p-4 lg:block">
                <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                    <div>
                        <p className="mb-1 text-sm font-black text-amber-300">
                            {t("browserOnlyStorageTitle")}
                        </p>
                        <p className="max-w-4xl text-sm leading-6 text-slate-300">
                            {t("browserOnlyStorageLong")}
                        </p>
                    </div>

                    <span className="w-fit rounded-full border border-amber-400/30 bg-slate-950/60 px-3 py-1 text-xs font-black uppercase tracking-[0.16em] text-amber-300">
            {t("localOnly")}
          </span>
                </div>
            </div>

            {!hasMounted ? (
                <span className="sr-only">Loading language settings</span>
            ) : null}
        </header>
    );
}