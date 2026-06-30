"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import ThemeSwitcher from "@/components/ThemeSwitcher";
import { useHasMounted, useStoredLanguage } from "@/lib/clientStores";
import { createTranslator } from "@/lib/i18n";
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
    const language = useStoredLanguage();
    const hasMounted = useHasMounted();

    const t = createTranslator(language);

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
        <header className="cc-panel cc-motion-fade-up mb-6 rounded-[1.5rem] p-3 sm:mb-8 sm:rounded-[2rem] sm:p-5">
            <div className="grid gap-4 xl:grid-cols-[minmax(15rem,22rem)_1fr] xl:items-start">
                <div className="flex items-start justify-between gap-3 xl:block">
                    <Link href="/" className="group cc-focus-ring min-w-0 rounded-2xl px-2 py-1">
                        <p className="cc-text-main max-w-[18rem] truncate text-lg font-black leading-tight tracking-tight transition group-hover:text-cyan-300 sm:max-w-none sm:text-xl xl:whitespace-normal">
                            {t("appName")}
                        </p>
                        <p className="cc-text-subtle mt-1 max-w-[12rem] text-[0.65rem] font-black uppercase tracking-[0.14em] transition group-hover:text-cyan-400 sm:max-w-none sm:text-xs xl:leading-5">
                            {t("versionLabel")}
                        </p>
                    </Link>

                    <details className="relative xl:hidden">
                        <summary className="cc-button-secondary list-none rounded-2xl px-4 py-3 text-sm">
                            {t("mainMenu")}
                        </summary>

                        <div className="cc-panel-strong cc-motion-scale-in absolute right-0 z-40 mt-3 w-[min(20rem,calc(100vw-2rem))] rounded-[1.5rem] p-3">
                            <nav className="grid gap-2">
                                {navItems.map((item) => {
                                    const isActive = isActivePath(pathname, item.href);

                                    return (
                                        <Link
                                            key={item.href}
                                            href={item.href}
                                            className={`cc-interactive-button rounded-2xl px-4 py-3 text-sm font-bold transition ${
                                                isActive
                                                    ? "cc-button-primary"
                                                    : item.href === "/"
                                                        ? "cc-button-secondary hover:border-emerald-400 hover:text-emerald-300"
                                                        : "cc-button-secondary"
                                            }`}
                                        >
                                            {t(item.labelKey)}
                                        </Link>
                                    );
                                })}

                                <LanguageSwitcher compact />
                                <ThemeSwitcher compact />

                                <button
                                    type="button"
                                    onClick={handleResetData}
                                    className="cc-button-danger rounded-2xl px-4 py-3 text-sm"
                                >
                                    {t("resetData")}
                                </button>
                            </nav>
                        </div>
                    </details>
                </div>

                <div className="hidden xl:grid xl:justify-items-end xl:gap-4">
                    <nav className="flex flex-nowrap justify-end gap-2">
                        {navItems.map((item) => {
                            const isActive = isActivePath(pathname, item.href);

                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className={`cc-interactive-button min-w-[6.5rem] whitespace-nowrap rounded-2xl px-3 py-3 text-center text-sm font-bold transition ${
                                            isActive
                                            ? "cc-button-primary"
                                            : item.href === "/"
                                                ? "cc-button-secondary hover:border-emerald-400 hover:text-emerald-300"
                                                : "cc-button-secondary"
                                    }`}
                                >
                                    {t(item.labelKey)}
                                </Link>
                            );
                        })}
                    </nav>

                    <div className="flex flex-nowrap items-center justify-end gap-3">
                        <LanguageSwitcher />
                        <ThemeSwitcher />

                        <button
                            type="button"
                            onClick={handleResetData}
                            className="cc-button-danger whitespace-nowrap rounded-2xl px-5 py-3 text-sm"
                        >
                            {t("resetData")}
                        </button>
                    </div>
                </div>
            </div>

            <details className="mt-4 rounded-2xl border border-amber-400/30 bg-amber-400/10 p-3 sm:rounded-3xl sm:p-4 xl:hidden">
                <summary className="list-none text-sm font-black text-amber-300">
                    {t("browserOnlyStorageTitle")}
                </summary>

                <p className="cc-text-muted mt-2 text-xs leading-5">
                    {t("browserOnlyStorageShort")}
                </p>
            </details>

            <div className="mt-5 hidden rounded-[1.5rem] border border-amber-400/30 bg-amber-400/10 p-4 xl:block">
                <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                    <div>
                        <p className="mb-1 text-sm font-black text-amber-300">
                            {t("browserOnlyStorageTitle")}
                        </p>
                        <p className="cc-text-muted max-w-4xl text-sm leading-6">
                            {t("browserOnlyStorageLong")}
                        </p>
                    </div>

                    <span className="w-fit whitespace-nowrap rounded-full border border-amber-400/30 bg-amber-400/10 px-3 py-1 text-xs font-black uppercase tracking-[0.16em] text-amber-300">
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
