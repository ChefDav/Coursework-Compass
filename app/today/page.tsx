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
    getProjectRouteId,
    updateTaskStatus,
    type CourseworkTask,
    type GeneratedProjectPlan,
    type TaskStatus,
} from "@/lib/localStorage";
import type { Language } from "@/lib/i18n";

type TodayTask = {
    plan: GeneratedProjectPlan;
    task: CourseworkTask;
    taskIndex: number;
    routeId: string;
    daysLeft: number | null;
};

const copy = {
    en: {
        eyebrow: "Today",
        title: "Your daily coursework action list.",
        subtitle:
            "See active tasks from your saved projects and choose what to work on next.",
        loading: "Loading today...",
        markDone: "Mark done",
        openProject: "Open project",
        createProject: "Create first project",
        tryTutorial: "Try guided tutorial",
        dueDate: "Due date",
        estimatedTime: "Estimated time",
        priority: "Priority",
        project: "Project",
        noDate: "No date",
        noEstimate: "Not set",
        dueToday: "Due today",
        overdue: "overdue",
        dayLeft: "day left",
        daysLeft: "days left",
        activeTasks: "Active tasks",
        activeTasksDescription:
            "These tasks are pulled from saved projects in this browser.",
        noProjectsEyebrow: "No projects yet",
        noProjectsTitle: "Today has nothing to show because no project exists yet.",
        noProjectsDescription:
            "Create your first coursework project and Today will start showing the next useful tasks to work on.",
        noTasksEyebrow: "Today is clear",
        noTasksTitle: "Your Today page is clear.",
        noTasksDescription:
            "You do not have any active tasks due today. Create a project or check your project pages to plan future work.",
        low: "Low",
        medium: "Medium",
        high: "High",
        tipsNoProjects: [
            "Create one project first to activate your Today page.",
            "The tutorial lets you practise without saving real data.",
            "Today will become your daily action list once tasks exist.",
            "Your saved data stays in this browser during the beta.",
        ],
        tipsNoTasks: [
            "Tasks you mark as done will update project progress automatically.",
            "If a project has no tasks, open its project detail page and add custom tasks.",
            "Deadline labels help you spot urgent or overdue work.",
            "Create more projects to compare progress across coursework.",
        ],
    },
    zh: {
        eyebrow: "今日任务",
        title: "你的每日 coursework 行动清单。",
        subtitle:
            "查看已保存项目中的活跃任务，并决定接下来最应该处理什么。",
        loading: "正在加载今日任务...",
        markDone: "标记完成",
        openProject: "打开项目",
        createProject: "创建第一个项目",
        tryTutorial: "尝试引导测试",
        dueDate: "任务日期",
        estimatedTime: "预计用时",
        priority: "优先级",
        project: "项目",
        noDate: "未设置日期",
        noEstimate: "未设置",
        dueToday: "今天截止",
        overdue: "已逾期",
        dayLeft: "天剩余",
        daysLeft: "天剩余",
        activeTasks: "活跃任务",
        activeTasksDescription:
            "这些任务来自当前浏览器中已保存的项目。",
        noProjectsEyebrow: "还没有项目",
        noProjectsTitle: "Today 还没有内容，因为目前还没有项目。",
        noProjectsDescription:
            "创建第一个 coursework 项目后，Today 会开始显示接下来最值得处理的任务。",
        noTasksEyebrow: "今天很干净",
        noTasksTitle: "你的 Today 页面是空的。",
        noTasksDescription:
            "你今天没有需要处理的活跃任务。你可以创建项目，或打开项目页面规划后续工作。",
        low: "低",
        medium: "中",
        high: "高",
        tipsNoProjects: [
            "先创建一个项目，Today 页面才会开始显示内容。",
            "引导测试可以让你先练习流程，不会保存真实项目数据。",
            "有任务后，Today 会变成你的每日行动清单。",
            "测试版期间，你保存的数据只会留在当前浏览器中。",
        ],
        tipsNoTasks: [
            "你标记为完成的任务会自动更新项目进度。",
            "如果项目没有任务，可以打开项目详情页添加自定义任务。",
            "截止日期标签可以帮助你发现紧急或逾期任务。",
            "创建更多项目后，你可以对比不同 coursework 的进度。",
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
        return copy[language].noDate;
    }

    const date = new Date(dateValue);

    if (Number.isNaN(date.getTime())) {
        return copy[language].noDate;
    }

    return new Intl.DateTimeFormat(language === "zh" ? "zh-CN" : "en-GB", {
        year: "numeric",
        month: "short",
        day: "numeric",
    }).format(date);
}

function getDueText(daysLeft: number | null, language: Language) {
    const currentCopy = copy[language];

    if (daysLeft === null) {
        return currentCopy.noDate;
    }

    if (daysLeft < 0) {
        const days = Math.abs(daysLeft);

        return language === "zh"
            ? `${currentCopy.overdue} ${days} 天`
            : `${days} ${currentCopy.overdue}`;
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

function getDueTone(daysLeft: number | null) {
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

function getPriorityTone(priority?: string) {
    if (priority === "High") {
        return "border-red-400/30 bg-red-400/10 text-red-300";
    }

    if (priority === "Medium") {
        return "border-amber-400/30 bg-amber-400/10 text-amber-300";
    }

    return "border-emerald-400/30 bg-emerald-400/10 text-emerald-300";
}

function getPriorityLabel(priority: string | undefined, language: Language) {
    if (language === "en") {
        return priority || "Low";
    }

    if (priority === "High") {
        return copy.zh.high;
    }

    if (priority === "Medium") {
        return copy.zh.medium;
    }

    return copy.zh.low;
}

function getEstimatedTime(task: CourseworkTask, language: Language) {
    const estimatedTask = task as CourseworkTask & {
        estimatedTime?: string | null;
        time?: string | null;
        duration?: string | null;
        estimate?: string | null;
    };

    return (
        estimatedTask.estimatedTime ||
        estimatedTask.time ||
        estimatedTask.duration ||
        estimatedTask.estimate ||
        copy[language].noEstimate
    );
}

export default function TodayPage() {
    const language = useStoredLanguage();
    const hasMounted = useHasMounted();
    const plans = useProjectPlans();

    const currentCopy = copy[language];

    const todayTasks = useMemo<TodayTask[]>(() => {
        return plans
            .flatMap((plan, planIndex) => {
                const routeId = getProjectRouteId(plan, planIndex);

                return plan.tasks.map((task, taskIndex) => ({
                    plan,
                    task,
                    taskIndex,
                    routeId,
                    daysLeft: getDaysLeft(task.dueDate),
                }));
            })
            .filter((item) => !isTaskArchived(item.task) && !isDone(item.task))
            .sort((first, second) => {
                const firstDays = first.daysLeft ?? 9999;
                const secondDays = second.daysLeft ?? 9999;

                if (firstDays !== secondDays) {
                    return firstDays - secondDays;
                }

                return first.task.title.localeCompare(second.task.title);
            });
    }, [plans]);

    function handleMarkDone(item: TodayTask) {
        updateTaskStatus(item.plan.id, item.task.id, "Done" as TaskStatus);
    }

    return (
        <main className="cc-page-gradient cc-text-main px-4 py-6 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-7xl">
                <AppNav />

                <header className="cc-card mb-8 rounded-[2rem] p-6 sm:p-8">
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

                {!hasMounted ? (
                    <section className="cc-card rounded-[2rem] p-6">
                        <p className="cc-text-subtle text-sm font-bold">
                            {currentCopy.loading}
                        </p>
                    </section>
                ) : plans.length === 0 ? (
                    <EmptyState
                        eyebrow={currentCopy.noProjectsEyebrow}
                        title={currentCopy.noProjectsTitle}
                        description={currentCopy.noProjectsDescription}
                        icon="🌱"
                        actions={[
                            {
                                label: currentCopy.createProject,
                                href: "/projects/new",
                            },
                            {
                                label: currentCopy.tryTutorial,
                                href: "/test",
                                variant: "secondary",
                            },
                        ]}
                        tips={[...currentCopy.tipsNoProjects]}
                    />
                ) : todayTasks.length === 0 ? (
                    <EmptyState
                        eyebrow={currentCopy.noTasksEyebrow}
                        title={currentCopy.noTasksTitle}
                        description={currentCopy.noTasksDescription}
                        icon="✅"
                        actions={[
                            {
                                label: currentCopy.createProject,
                                href: "/projects/new",
                            },
                            {
                                label: currentCopy.openProject,
                                href: "/projects",
                                variant: "secondary",
                            },
                        ]}
                        tips={[...currentCopy.tipsNoTasks]}
                    />
                ) : (
                    <section className="cc-card rounded-[2rem] p-5 sm:p-6">
                        <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                            <div>
                                <p className="mb-2 text-sm font-black uppercase tracking-[0.18em] text-cyan-300">
                                    {currentCopy.activeTasks}
                                </p>

                                <h2 className="cc-text-main text-2xl font-black">
                                    {todayTasks.length} {currentCopy.activeTasks}
                                </h2>

                                <p className="cc-text-subtle mt-2 max-w-3xl text-sm leading-6">
                                    {currentCopy.activeTasksDescription}
                                </p>
                            </div>

                            <span className="w-fit rounded-full border border-emerald-400/30 bg-emerald-400/10 px-4 py-2 text-xs font-black uppercase tracking-[0.16em] text-emerald-300">
                {currentCopy.project}
              </span>
                        </div>

                        <div className="grid gap-4 lg:grid-cols-2">
                            {todayTasks.map((item) => (
                                <article
                                    key={`${item.routeId}-${item.task.id}-${item.taskIndex}`}
                                    className="cc-surface-inset rounded-[1.5rem] p-5"
                                >
                                    <div className="mb-4 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                                        <div className="min-w-0">
                                            <p className="cc-text-subtle mb-2 text-xs font-black uppercase tracking-[0.16em]">
                                                {currentCopy.project}
                                            </p>

                                            <h3 className="cc-text-main text-xl font-black">
                                                {item.task.title}
                                            </h3>

                                            <p className="cc-text-subtle mt-2 text-sm leading-6">
                                                {item.plan.project.title}
                                            </p>
                                        </div>

                                        <span
                                            className={`w-fit rounded-full border px-3 py-1 text-xs font-black ${getDueTone(
                                                item.daysLeft,
                                            )}`}
                                        >
                      {getDueText(item.daysLeft, language)}
                    </span>
                                    </div>

                                    {item.task.description ? (
                                        <p className="cc-text-muted mb-4 text-sm leading-6">
                                            {item.task.description}
                                        </p>
                                    ) : null}

                                    <div className="grid gap-3 sm:grid-cols-3">
                                        <div className="cc-surface-muted rounded-2xl p-4">
                                            <p className="cc-text-subtle text-xs font-bold">
                                                {currentCopy.dueDate}
                                            </p>
                                            <p className="cc-text-main mt-2 text-sm font-black">
                                                {formatDate(item.task.dueDate, language)}
                                            </p>
                                        </div>

                                        <div className="cc-surface-muted rounded-2xl p-4">
                                            <p className="cc-text-subtle text-xs font-bold">
                                                {currentCopy.estimatedTime}
                                            </p>
                                            <p className="cc-text-main mt-2 text-sm font-black">
                                                {getEstimatedTime(item.task, language)}
                                            </p>
                                        </div>

                                        <div className="cc-surface-muted rounded-2xl p-4">
                                            <p className="cc-text-subtle text-xs font-bold">
                                                {currentCopy.priority}
                                            </p>

                                            <p
                                                className={`mt-2 w-fit rounded-full border px-3 py-1 text-xs font-black ${getPriorityTone(
                                                    item.task.priority,
                                                )}`}
                                            >
                                                {getPriorityLabel(item.task.priority, language)}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="mt-5 flex flex-col gap-3 sm:flex-row">
                                        <button
                                            type="button"
                                            onClick={() => handleMarkDone(item)}
                                            className="rounded-2xl bg-emerald-400 px-5 py-3 text-center text-sm font-bold text-slate-950 transition hover:bg-emerald-300"
                                        >
                                            {currentCopy.markDone}
                                        </button>

                                        <Link
                                            href={`/projects/${item.routeId}`}
                                            className="cc-button-secondary rounded-2xl px-5 py-3 text-center text-sm"
                                        >
                                            {currentCopy.openProject}
                                        </Link>
                                    </div>
                                </article>
                            ))}
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
