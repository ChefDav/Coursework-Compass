"use client";

import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { useHasMounted, useStoredLanguage } from "@/lib/clientStores";

const ONBOARDING_STORAGE_KEY =
    "coursework-compass-v1-3-onboarding-dismissed";

const copy = {
    en: {
        badge: "v1.4 Personalisation Version",
        title: "Welcome to Coursework Compass.",
        description:
            "Coursework Compass helps IB and A-Level students turn large coursework projects into clearer tasks, deadlines, and daily actions. This version adds dark/light themes, saved preferences, background presets, and personalisation polish.",
        close: "Close",
        cards: [
            {
                number: "01",
                title: "Create a plan",
                description:
                    "Start with a template, choose a deadline, and create a task plan.",
            },
            {
                number: "02",
                title: "Switch language",
                description:
                    "Use English or Simplified Chinese while the v1.4 personal workspace polish continues.",
            },
            {
                number: "03",
                title: "Send feedback",
                description:
                    "One clear sentence can help improve the next version.",
            },
        ],
        dataTitle: "Before you save project data",
        dataNotes: [
            "This beta saves projects in the local storage of this browser. It does not currently create an online account or sync data across devices.",
            "Your saved projects may not appear if you switch device, switch browser, clear browser data, use private browsing, or press Reset data.",
            "Please avoid private or sensitive personal information during testing. Sample project names are enough.",
        ],
        startPlanning: "Start planning",
        joinTest: "Join student test",
        explore: "Explore first",
    },
    zh: {
        badge: "v1.4 个性化版本",
        title: "欢迎使用 Coursework Compass。",
        description:
            "Coursework Compass 帮助 IB 和 A-Level 学生把大型 coursework 项目拆成更清晰的任务、截止日期和每日行动。这个版本加入深色/浅色主题、保存的偏好、背景预设和个性化打磨。",
        close: "关闭",
        cards: [
            {
                number: "01",
                title: "创建计划",
                description:
                    "从模板开始，选择截止日期，并创建任务计划。",
            },
            {
                number: "02",
                title: "切换语言",
                description:
                    "可以使用英文或简体中文；v1.4 会继续打磨更个人化的学习空间。",
            },
            {
                number: "03",
                title: "发送反馈",
                description:
                    "一句清楚的反馈，也能帮助改进下一个版本。",
            },
        ],
        dataTitle: "保存项目数据前请注意",
        dataNotes: [
            "当前 beta 会把项目保存在这个浏览器的本地存储中，目前没有在线账号，也不会跨设备同步。",
            "如果你更换设备、更换浏览器、清除浏览器数据、使用无痕模式，或点击重置数据，已保存项目可能不会显示。",
            "测试时请避免输入隐私或敏感个人信息。使用示例项目名称就足够了。",
        ],
        startPlanning: "开始规划",
        joinTest: "参加学生测试",
        explore: "先随便看看",
    },
} as const;

export default function OnboardingPopup() {
    const pathname = usePathname();
    const hasMounted = useHasMounted();
    const language = useStoredLanguage();
    const currentCopy = copy[language];
    const [dismissedNow, setDismissedNow] = useState(false);

    function handleClose() {
        window.localStorage.setItem(ONBOARDING_STORAGE_KEY, "true");
        setDismissedNow(true);
    }

    const hasDismissed =
        hasMounted && Boolean(window.localStorage.getItem(ONBOARDING_STORAGE_KEY));
    const isOpen = hasMounted && pathname !== "/test" && !hasDismissed && !dismissedNow;

    if (!isOpen) {
        return null;
    }

    return (
        <div className="cc-modal-overlay fixed inset-0 z-50 flex items-end justify-center px-3 py-3 backdrop-blur-md sm:items-center sm:px-4 sm:py-6">
            <section className="cc-panel-strong relative max-h-[calc(100dvh-1.5rem)] w-full max-w-3xl overflow-y-auto rounded-[1.5rem] border-cyan-400/30 p-4 sm:max-h-[90vh] sm:rounded-[2rem] sm:p-8">
                <div className="relative z-10">
                    <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                        <div>
                            <div className="mb-4 inline-flex rounded-full border border-cyan-400/30 bg-cyan-400/10 px-3 py-2 text-[0.65rem] font-black uppercase tracking-[0.18em] text-cyan-300 sm:px-4 sm:text-xs">
                                {currentCopy.badge}
                            </div>

                            <h2 className="text-3xl font-black tracking-tight sm:text-4xl">
                                {currentCopy.title}
                            </h2>

                            <p className="cc-text-muted mt-3 max-w-2xl text-sm leading-6">
                                {currentCopy.description}
                            </p>
                        </div>

                        <button
                            type="button"
                            onClick={handleClose}
                            className="cc-button-secondary hidden w-fit rounded-2xl px-4 py-3 text-sm sm:inline-flex"
                        >
                            {currentCopy.close}
                        </button>
                    </div>

                    <div className="grid gap-3 sm:gap-4 md:grid-cols-3">
                        {currentCopy.cards.map((card) => (
                            <div
                                key={card.number}
                                className="cc-surface-inset rounded-2xl p-4 sm:rounded-[1.5rem]"
                            >
                                <p className="mb-2 text-sm font-black text-cyan-300">
                                    {card.number}
                                </p>
                                <h3 className="cc-text-main mb-2 font-bold">{card.title}</h3>
                                <p className="cc-text-subtle text-sm leading-6">
                                    {card.description}
                                </p>
                            </div>
                        ))}
                    </div>

                    <div className="mt-5 rounded-2xl border border-amber-400/30 bg-amber-400/10 p-4 sm:rounded-3xl">
                        <p className="mb-2 text-sm font-bold text-amber-300">
                            {currentCopy.dataTitle}
                        </p>

                        <div className="cc-text-muted space-y-2 text-sm leading-6">
                            {currentCopy.dataNotes.map((note) => (
                                <p key={note}>{note}</p>
                            ))}
                        </div>
                    </div>

                    <div className="sticky bottom-0 -mx-4 mt-6 grid gap-3 border-t border-[var(--cc-border)] bg-[var(--cc-panel-strong)] px-4 pt-4 backdrop-blur-md sm:static sm:mx-0 sm:flex sm:flex-wrap sm:border-t-0 sm:bg-transparent sm:px-0 sm:pt-0">
                        <Link
                            href="/projects/new"
                            onClick={handleClose}
                            className="cc-button-primary rounded-2xl px-6 py-4 text-center text-sm"
                        >
                            {currentCopy.startPlanning}
                        </Link>

                        <Link
                            href="/test"
                            onClick={handleClose}
                            className="cc-button-success rounded-2xl px-6 py-4 text-center text-sm"
                        >
                            {currentCopy.joinTest}
                        </Link>

                        <button
                            type="button"
                            onClick={handleClose}
                            className="cc-button-secondary rounded-2xl px-6 py-4 text-center text-sm"
                        >
                            {currentCopy.explore}
                        </button>
                    </div>
                </div>
            </section>
        </div>
    );
}
