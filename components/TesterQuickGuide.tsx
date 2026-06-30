"use client";

import Link from "next/link";
import { useStoredLanguage } from "@/lib/clientStores";

const copy = {
    en: {
        eyebrow: "Student testing guide",
        title: "How to test Coursework Compass",
        description:
            "Use this short guide to explore the product like a first-time student tester. You do not need to test everything perfectly. Useful, confusing, or missing details are all valuable feedback.",
        steps: [
            {
                number: "01",
                title: "Start with the tutorial",
                description:
                    "Open the guided testing page first. It uses a tutorial-style flow so you can understand the planner before saving real project data.",
            },
            {
                number: "02",
                title: "Create a sample project",
                description:
                    "Choose a coursework template, set a deadline, select a planning intensity, and generate a task plan.",
            },
            {
                number: "03",
                title: "Explore the planner",
                description:
                    "Check Dashboard, Projects, Today, and the Project Detail page. Try editing, completing, restoring, archiving, and deleting tasks.",
            },
            {
                number: "04",
                title: "Send short feedback",
                description:
                    "At the end, share what felt useful, confusing, or missing. Even one or two clear comments can shape the next version.",
            },
        ],
        noteTitle: "Testing note",
        note:
            "This beta stores project data locally in the browser. Please avoid entering sensitive personal information while testing.",
        primaryAction: "Open guided tutorial",
        secondaryAction: "Create sample project",
    },
    zh: {
        eyebrow: "学生测试指南",
        title: "如何测试 Coursework Compass",
        description:
            "你可以用这份简短指南，像第一次使用的学生测试者一样体验产品。不需要把每一步都测得很完美。任何有用、困惑或缺失的地方，都是很有价值的反馈。",
        steps: [
            {
                number: "01",
                title: "先完成引导测试",
                description:
                    "建议先打开引导测试页面。它会用教程式流程帮助你理解 planner，再去创建真实项目数据。",
            },
            {
                number: "02",
                title: "创建一个示例项目",
                description:
                    "选择 coursework 模板，设置截止日期，选择规划强度，然后生成任务计划。",
            },
            {
                number: "03",
                title: "探索 planner",
                description:
                    "检查仪表盘、项目库、今日任务和项目详情页。尝试编辑、完成、恢复、归档和删除任务。",
            },
            {
                number: "04",
                title: "发送简短反馈",
                description:
                    "最后分享哪些地方有用、哪些地方困惑、哪些功能缺失。哪怕一两条清楚的反馈，也能直接影响下一个版本。",
            },
        ],
        noteTitle: "测试说明",
        note:
            "当前 beta 版本会把项目数据保存在当前浏览器中。测试时请避免输入敏感个人信息。",
        primaryAction: "打开引导测试",
        secondaryAction: "创建示例项目",
    },
} as const;

export default function TesterQuickGuide() {
    const language = useStoredLanguage();
    const currentCopy = copy[language];

    return (
        <section className="cc-card cc-motion-fade-up rounded-[2rem] p-5 sm:p-6">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div>
                    <p className="mb-2 text-sm font-black uppercase tracking-[0.18em] text-cyan-300">
                        {currentCopy.eyebrow}
                    </p>
                    <h2 className="cc-text-main text-2xl font-black tracking-tight sm:text-3xl">
                        {currentCopy.title}
                    </h2>
                    <p className="cc-text-muted mt-3 max-w-4xl text-sm leading-6 sm:text-base sm:leading-7">
                        {currentCopy.description}
                    </p>
                </div>

                <div className="flex shrink-0 flex-col gap-3 sm:flex-row lg:flex-col">
                    <Link
                        href="/test"
                        className="cc-button-primary rounded-2xl px-5 py-3 text-center text-sm"
                    >
                        {currentCopy.primaryAction}
                    </Link>

                    <Link
                        href="/projects/new"
                        className="cc-button-secondary rounded-2xl px-5 py-3 text-center text-sm"
                    >
                        {currentCopy.secondaryAction}
                    </Link>
                </div>
            </div>

            <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                {currentCopy.steps.map((step) => (
                    <article
                        key={step.number}
                        className="cc-surface-inset cc-motion-fade-up rounded-3xl p-4"
                    >
                        <p className="mb-3 text-sm font-black text-cyan-300">
                            {step.number}
                        </p>
                        <h3 className="cc-text-main font-bold">{step.title}</h3>
                        <p className="cc-text-subtle mt-2 text-sm leading-6">
                            {step.description}
                        </p>
                    </article>
                ))}
            </div>

            <div className="mt-5 rounded-3xl border border-amber-400/30 bg-amber-400/10 p-4">
                <p className="mb-2 text-sm font-bold text-amber-300">
                    {currentCopy.noteTitle}
                </p>
                <p className="cc-text-muted text-sm leading-6">{currentCopy.note}</p>
            </div>
        </section>
    );
}
