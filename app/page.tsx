"use client";

import Link from "next/link";
import AppNav from "@/components/AppNav";
import BetaNotice from "@/components/BetaNotice";
import ExamCountdownCard from "@/components/ExamCountdownCard";
import FeedbackLink from "@/components/FeedbackLink";
import FeedbackPanel from "@/components/FeedbackPanel";
import TesterQuickGuide from "@/components/TesterQuickGuide";
import TestingGuideCard from "@/components/TestingGuideCard";
import { useStoredLanguage } from "@/lib/clientStores";

const copy = {
    en: {
        badge: "Coursework Compass v1.3 Multilingual Foundation",
        title: "Turn coursework chaos into a clear daily plan.",
        subtitle:
            "Coursework Compass helps IB and A-Level students break major projects into manageable tasks, deadlines, progress, and daily execution. Create a plan, edit it, and keep moving in English or Simplified Chinese.",
        startPlanning: "Start planning",
        openDashboard: "Open dashboard",
        missionEyebrow: "Today's mission",
        missionTitle: "Know exactly what to do next.",
        missionText:
            "A coursework plan should be visible, editable, and calm enough to act on.",
        sampleProject: "Math IA Exploration",
        active: "Active",
        completeText: "72% complete · deadline approaching",
        generatedPlan: "Generated task plan",
        taskOne: "Refine research question",
        taskOneMeta: "High priority · 45 min",
        taskTwo: "Create data collection table",
        taskTwoMeta: "Medium priority · 30 min",
        taskThree: "Draft method section",
        done: "Done",
        testingEyebrow: "Student testing route",
        testingTitle: "Joining the test? Start from the guided tutorial.",
        testingText:
            "The test route is separated into an independent tutorial, so students can try the workflow safely before creating real browser-saved project data.",
        joinTest: "Join student test",
        releaseNotes: "View release notes",
        countdownEyebrow: "Countdown pressure",
        countdownTitle: "Deadlines become clearer when time is visible.",
        countdownText:
            "Coursework Compass includes countdown-oriented planning so major projects feel less invisible.",
        howEyebrow: "How it works",
        howTitle: "From vague coursework to visible progress.",
        featuresEyebrow: "v1.3 features",
        featuresTitle: "Built for real student workflows.",
        templatesEyebrow: "Supported templates",
        templatesTitle: "Start with a subject-specific structure.",
        templatesText:
            "The v1.3 template library covers common IB, A-Level, EPQ, and university application work.",
        readyEyebrow: "Ready to plan?",
        readyTitle: "Create your first coursework plan.",
        readyText:
            "Use the normal planner for a real project, or use the guided test route if you are joining the student testing session.",
        createProject: "Create project",
        workflowSteps: [
            {
                number: "01",
                title: "Choose your coursework type",
                description:
                    "Pick a template for IA, EE, TOK, IO, EPQ, personal statement, or another major academic project.",
            },
            {
                number: "02",
                title: "Set your deadline",
                description:
                    "Use the calendar picker to choose a real deadline. Coursework Compass turns it into a structured plan.",
            },
            {
                number: "03",
                title: "Generate and edit your plan",
                description:
                    "Create tasks, add custom work, edit task details, delete tasks, and track progress from Dashboard and Today.",
            },
        ],
        featureCards: [
            {
                title: "Bilingual foundation",
                description:
                    "Switch between English and Simplified Chinese across the main planning and testing surfaces.",
            },
            {
                title: "Editable task workspace",
                description:
                    "Add, edit, delete, complete, restore, and archive tasks as real coursework changes.",
            },
            {
                title: "Browser-only beta clarity",
                description:
                    "Local storage reminders make the testing data boundary visible before students rely on the app.",
            },
        ],
    },
    zh: {
        badge: "Coursework Compass v1.3 多语言基础版本",
        title: "把混乱的 coursework 变成清晰的每日计划。",
        subtitle:
            "Coursework Compass 帮助 IB 和 A-Level 学生把大型项目拆成可执行的任务、截止日期、进度和每日行动。你可以用英文或简体中文创建计划、编辑任务并持续推进。",
        startPlanning: "开始规划",
        openDashboard: "打开仪表盘",
        missionEyebrow: "今日任务",
        missionTitle: "明确知道下一步该做什么。",
        missionText:
            "好的 coursework 计划应该可见、可编辑，并且清晰到可以马上行动。",
        sampleProject: "数学 IA 探究",
        active: "活跃",
        completeText: "72% 完成 · 截止日期接近",
        generatedPlan: "生成的任务计划",
        taskOne: "优化 research question",
        taskOneMeta: "高优先级 · 45 分钟",
        taskTwo: "创建数据收集表",
        taskTwoMeta: "中优先级 · 30 分钟",
        taskThree: "起草方法部分",
        done: "已完成",
        testingEyebrow: "学生测试路线",
        testingTitle: "参加测试？建议先从引导教程开始。",
        testingText:
            "测试路线是独立教程，学生可以先安全体验工作流，再创建真实保存在浏览器中的项目数据。",
        joinTest: "参加学生测试",
        releaseNotes: "查看更新日志",
        countdownEyebrow: "截止日期压力",
        countdownTitle: "时间可见后，截止日期会更清楚。",
        countdownText:
            "Coursework Compass 包含倒计时式规划，让大型项目不再像一团看不见的压力。",
        howEyebrow: "使用方式",
        howTitle: "从模糊 coursework 到可见进度。",
        featuresEyebrow: "v1.3 功能",
        featuresTitle: "为真实学生工作流设计。",
        templatesEyebrow: "支持的模板",
        templatesTitle: "从学科结构开始。",
        templatesText:
            "v1.3 模板库覆盖常见 IB、A-Level、EPQ 和大学申请相关工作。",
        readyEyebrow: "准备开始？",
        readyTitle: "创建你的第一个 coursework 计划。",
        readyText:
            "如果要创建真实项目，请使用正常规划器；如果是参加学生测试，可以先走引导测试路线。",
        createProject: "创建项目",
        workflowSteps: [
            {
                number: "01",
                title: "选择 coursework 类型",
                description:
                    "选择 IA、EE、TOK、IO、EPQ、个人陈述或其他大型学术项目模板。",
            },
            {
                number: "02",
                title: "设置截止日期",
                description:
                    "用日期选择器选择真实截止日期，Coursework Compass 会把它转换成结构化计划。",
            },
            {
                number: "03",
                title: "生成并编辑计划",
                description:
                    "创建任务、添加自定义工作、编辑任务详情、删除任务，并在仪表盘和今日任务中追踪进度。",
            },
        ],
        featureCards: [
            {
                title: "双语基础",
                description:
                    "在主要规划和测试界面中切换英文与简体中文。",
            },
            {
                title: "可编辑任务工作区",
                description:
                    "随着真实 coursework 变化，添加、编辑、删除、完成、恢复和归档任务。",
            },
            {
                title: "浏览器本地 beta 提醒",
                description:
                    "本地存储提示会让学生在依赖应用前看清测试数据边界。",
            },
        ],
    },
} as const;

const templateHighlights = [
    "Biology IA",
    "Chemistry IA",
    "Physics IA",
    "Mathematics IA",
    "Computer Science IA",
    "Extended Essay",
    "TOK Essay",
    "English Individual Oral",
    "Economics Commentary",
    "EPQ Project",
    "University Personal Statement",
];

export default function HomePage() {
    const language = useStoredLanguage();
    const currentCopy = copy[language];

    return (
        <main className="cc-page-gradient cc-ambient-drift cc-text-main">
            <section className="cc-page-shell">
                <AppNav />

                <section className="cc-motion-fade-up grid gap-10 py-10 md:grid-cols-[1.2fr_0.8fr] md:items-center md:py-16">
                    <div>
                        <div className="mb-5 inline-flex rounded-full border border-cyan-400/30 bg-cyan-400/10 px-4 py-2 text-xs font-black uppercase tracking-[0.2em] text-cyan-300">
                            {currentCopy.badge}
                        </div>

                        <h1 className="cc-page-title max-w-5xl">
                            {currentCopy.title}
                        </h1>

                        <p className="cc-text-muted mt-6 max-w-2xl text-base leading-8 sm:text-lg">
                            {currentCopy.subtitle}
                        </p>

                        <div className="mt-8 flex flex-col gap-4 sm:flex-row">
                            <Link
                                href="/projects/new"
                                className="cc-button-primary rounded-2xl px-6 py-4 text-center"
                            >
                                {currentCopy.startPlanning}
                            </Link>

                            <Link
                                href="/dashboard"
                                className="cc-button-secondary rounded-2xl px-6 py-4 text-center"
                            >
                                {currentCopy.openDashboard}
                            </Link>
                        </div>

                        <div className="mt-8">
                            <FeedbackLink />
                        </div>
                    </div>

                    <div className="cc-card cc-motion-scale-in rounded-[2rem] border-cyan-400/20 p-5 sm:p-6">
                        <div className="mb-5">
                            <p className="mb-2 text-sm font-bold text-cyan-300">
                                {currentCopy.missionEyebrow}
                            </p>
                            <h2 className="text-2xl font-black">
                                {currentCopy.missionTitle}
                            </h2>
                            <p className="cc-text-muted mt-2 text-sm leading-6">
                                {currentCopy.missionText}
                            </p>
                        </div>

                        <div className="space-y-4">
                            <div className="cc-surface-inset rounded-3xl p-4">
                                <div className="mb-3 flex items-center justify-between">
                                    <p className="cc-text-main font-bold">
                                        {currentCopy.sampleProject}
                                    </p>
                                    <span className="rounded-full bg-cyan-400/10 px-3 py-1 text-xs font-bold text-cyan-300">
                                        {currentCopy.active}
                                    </span>
                                </div>

                                <div className="cc-progress-track h-3 overflow-hidden rounded-full">
                                    <div className="cc-progress-fill h-full w-[72%] rounded-full bg-cyan-400" />
                                </div>

                                <p className="cc-text-subtle mt-2 text-xs">
                                    {currentCopy.completeText}
                                </p>
                            </div>

                            <div className="cc-surface-inset rounded-3xl p-4">
                                <p className="cc-text-muted mb-3 text-sm font-bold">
                                    {currentCopy.generatedPlan}
                                </p>

                                <div className="space-y-3">
                                    <div className="cc-surface-muted rounded-2xl px-4 py-3">
                                        <p className="cc-text-main font-bold">
                                            {currentCopy.taskOne}
                                        </p>
                                        <p className="cc-text-subtle mt-1 text-xs">
                                            {currentCopy.taskOneMeta}
                                        </p>
                                    </div>

                                    <div className="cc-surface-muted rounded-2xl px-4 py-3">
                                        <p className="cc-text-main font-bold">
                                            {currentCopy.taskTwo}
                                        </p>
                                        <p className="cc-text-subtle mt-1 text-xs">
                                            {currentCopy.taskTwoMeta}
                                        </p>
                                    </div>

                                    <div className="rounded-2xl bg-emerald-400/10 px-4 py-3">
                                        <p className="font-bold text-emerald-200 line-through">
                                            {currentCopy.taskThree}
                                        </p>
                                        <p className="mt-1 text-xs text-emerald-300">
                                            {currentCopy.done}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="cc-motion-fade-up rounded-[2rem] border border-emerald-400/30 bg-emerald-400/10 p-6 shadow-2xl shadow-emerald-950/20 sm:p-8">
                    <div className="grid gap-8 md:grid-cols-[1.2fr_0.8fr] md:items-center">
                        <div>
                            <p className="mb-2 text-sm font-bold text-emerald-300">
                                {currentCopy.testingEyebrow}
                            </p>
                            <h2 className="text-3xl font-black tracking-tight sm:text-4xl">
                                {currentCopy.testingTitle}
                            </h2>
                            <p className="cc-text-muted mt-3 max-w-2xl text-sm leading-6">
                                {currentCopy.testingText}
                            </p>
                        </div>

                        <div className="flex flex-col gap-4">
                            <Link href="/test" className="cc-button-success rounded-[1.75rem] px-8 py-5 text-center text-base">
                                {currentCopy.joinTest}
                            </Link>

                            <Link
                                href="/updates"
                                className="cc-button-secondary rounded-2xl px-6 py-4 text-center"
                            >
                                {currentCopy.releaseNotes}
                            </Link>
                        </div>
                    </div>
                </section>

                <div className="mt-10">
                    <BetaNotice />
                </div>

                <div className="mt-10">
                    <TesterQuickGuide />
                </div>

                <div className="mt-10">
                    <TestingGuideCard />
                </div>

                <div className="mt-10">
                    <FeedbackPanel />
                </div>

                <section className="mt-20">
                    <div className="mb-8">
                        <p className="mb-2 text-sm font-bold text-cyan-300">
                            {currentCopy.countdownEyebrow}
                        </p>
                        <h2 className="text-3xl font-black tracking-tight sm:text-4xl">
                            {currentCopy.countdownTitle}
                        </h2>
                        <p className="cc-text-muted mt-3 max-w-2xl text-sm leading-6">
                            {currentCopy.countdownText}
                        </p>
                    </div>

                    <ExamCountdownCard />
                </section>

                <section className="mt-20">
                    <div className="mb-8">
                        <p className="mb-2 text-sm font-bold text-cyan-300">
                            {currentCopy.howEyebrow}
                        </p>
                        <h2 className="text-3xl font-black tracking-tight sm:text-4xl">
                            {currentCopy.howTitle}
                        </h2>
                    </div>

                    <div className="grid gap-5 md:grid-cols-3">
                        {currentCopy.workflowSteps.map((step) => (
                            <div
                                key={step.number}
                                className="cc-card-hover cc-motion-fade-up rounded-[2rem] p-5 sm:p-6"
                            >
                                <p className="mb-4 text-sm font-black text-cyan-300">
                                    {step.number}
                                </p>
                                <h3 className="cc-text-main mb-3 text-xl font-black">
                                    {step.title}
                                </h3>
                                <p className="cc-text-subtle text-sm leading-6">
                                    {step.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </section>

                <section className="mt-20">
                    <div className="mb-8">
                        <p className="mb-2 text-sm font-bold text-cyan-300">
                            {currentCopy.featuresEyebrow}
                        </p>
                        <h2 className="text-3xl font-black tracking-tight sm:text-4xl">
                            {currentCopy.featuresTitle}
                        </h2>
                    </div>

                    <div className="grid gap-5 md:grid-cols-3">
                        {currentCopy.featureCards.map((feature) => (
                            <div
                                key={feature.title}
                                className="cc-interactive-card cc-motion-fade-up rounded-[2rem] border border-cyan-400/20 bg-cyan-400/10 p-5 sm:p-6"
                            >
                                <h3 className="cc-text-main mb-3 text-xl font-black">
                                    {feature.title}
                                </h3>
                                <p className="cc-text-muted text-sm leading-6">
                                    {feature.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </section>

                <section className="mt-20">
                    <div className="mb-8">
                        <p className="mb-2 text-sm font-bold text-cyan-300">
                            {currentCopy.templatesEyebrow}
                        </p>
                        <h2 className="text-3xl font-black tracking-tight sm:text-4xl">
                            {currentCopy.templatesTitle}
                        </h2>
                        <p className="cc-text-muted mt-3 max-w-2xl text-sm leading-6">
                            {currentCopy.templatesText}
                        </p>
                    </div>

                    <div className="flex flex-wrap gap-3">
                        {templateHighlights.map((template) => (
                            <span
                                key={template}
                                className="cc-pill-muted rounded-full px-4 py-2 text-sm font-bold"
                            >
                                {template}
                            </span>
                        ))}
                    </div>
                </section>

                <section className="cc-motion-fade-up mt-20 rounded-[2rem] border border-emerald-400/30 bg-emerald-400/10 p-6 sm:p-8">
                    <div className="grid gap-8 md:grid-cols-[1.2fr_0.8fr] md:items-center">
                        <div>
                            <p className="mb-2 text-sm font-bold text-emerald-300">
                                {currentCopy.readyEyebrow}
                            </p>
                            <h2 className="text-3xl font-black tracking-tight sm:text-4xl">
                                {currentCopy.readyTitle}
                            </h2>
                            <p className="cc-text-muted mt-3 max-w-2xl text-sm leading-6">
                                {currentCopy.readyText}
                            </p>
                        </div>

                        <div className="flex flex-col gap-4">
                            <Link href="/projects/new" className="cc-button-success rounded-2xl px-6 py-4 text-center">
                                {currentCopy.createProject}
                            </Link>

                            <Link
                                href="/test"
                                className="cc-button-secondary rounded-2xl px-6 py-4 text-center hover:border-emerald-400 hover:text-emerald-300"
                            >
                                {currentCopy.joinTest}
                            </Link>
                        </div>
                    </div>
                </section>
            </section>
        </main>
    );
}
