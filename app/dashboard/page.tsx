"use client";

import { useMemo } from "react";
import Link from "next/link";
import AppNav from "@/components/AppNav";
import BackgroundSwitcher from "@/components/BackgroundSwitcher";
import EmptyState from "@/components/EmptyState";
import FeedbackPanel from "@/components/FeedbackPanel";
import {
    useHasMounted,
    useProjectPlans,
    useStoredLanguage,
} from "@/lib/clientStores";
import {
    getProjectRouteId,
    type CourseworkTask,
    type GeneratedProjectPlan,
} from "@/lib/localStorage";
import type { Language } from "@/lib/i18n";

const copy = {
    en: {
        eyebrow: "Dashboard",
        title: "Your coursework command centre.",
        subtitle:
            "Track saved coursework projects, progress, active tasks, and deadline pressure from one clear workspace.",
        loading: "Loading dashboard...",
        savedProjects: "Saved projects",
        averageProgress: "Average progress",
        activeTasks: "Active tasks",
        urgentTasks: "Urgent tasks",
        projectOverview: "Project overview",
        projectOverviewDescription:
            "Open a saved project to edit tasks, check progress, and keep your coursework moving.",
        openProject: "Open project",
        viewToday: "View Today",
        progress: "Progress",
        deadline: "Deadline",
        tasks: "Tasks",
        active: "Active",
        complete: "Complete",
        noDeadline: "No deadline",
        courseworkProject: "Coursework project",
        dueToday: "Due today",
        overdue: "overdue",
        dayLeft: "day left",
        daysLeft: "days left",
        localBrowserStorage: "Local browser storage",
        personaliseWorkspace: "Personalise workspace",
        personaliseWorkspaceHelper:
            "Choose a saved background preset for this browser.",
        emptyEyebrow: "Dashboard is empty",
        emptyTitle: "No coursework projects yet.",
        emptyDescription:
            "Your dashboard will become useful once you create your first coursework project. Start with a template, choose a deadline, and Coursework Compass will turn the project into a task plan.",
        createFirstProject: "Create first project",
        tryGuidedTutorial: "Try guided tutorial",
        tips: [
            "Best starting point: create one sample project first.",
            "Your project data is stored locally in this browser during the beta.",
            "Dashboard will show progress, risk, and active projects after you save a plan.",
            "Student testers can use the tutorial before creating real project data.",
        ],
    },
    zh: {
        eyebrow: "仪表盘",
        title: "你的 coursework 指挥中心。",
        subtitle:
            "在一个清晰的工作区里查看已保存项目、进度、活跃任务和截止日期压力。",
        loading: "正在加载仪表盘...",
        savedProjects: "已保存项目",
        averageProgress: "平均进度",
        activeTasks: "活跃任务",
        urgentTasks: "紧急任务",
        projectOverview: "项目总览",
        projectOverviewDescription:
            "打开已保存项目，编辑任务、查看进度，并继续推进 coursework。",
        openProject: "打开项目",
        viewToday: "查看今日任务",
        progress: "进度",
        deadline: "截止日期",
        tasks: "任务",
        active: "活跃",
        complete: "完成",
        noDeadline: "未设置截止日期",
        courseworkProject: "Coursework 项目",
        dueToday: "今天截止",
        overdue: "已逾期",
        dayLeft: "天剩余",
        daysLeft: "天剩余",
        localBrowserStorage: "浏览器本地存储",
        personaliseWorkspace: "个性化学习空间",
        personaliseWorkspaceHelper:
            "为当前浏览器选择一个保存的背景预设。",
        emptyEyebrow: "仪表盘还是空的",
        emptyTitle: "还没有 coursework 项目。",
        emptyDescription:
            "创建第一个 coursework 项目后，你的仪表盘才会开始发挥作用。你可以先选择模板、设置截止日期，然后让 Coursework Compass 把项目拆成清晰的任务计划。",
        createFirstProject: "创建第一个项目",
        tryGuidedTutorial: "尝试引导测试",
        tips: [
            "建议先创建一个示例项目作为起点。",
            "测试版期间，你的项目数据只会保存在当前浏览器中。",
            "保存计划后，仪表盘会显示进度、风险和活跃项目。",
            "学生测试者可以先完成引导测试，再创建真实项目数据。",
        ],
    },
} as const;

function isDone(task: CourseworkTask) {
    return String(task.status).toLowerCase() === "done";
}

function isTaskArchived(task: CourseworkTask) {
    const archivedTask = task as CourseworkTask & {
        archived?: boolean;
        archivedAt?: string | null;
    };

    return Boolean(archivedTask.archived || archivedTask.archivedAt);
}

function getVisibleTasks(plan: GeneratedProjectPlan) {
    return plan.tasks.filter((task) => !isTaskArchived(task));
}

function getActiveTasks(plan: GeneratedProjectPlan) {
    return getVisibleTasks(plan).filter((task) => !isDone(task));
}

function getCompletedTasks(plan: GeneratedProjectPlan) {
    return getVisibleTasks(plan).filter((task) => isDone(task));
}

function getProjectProgress(plan: GeneratedProjectPlan) {
    const visibleTasks = getVisibleTasks(plan);

    if (visibleTasks.length === 0) {
        return 0;
    }

    return Math.round(
        (getCompletedTasks(plan).length / visibleTasks.length) * 100,
    );
}

function getDaysLeft(dateValue?: string) {
    if (!dateValue) {
        return null;
    }

    const target = new Date(dateValue);

    if (Number.isNaN(target.getTime())) {
        return null;
    }

    const now = new Date();

    const todayUtc = Date.UTC(now.getFullYear(), now.getMonth(), now.getDate());
    const targetUtc = Date.UTC(
        target.getFullYear(),
        target.getMonth(),
        target.getDate(),
    );

    return Math.ceil((targetUtc - todayUtc) / 86_400_000);
}

function formatDate(dateValue: string | undefined, language: Language) {
    if (!dateValue) {
        return copy[language].noDeadline;
    }

    const date = new Date(dateValue);

    if (Number.isNaN(date.getTime())) {
        return copy[language].noDeadline;
    }

    return new Intl.DateTimeFormat(language === "zh" ? "zh-CN" : "en-GB", {
        year: "numeric",
        month: "short",
        day: "numeric",
    }).format(date);
}

function getDeadlineText(daysLeft: number | null, language: Language) {
    const currentCopy = copy[language];

    if (daysLeft === null) {
        return currentCopy.noDeadline;
    }

    if (daysLeft < 0) {
        const overdueDays = Math.abs(daysLeft);

        return language === "zh"
            ? `${currentCopy.overdue} ${overdueDays} 天`
            : `${overdueDays} ${currentCopy.overdue}`;
    }

    if (daysLeft === 0) {
        return currentCopy.dueToday;
    }

    return language === "zh"
        ? `${daysLeft} ${currentCopy.daysLeft}`
        : `${daysLeft} ${
            daysLeft === 1 ? currentCopy.dayLeft : currentCopy.daysLeft
        }`;
}

function getDeadlineTone(daysLeft: number | null) {
    if (daysLeft === null) {
        return "cc-badge";
    }

    if (daysLeft < 0) {
        return "border-red-400/30 bg-red-400/10 text-red-300";
    }

    if (daysLeft <= 3) {
        return "border-amber-400/30 bg-amber-400/10 text-amber-300";
    }

    return "border-emerald-400/30 bg-emerald-400/10 text-emerald-300";
}

function getProjectType(plan: GeneratedProjectPlan, language: Language) {
    return (
        plan.project.courseworkType ||
        plan.project.subject ||
        copy[language].courseworkProject
    );
}

export default function DashboardPage() {
    const language = useStoredLanguage();
    const hasMounted = useHasMounted();
    const plans = useProjectPlans();

    const currentCopy = copy[language];

    const stats = useMemo(() => {
        const projectCount = plans.length;

        const progressValues = plans.map((plan) => getProjectProgress(plan));

        const averageProgress =
            progressValues.length === 0
                ? 0
                : Math.round(
                    progressValues.reduce((total, value) => total + value, 0) /
                    progressValues.length,
                );

        const activeTaskCount = plans.reduce(
            (total, plan) => total + getActiveTasks(plan).length,
            0,
        );

        const urgentTaskCount = plans.reduce((total, plan) => {
            const urgentTasks = getActiveTasks(plan).filter((task) => {
                const daysLeft = getDaysLeft(task.dueDate);

                return daysLeft !== null && daysLeft <= 3;
            });

            return total + urgentTasks.length;
        }, 0);

        return {
            projectCount,
            averageProgress,
            activeTaskCount,
            urgentTaskCount,
        };
    }, [plans]);

    return (
        <main className="cc-page-gradient cc-ambient-drift cc-text-main px-4 py-6 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-7xl">
                <AppNav />

                <header className="cc-card cc-motion-fade-up mb-8 rounded-[2rem] p-6 sm:p-8">
                    <p className="mb-3 text-sm font-black uppercase tracking-[0.18em] text-cyan-300">
                        {currentCopy.eyebrow}
                    </p>

                    <h1 className="cc-text-main max-w-5xl text-4xl font-black tracking-tight sm:text-6xl">
                        {currentCopy.title}
                    </h1>

                    <p className="cc-text-muted mt-5 max-w-4xl text-base leading-7 sm:text-lg">
                        {currentCopy.subtitle}
                    </p>
                </header>

                <section className="cc-card cc-motion-fade-up mb-8 rounded-[2rem] p-5 sm:p-6">
                    <div className="mb-5">
                        <p className="mb-2 text-sm font-black uppercase tracking-[0.18em] text-cyan-300">
                            {currentCopy.personaliseWorkspace}
                        </p>

                        <p className="cc-text-subtle max-w-3xl text-sm leading-6">
                            {currentCopy.personaliseWorkspaceHelper}
                        </p>
                    </div>

                    <BackgroundSwitcher />
                </section>

                {!hasMounted ? (
                    <section className="cc-card cc-motion-fade-up rounded-[2rem] p-6">
                        <p className="cc-text-subtle text-sm font-bold">
                            {currentCopy.loading}
                        </p>
                    </section>
                ) : plans.length === 0 ? (
                    <EmptyState
                        eyebrow={currentCopy.emptyEyebrow}
                        title={currentCopy.emptyTitle}
                        description={currentCopy.emptyDescription}
                        icon="🧭"
                        actions={[
                            {
                                label: currentCopy.createFirstProject,
                                href: "/projects/new",
                            },
                            {
                                label: currentCopy.tryGuidedTutorial,
                                href: "/test",
                                variant: "secondary",
                            },
                        ]}
                        tips={[...currentCopy.tips]}
                    />
                ) : (
                    <div className="space-y-6">
                        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                            <article className="cc-card cc-interactive-card cc-motion-fade-up rounded-[1.5rem] p-5">
                                <p className="cc-text-subtle text-sm font-bold">
                                    {currentCopy.savedProjects}
                                </p>
                                <p className="cc-text-main mt-3 text-4xl font-black">
                                    {stats.projectCount}
                                </p>
                            </article>

                            <article className="cc-card cc-interactive-card cc-motion-fade-up rounded-[1.5rem] p-5">
                                <p className="cc-text-subtle text-sm font-bold">
                                    {currentCopy.averageProgress}
                                </p>
                                <p className="mt-3 text-4xl font-black text-cyan-300">
                                    {stats.averageProgress}%
                                </p>
                            </article>

                            <article className="cc-card cc-interactive-card cc-motion-fade-up rounded-[1.5rem] p-5">
                                <p className="cc-text-subtle text-sm font-bold">
                                    {currentCopy.activeTasks}
                                </p>
                                <p className="mt-3 text-4xl font-black text-emerald-300">
                                    {stats.activeTaskCount}
                                </p>
                            </article>

                            <article className="cc-card cc-interactive-card cc-motion-fade-up rounded-[1.5rem] p-5">
                                <p className="cc-text-subtle text-sm font-bold">
                                    {currentCopy.urgentTasks}
                                </p>
                                <p className="mt-3 text-4xl font-black text-amber-300">
                                    {stats.urgentTaskCount}
                                </p>
                            </article>
                        </section>

                        <section className="cc-card cc-motion-fade-up rounded-[2rem] p-5 sm:p-6">
                            <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                                <div>
                                    <p className="mb-2 text-sm font-black uppercase tracking-[0.18em] text-cyan-300">
                                        {currentCopy.projectOverview}
                                    </p>

                                    <h2 className="cc-text-main text-2xl font-black">
                                        {currentCopy.projectOverview}
                                    </h2>

                                    <p className="cc-text-subtle mt-2 max-w-3xl text-sm leading-6">
                                        {currentCopy.projectOverviewDescription}
                                    </p>
                                </div>

                                <span className="w-fit rounded-full border border-amber-400/30 bg-amber-400/10 px-4 py-2 text-xs font-black uppercase tracking-[0.16em] text-amber-300">
                  {currentCopy.localBrowserStorage}
                </span>
                            </div>

                            <div className="grid gap-4 lg:grid-cols-2">
                                {plans.map((plan, index) => {
                                    const routeId = getProjectRouteId(plan, index);
                                    const visibleTasks = getVisibleTasks(plan);
                                    const activeTasks = getActiveTasks(plan);
                                    const completedTasks = getCompletedTasks(plan);
                                    const progress = getProjectProgress(plan);
                                    const daysLeft = getDaysLeft(plan.project.deadline);

                                    return (
                                        <article
                                            key={`${routeId}-${index}`}
                                            className="cc-surface-inset cc-interactive-card cc-motion-fade-up rounded-[1.5rem] p-5"
                                        >
                                            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                                                <div className="min-w-0">
                                                    <h3 className="cc-text-main truncate text-xl font-black">
                                                        {plan.project.title}
                                                    </h3>

                                                    <p className="cc-text-subtle mt-2 text-sm leading-6">
                                                        {getProjectType(plan, language)}
                                                    </p>
                                                </div>

                                                <span
                                                    className={`w-fit rounded-full border px-3 py-1 text-xs font-black ${getDeadlineTone(
                                                        daysLeft,
                                                    )}`}
                                                >
                          {getDeadlineText(daysLeft, language)}
                        </span>
                                            </div>

                                            <div className="mt-5">
                                                <div className="mb-2 flex items-center justify-between gap-3">
                                                    <p className="cc-text-subtle text-sm font-bold">
                                                        {currentCopy.progress}
                                                    </p>

                                                    <p className="text-sm font-black text-cyan-300">
                                                        {progress}%
                                                    </p>
                                                </div>

                                                <div className="cc-progress-track h-3 overflow-hidden rounded-full">
                                                    <div
                                                        className="cc-progress-fill h-full rounded-full bg-cyan-400"
                                                        style={{
                                                            width: `${progress}%`,
                                                        }}
                                                    />
                                                </div>
                                            </div>

                                            <div className="mt-5 grid gap-3 sm:grid-cols-3">
                                                <div className="cc-surface-muted rounded-2xl p-4">
                                                    <p className="cc-text-subtle text-xs font-bold">
                                                        {currentCopy.deadline}
                                                    </p>
                                                    <p className="cc-text-main mt-2 text-sm font-black">
                                                        {formatDate(plan.project.deadline, language)}
                                                    </p>
                                                </div>

                                                <div className="cc-surface-muted rounded-2xl p-4">
                                                    <p className="cc-text-subtle text-xs font-bold">
                                                        {currentCopy.tasks}
                                                    </p>
                                                    <p className="cc-text-main mt-2 text-sm font-black">
                                                        {visibleTasks.length}
                                                    </p>
                                                </div>

                                                <div className="cc-surface-muted rounded-2xl p-4">
                                                    <p className="cc-text-subtle text-xs font-bold">
                                                        {currentCopy.complete}
                                                    </p>
                                                    <p className="cc-text-main mt-2 text-sm font-black">
                                                        {completedTasks.length}
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="mt-5 grid gap-3 sm:grid-cols-2">
                                                <div className="cc-surface-muted rounded-2xl p-4">
                                                    <p className="cc-text-subtle text-xs font-bold">
                                                        {currentCopy.active}
                                                    </p>
                                                    <p className="cc-text-main mt-2 text-sm font-black">
                                                        {activeTasks.length}
                                                    </p>
                                                </div>

                                                <Link
                                                    href={`/projects/${routeId}`}
                                                    className="cc-button-primary rounded-2xl px-5 py-4 text-center text-sm"
                                                >
                                                    {currentCopy.openProject}
                                                </Link>
                                            </div>
                                        </article>
                                    );
                                })}
                            </div>

                            <div className="mt-6">
                                <Link
                                    href="/today"
                                    className="cc-button-secondary inline-flex rounded-2xl px-5 py-3 text-sm"
                                >
                                    {currentCopy.viewToday}
                                </Link>
                            </div>
                        </section>
                    </div>
                )}

                <div className="mt-8">
                    <FeedbackPanel />
                </div>
            </div>
        </main>
    );
}
