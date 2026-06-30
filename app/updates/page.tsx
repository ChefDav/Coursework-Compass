"use client";

import Link from "next/link";
import AppNav from "@/components/AppNav";
import FeedbackPanel from "@/components/FeedbackPanel";
import { useStoredLanguage } from "@/lib/clientStores";

const copy = {
    en: {
        eyebrow: "Release notes",
        title: "v1.3 Multilingual Foundation",
        subtitle:
            "Coursework Compass v1.3 lays the groundwork for an English / Simplified Chinese planning experience and polishes the student testing flow.",
        joinTest: "Join student test",
        createProject: "Create a project",
        backHome: "Back to home",
        currentVersion: "Current version",
        currentTitle: "v1.3 Multilingual Foundation",
        currentDescription:
            "This release focuses on bilingual interface foundations, the redesigned New Project Studio, clearer date controls, better empty states, and safer browser-only beta messaging.",
        highlightsTitle: "What changed in v1.3",
        highlights: [
            "English / Simplified Chinese interface foundation",
            "Redesigned New Project Studio",
            "Expanded coursework template library",
            "Improved date picker styling",
            "Bilingual empty states and testing guidance",
            "Better student testing readiness",
            "Browser-only beta storage reminder",
        ],
        testingTitle: "Testing focus",
        testingDescription:
            "Students should test the language switcher, create a project from the Studio, open the saved project, edit tasks, check mobile layout, and confirm that local-storage reminders are clear.",
        historyTitle: "Version history",
        historySubtitle: "Older release notes are kept for context.",
        limitationsTitle: "Current limitations",
        limitations: [
            "Projects are saved only in the current browser during beta.",
            "There is no account system or cloud sync yet.",
            "Students should avoid sensitive personal information while testing.",
            "Feedback is still collected through email templates.",
        ],
        nextTitle: "Coming next",
        next: [
            "Use student testing feedback to guide the next feature pass.",
            "Continue improving Chinese copy where student wording feels unnatural.",
            "Plan account and sync features carefully after the local beta is stable.",
        ],
        released: "Released",
    },
    zh: {
        eyebrow: "更新日志",
        title: "v1.3 双语基础版",
        subtitle:
            "Coursework Compass v1.3 为英文 / 简体中文规划体验打基础，并进一步打磨学生测试流程。",
        joinTest: "参加学生测试",
        createProject: "创建项目",
        backHome: "返回首页",
        currentVersion: "当前版本",
        currentTitle: "v1.3 双语基础版",
        currentDescription:
            "这个版本重点完成双语界面基础、新版 Project Studio、更清晰的日期控件、更好的空状态，以及更安全的浏览器本地测试存储提示。",
        highlightsTitle: "v1.3 更新内容",
        highlights: [
            "英文 / 简体中文界面基础",
            "重新设计的新建项目 Project Studio",
            "扩展 coursework 模板库",
            "改进日期选择器样式",
            "双语空状态和测试指引",
            "更适合学生测试的细节打磨",
            "浏览器本地 beta 存储提醒",
        ],
        testingTitle: "测试重点",
        testingDescription:
            "学生可以重点测试语言切换、从 Studio 创建项目、打开已保存项目、编辑任务、检查移动端布局，并确认本地存储提醒是否清楚。",
        historyTitle: "版本历史",
        historySubtitle: "旧版本记录会保留，方便了解产品演进。",
        limitationsTitle: "当前限制",
        limitations: [
            "beta 期间，项目只保存在当前浏览器中。",
            "目前还没有账号系统或云端同步。",
            "测试时请避免输入敏感个人信息。",
            "反馈仍然通过邮件模板收集。",
        ],
        nextTitle: "下一步",
        next: [
            "根据真实学生测试反馈决定下一轮功能。",
            "继续优化中文表达，让学生读起来更自然。",
            "本地 beta 稳定后，再谨慎规划账号和同步功能。",
        ],
        released: "已发布",
    },
} as const;

const releaseHistory = [
    {
        version: "v1.2",
        title: "Student Testing Polish",
        description:
            "Completed the v1.2 student testing release. This version unified product version labels, added first-visit onboarding, improved empty states, clarified browser-only local storage, added clearer save success messages, improved mobile layout foundations, restored stable project deletion, repaired estimated time display and conversion, restored days-left indicators, fixed project detail hydration issues, unified inline error messages, and prepared the product for a more stable student testing session.",
    },
    {
        version: "v1.1.3",
        title: "Guided Test Flow + Homepage Restore",
        description:
            "Restored the homepage to a normal product entry, added a larger Join student test button, redesigned /test as an isolated tutorial sandbox, added a feedback loading screen, and added a final congratulations screen after testing.",
    },
    {
        version: "v1.1.2",
        title: "Student Testing Guide",
        description:
            "Added a dedicated /test student testing page, a three-step testing route, suggested sample projects, clearer feedback instructions, and student testing labels in feedback email subjects.",
    },
    {
        version: "v1.1.1",
        title: "Pre-Test Polish",
        description:
            "Added clearer tester guidance, short feedback prompts, a focused What to test checklist, and mobile testing guidance before the Year 12 testing session.",
    },
    {
        version: "v1.1",
        title: "Editable Planner",
        description:
            "Coursework Compass added support for adding, editing, deleting, completing, restoring, and archiving tasks. This made the app usable as a real planning workspace, not just a task generator.",
    },
    {
        version: "v1.0.x",
        title: "Student Testing Preparation",
        description:
            "Added more templates, custom dropdown UI, calendar date picker, IB exam countdown, movable world clock, testing guide, beta notice, and structured feedback panel.",
    },
    {
        version: "v1.0",
        title: "Public MVP",
        description:
            "The first public version allowed students to create coursework plans, save them locally, track progress, and use Dashboard, Today, Projects, and Project Details.",
    },
];

export default function UpdatesPage() {
    const language = useStoredLanguage();
    const currentCopy = copy[language];

    return (
        <main className="min-h-screen bg-slate-950 text-white">
            <section className="mx-auto max-w-6xl px-4 py-6 sm:px-6 sm:py-8">
                <AppNav />

                <section className="py-12 sm:py-16">
                    <div className="mb-6 inline-flex rounded-full border border-cyan-400/30 bg-cyan-400/10 px-4 py-2 text-xs font-black uppercase tracking-[0.2em] text-cyan-300">
                        {currentCopy.eyebrow}
                    </div>

                    <h1 className="max-w-4xl text-5xl font-black tracking-tight sm:text-6xl">
                        {currentCopy.title}
                    </h1>

                    <p className="mt-6 max-w-3xl text-base leading-8 text-slate-300 sm:text-lg">
                        {currentCopy.subtitle}
                    </p>

                    <div className="mt-8 flex flex-col gap-4 sm:flex-row">
                        <Link
                            href="/test"
                            className="rounded-2xl bg-emerald-400 px-6 py-4 text-center font-bold text-slate-950 transition hover:bg-emerald-300"
                        >
                            {currentCopy.joinTest}
                        </Link>

                        <Link
                            href="/projects/new"
                            className="rounded-2xl bg-cyan-400 px-6 py-4 text-center font-bold text-slate-950 transition hover:bg-cyan-300"
                        >
                            {currentCopy.createProject}
                        </Link>

                        <Link
                            href="/"
                            className="rounded-2xl border border-slate-700 px-6 py-4 text-center font-bold text-white transition hover:border-slate-400"
                        >
                            {currentCopy.backHome}
                        </Link>
                    </div>
                </section>

                <section className="rounded-[2rem] border border-cyan-400/30 bg-cyan-400/10 p-5 sm:p-8">
                    <p className="mb-2 text-sm font-bold text-cyan-300">
                        {currentCopy.currentVersion}
                    </p>
                    <h2 className="text-3xl font-black sm:text-4xl">
                        {currentCopy.currentTitle}
                    </h2>
                    <p className="mt-4 max-w-3xl text-sm leading-6 text-slate-300">
                        {currentCopy.currentDescription}
                    </p>
                </section>

                <section className="mt-10 rounded-[2rem] border border-emerald-400/30 bg-emerald-400/10 p-5 sm:p-8">
                    <h2 className="text-3xl font-black tracking-tight sm:text-4xl">
                        {currentCopy.highlightsTitle}
                    </h2>

                    <div className="mt-6 grid gap-4 md:grid-cols-2">
                        {currentCopy.highlights.map((item) => (
                            <div
                                key={item}
                                className="rounded-3xl border border-slate-800 bg-slate-950/70 p-4"
                            >
                                <p className="text-sm font-bold leading-6 text-slate-200">
                                    {item}
                                </p>
                            </div>
                        ))}
                    </div>
                </section>

                <section className="mt-10 rounded-[2rem] border border-amber-400/30 bg-amber-400/10 p-5 sm:p-8">
                    <h2 className="text-3xl font-black tracking-tight sm:text-4xl">
                        {currentCopy.testingTitle}
                    </h2>
                    <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-300">
                        {currentCopy.testingDescription}
                    </p>
                </section>

                <section className="mt-16 grid gap-6 md:grid-cols-2">
                    <div className="rounded-[2rem] border border-amber-400/30 bg-amber-400/10 p-5 sm:p-6">
                        <h2 className="text-2xl font-black sm:text-3xl">
                            {currentCopy.limitationsTitle}
                        </h2>

                        <div className="mt-5 space-y-3">
                            {currentCopy.limitations.map((item) => (
                                <div
                                    key={item}
                                    className="rounded-2xl border border-slate-800 bg-slate-950/60 p-4"
                                >
                                    <p className="text-sm leading-6 text-slate-300">{item}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="rounded-[2rem] border border-emerald-400/30 bg-emerald-400/10 p-5 sm:p-6">
                        <h2 className="text-2xl font-black sm:text-3xl">
                            {currentCopy.nextTitle}
                        </h2>

                        <div className="mt-5 space-y-3">
                            {currentCopy.next.map((item) => (
                                <div
                                    key={item}
                                    className="rounded-2xl border border-slate-800 bg-slate-950/60 p-4"
                                >
                                    <p className="text-sm leading-6 text-slate-300">{item}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                <section className="mt-16">
                    <div className="mb-6">
                        <p className="mb-2 text-sm font-bold text-cyan-300">
                            {currentCopy.historyTitle}
                        </p>
                        <h2 className="text-3xl font-black tracking-tight sm:text-4xl">
                            {currentCopy.historySubtitle}
                        </h2>
                    </div>

                    <div className="space-y-5">
                        {releaseHistory.map((update) => (
                            <div
                                key={update.version}
                                className="rounded-[2rem] border border-slate-800 bg-slate-900 p-5 sm:p-6"
                            >
                                <div className="mb-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                                    <div>
                                        <p className="mb-1 text-sm font-black text-cyan-300">
                                            {update.version}
                                        </p>
                                        <h3 className="text-2xl font-black">{update.title}</h3>
                                    </div>

                                    <span className="w-fit rounded-full border border-cyan-400/30 bg-cyan-400/10 px-4 py-2 text-xs font-black uppercase tracking-[0.2em] text-cyan-300">
                                        {currentCopy.released}
                                    </span>
                                </div>

                                <p className="max-w-4xl text-sm leading-6 text-slate-300">
                                    {update.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </section>

                <section className="mt-16">
                    <FeedbackPanel />
                </section>
            </section>
        </main>
    );
}
