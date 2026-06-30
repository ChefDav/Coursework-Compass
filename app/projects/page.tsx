"use client";

import { useMemo } from "react";
import Link from "next/link";
import AppNav from "@/components/AppNav";
import EmptyState from "@/components/EmptyState";
import FeedbackPanel from "@/components/FeedbackPanel";
import {
    useHasMounted,
    useProjectPlans,
    useStoredLanguage,
} from "@/lib/clientStores";
import {
    deleteProjectPlan,
    getProjectRouteId,
    type CourseworkTask,
    type GeneratedProjectPlan,
} from "@/lib/localStorage";
import type { Language } from "@/lib/i18n";

const copy = {
    en: {
        eyebrow: "Projects",
        title: "Your saved coursework library.",
        subtitle:
            "Every saved plan lives here. Open a project, review its tasks, or delete local projects from this browser.",
        loading: "Loading projects...",
        createProject: "Create project",
        openTutorial: "Open tutorial",
        openProject: "Open project",
        deleteProject: "Delete project",
        progress: "Progress",
        tasks: "Tasks",
        activeTasks: "Active tasks",
        completedTasks: "Completed tasks",
        deadline: "Deadline",
        noDeadline: "No deadline",
        localStorage: "Local browser storage",
        confirmDelete:
            "Delete this project from this browser? This cannot be undone.",
        savedProjects: "Saved projects",
        savedProjectsDescription:
            "These projects are stored locally in this browser during the beta.",
        courseworkProject: "Coursework project",
        emptyEyebrow: "Projects library is empty",
        emptyTitle: "Your coursework library is waiting for its first project.",
        emptyDescription:
            "Once you create a project, it will appear here as part of your coursework library. You can return to it later, edit tasks, check progress, and keep the project moving.",
        tips: [
            "Use Projects as your long-term coursework shelf.",
            "Each saved plan can be opened again from this page.",
            "Start with one project first rather than creating too many at once.",
            "Templates are designed for IA, EE, TOK, essays, EPQ, and more.",
        ],
    },
    zh: {
        eyebrow: "项目",
        title: "你的 coursework 项目库。",
        subtitle:
            "所有已保存的计划都会放在这里。你可以打开项目、查看任务，或删除当前浏览器中的本地项目。",
        loading: "正在加载项目...",
        createProject: "创建项目",
        openTutorial: "打开引导测试",
        openProject: "打开项目",
        deleteProject: "删除项目",
        progress: "进度",
        tasks: "任务",
        activeTasks: "活跃任务",
        completedTasks: "已完成任务",
        deadline: "截止日期",
        noDeadline: "未设置截止日期",
        localStorage: "浏览器本地存储",
        confirmDelete:
            "要从当前浏览器中删除这个项目吗？这个操作不能撤销。",
        savedProjects: "已保存项目",
        savedProjectsDescription:
            "测试版期间，这些项目只会保存在当前浏览器中。",
        courseworkProject: "Coursework 项目",
        emptyEyebrow: "项目库还是空的",
        emptyTitle: "你的 coursework 项目库正在等待第一个项目。",
        emptyDescription:
            "创建项目后，它会作为 coursework 项目库的一部分显示在这里。你之后可以随时回来编辑任务、查看进度，并继续推进项目。",
        tips: [
            "你可以把 Projects 当作长期 coursework 项目书架。",
            "每个保存的计划之后都可以从这个页面重新打开。",
            "建议先从一个项目开始，不要一次创建太多。",
            "模板目前覆盖 IA、EE、TOK、论文、EPQ 等项目类型。",
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

function getProgress(plan: GeneratedProjectPlan) {
    const visibleTasks = getVisibleTasks(plan);

    if (visibleTasks.length === 0) {
        return 0;
    }

    return Math.round(
        (getCompletedTasks(plan).length / visibleTasks.length) * 100,
    );
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

function getProjectType(plan: GeneratedProjectPlan, language: Language) {
    return (
        plan.project.courseworkType ||
        plan.project.subject ||
        copy[language].courseworkProject
    );
}

export default function ProjectsPage() {
    const language = useStoredLanguage();
    const hasMounted = useHasMounted();
    const plans = useProjectPlans();

    const currentCopy = copy[language];

    const savedProjectCount = useMemo(() => plans.length, [plans]);

    function handleDeleteProject(plan: GeneratedProjectPlan) {
        const confirmed = window.confirm(currentCopy.confirmDelete);

        if (!confirmed) {
            return;
        }

        deleteProjectPlan(plan.id);
    }

    return (
        <main className="min-h-screen bg-slate-950 px-4 py-6 text-white sm:px-6 lg:px-8">
            <div className="mx-auto max-w-7xl">
                <AppNav />

                <header className="mb-8 rounded-[2rem] border border-slate-800 bg-slate-900/70 p-6 shadow-2xl shadow-cyan-950/20 sm:p-8">
                    <p className="mb-3 text-sm font-black uppercase tracking-[0.18em] text-cyan-300">
                        {currentCopy.eyebrow}
                    </p>

                    <h1 className="max-w-5xl text-4xl font-black tracking-tight text-white sm:text-6xl">
                        {currentCopy.title}
                    </h1>

                    <p className="mt-5 max-w-4xl text-base leading-7 text-slate-300 sm:text-lg">
                        {currentCopy.subtitle}
                    </p>

                    <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                        <Link
                            href="/projects/new"
                            className="rounded-2xl bg-cyan-400 px-5 py-3 text-center text-sm font-bold text-slate-950 transition hover:bg-cyan-300"
                        >
                            {currentCopy.createProject}
                        </Link>

                        <Link
                            href="/test"
                            className="rounded-2xl border border-slate-700 px-5 py-3 text-center text-sm font-bold text-white transition hover:border-cyan-400 hover:text-cyan-300"
                        >
                            {currentCopy.openTutorial}
                        </Link>
                    </div>
                </header>

                {!hasMounted ? (
                    <section className="rounded-[2rem] border border-slate-800 bg-slate-900 p-6">
                        <p className="text-sm font-bold text-slate-400">
                            {currentCopy.loading}
                        </p>
                    </section>
                ) : plans.length === 0 ? (
                    <EmptyState
                        eyebrow={currentCopy.emptyEyebrow}
                        title={currentCopy.emptyTitle}
                        description={currentCopy.emptyDescription}
                        icon="📚"
                        actions={[
                            {
                                label: currentCopy.createProject,
                                href: "/projects/new",
                            },
                            {
                                label: currentCopy.openTutorial,
                                href: "/test",
                                variant: "secondary",
                            },
                        ]}
                        tips={[...currentCopy.tips]}
                    />
                ) : (
                    <section className="rounded-[2rem] border border-slate-800 bg-slate-900 p-5 shadow-2xl shadow-cyan-950/20 sm:p-6">
                        <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                            <div>
                                <p className="mb-2 text-sm font-black uppercase tracking-[0.18em] text-cyan-300">
                                    {currentCopy.savedProjects}
                                </p>

                                <h2 className="text-2xl font-black text-white">
                                    {savedProjectCount} {currentCopy.savedProjects}
                                </h2>

                                <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-400">
                                    {currentCopy.savedProjectsDescription}
                                </p>
                            </div>

                            <span className="w-fit rounded-full border border-amber-400/30 bg-amber-400/10 px-4 py-2 text-xs font-black uppercase tracking-[0.16em] text-amber-300">
                {currentCopy.localStorage}
              </span>
                        </div>

                        <div className="grid gap-4 lg:grid-cols-2">
                            {plans.map((plan, index) => {
                                const routeId = getProjectRouteId(plan, index);
                                const progress = getProgress(plan);
                                const visibleTaskCount = getVisibleTasks(plan).length;
                                const activeTaskCount = getActiveTasks(plan).length;
                                const completedTaskCount = getCompletedTasks(plan).length;

                                return (
                                    <article
                                        key={`${routeId}-${index}`}
                                        className="rounded-[1.5rem] border border-slate-800 bg-slate-950/70 p-5 shadow-xl shadow-slate-950/30"
                                    >
                                        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                                            <div className="min-w-0">
                                                <h3 className="truncate text-xl font-black text-white">
                                                    {plan.project.title}
                                                </h3>

                                                <p className="mt-2 text-sm leading-6 text-slate-400">
                                                    {getProjectType(plan, language)}
                                                </p>
                                            </div>

                                            <button
                                                type="button"
                                                onClick={() => handleDeleteProject(plan)}
                                                className="w-fit rounded-2xl border border-red-400/30 bg-red-400/10 px-4 py-3 text-sm font-bold text-red-300 transition hover:bg-red-400/20"
                                            >
                                                {currentCopy.deleteProject}
                                            </button>
                                        </div>

                                        <div className="mt-5">
                                            <div className="mb-2 flex items-center justify-between gap-3">
                                                <p className="text-sm font-bold text-slate-400">
                                                    {currentCopy.progress}
                                                </p>

                                                <p className="text-sm font-black text-cyan-300">
                                                    {progress}%
                                                </p>
                                            </div>

                                            <div className="h-3 overflow-hidden rounded-full bg-slate-800">
                                                <div
                                                    className="h-full rounded-full bg-cyan-400"
                                                    style={{
                                                        width: `${progress}%`,
                                                    }}
                                                />
                                            </div>
                                        </div>

                                        <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                                            <div className="rounded-2xl border border-slate-800 bg-slate-900 p-4">
                                                <p className="text-xs font-bold text-slate-500">
                                                    {currentCopy.deadline}
                                                </p>
                                                <p className="mt-2 text-sm font-black text-white">
                                                    {formatDate(plan.project.deadline, language)}
                                                </p>
                                            </div>

                                            <div className="rounded-2xl border border-slate-800 bg-slate-900 p-4">
                                                <p className="text-xs font-bold text-slate-500">
                                                    {currentCopy.tasks}
                                                </p>
                                                <p className="mt-2 text-sm font-black text-white">
                                                    {visibleTaskCount}
                                                </p>
                                            </div>

                                            <div className="rounded-2xl border border-slate-800 bg-slate-900 p-4">
                                                <p className="text-xs font-bold text-slate-500">
                                                    {currentCopy.activeTasks}
                                                </p>
                                                <p className="mt-2 text-sm font-black text-white">
                                                    {activeTaskCount}
                                                </p>
                                            </div>

                                            <div className="rounded-2xl border border-slate-800 bg-slate-900 p-4">
                                                <p className="text-xs font-bold text-slate-500">
                                                    {currentCopy.completedTasks}
                                                </p>
                                                <p className="mt-2 text-sm font-black text-white">
                                                    {completedTaskCount}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="mt-5">
                                            <Link
                                                href={`/projects/${routeId}`}
                                                className="inline-block rounded-2xl bg-cyan-400 px-5 py-3 text-center text-sm font-bold text-slate-950 transition hover:bg-cyan-300"
                                            >
                                                {currentCopy.openProject}
                                            </Link>
                                        </div>
                                    </article>
                                );
                            })}
                        </div>
                    </section>
                )}

                <div className="mt-8">
                    <FeedbackPanel />
                </div>
            </div>
        </main>
    );
}
