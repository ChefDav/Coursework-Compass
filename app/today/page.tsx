"use client";

import { useEffect, useMemo, useState } from "react";
import AppNav from "@/components/AppNav";
import EmptyState from "@/components/EmptyState";
import { loadProjectPlans, updateTaskStatus } from "@/lib/localStorage";

type TaskStatus = "Todo" | "Done";

type CourseworkTask = {
    id: string;
    title: string;
    status: TaskStatus;
    priority?: string;
    dueDate?: string;
    estimatedTime?: string;
};

type GeneratedProjectPlan = {
    id?: string;
    slug?: string;
    projectId?: string;
    project: {
        id?: string;
        slug?: string;
        projectId?: string;
        title: string;
        deadline: string;
        status?: string;
        type?: string;
    };
    tasks: CourseworkTask[];
    archivedTasks?: CourseworkTask[];
    archivedTaskCount?: number;
};

type TodayTask = CourseworkTask & {
    projectId: string;
    projectTitle: string;
    projectDeadline: string;
};

function slugifyTitle(title: string) {
    return title
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");
}

function getProjectRouteId(plan: GeneratedProjectPlan, index: number) {
    return (
        plan.id ||
        plan.slug ||
        plan.projectId ||
        plan.project.id ||
        plan.project.slug ||
        plan.project.projectId ||
        slugifyTitle(plan.project.title) ||
        `project-${index}`
    );
}

function getPriorityClasses(priority?: string) {
    if (priority === "High") {
        return "border-red-400/30 bg-red-400/10 text-red-300";
    }

    if (priority === "Medium") {
        return "border-amber-400/30 bg-amber-400/10 text-amber-300";
    }

    if (priority === "Low") {
        return "border-emerald-400/30 bg-emerald-400/10 text-emerald-300";
    }

    return "border-slate-700 bg-slate-900 text-slate-300";
}

function sortTodayTasks(tasks: TodayTask[]) {
    return [...tasks].sort((a, b) => {
        const priorityOrder: Record<string, number> = {
            High: 0,
            Medium: 1,
            Low: 2,
        };

        const aPriority = priorityOrder[a.priority ?? "Medium"] ?? 1;
        const bPriority = priorityOrder[b.priority ?? "Medium"] ?? 1;

        if (aPriority !== bPriority) {
            return aPriority - bPriority;
        }

        const aDue = new Date(a.dueDate ?? a.projectDeadline).getTime();
        const bDue = new Date(b.dueDate ?? b.projectDeadline).getTime();

        if (Number.isNaN(aDue) || Number.isNaN(bDue)) {
            return a.title.localeCompare(b.title);
        }

        return aDue - bDue;
    });
}

export default function TodayPage() {
    const [projectPlans, setProjectPlans] = useState<GeneratedProjectPlan[]>([]);

    function refreshPlans() {
        setProjectPlans(loadProjectPlans() as GeneratedProjectPlan[]);
    }

    useEffect(() => {
        refreshPlans();
    }, []);

    const todayTasks = useMemo(() => {
        const activeTasks = projectPlans.flatMap((plan, index) => {
            const projectRouteId = getProjectRouteId(plan, index);

            return plan.tasks
                .filter((task) => task.status !== "Done")
                .map((task) => ({
                    ...task,
                    projectId: projectRouteId,
                    projectTitle: plan.project.title,
                    projectDeadline: plan.project.deadline,
                }));
        });

        return sortTodayTasks(activeTasks);
    }, [projectPlans]);

    function handleMarkDone(taskId: string) {
        updateTaskStatus(taskId, "Done");
        refreshPlans();
    }

    return (
        <main className="min-h-screen bg-slate-950 text-white">
            <section className="mx-auto max-w-6xl px-4 py-6 sm:px-6 sm:py-8">
                <AppNav />

                <div className="mb-10">
                    <p className="mb-2 text-sm font-bold text-cyan-300">Today</p>
                    <h1 className="text-4xl font-black tracking-tight sm:text-5xl">
                        Today&apos;s action list.
                    </h1>
                    <p className="mt-4 max-w-3xl text-sm leading-6 text-slate-300">
                        Focus on the next visible tasks from your active coursework
                        projects. Today is for action, not storage.
                    </p>
                </div>

                {projectPlans.length === 0 ? (
                    <EmptyState
                        eyebrow="No projects yet"
                        title="Today has nothing to show because no project exists yet."
                        description="Create your first coursework project and Today will start showing the next useful tasks to work on."
                        icon="🌱"
                        actions={[
                            {
                                label: "Create first project",
                                href: "/projects/new",
                            },
                            {
                                label: "Try guided tutorial",
                                href: "/test",
                                variant: "secondary",
                            },
                        ]}
                        tips={[
                            "Create one project first to activate your Today page.",
                            "The tutorial lets you practise without saving real data.",
                            "Today will become your daily action list once tasks exist.",
                            "Your saved data stays in this browser during the beta.",
                        ]}
                    />
                ) : todayTasks.length === 0 ? (
                    <EmptyState
                        eyebrow="Today is clear"
                        title="No active tasks are waiting right now."
                        description="You may have completed or archived your current work. Add a new custom task or open a project if you want to continue planning."
                        icon="✨"
                        actions={[
                            {
                                label: "View projects",
                                href: "/projects",
                            },
                            {
                                label: "Create new project",
                                href: "/projects/new",
                                variant: "secondary",
                            },
                        ]}
                        tips={[
                            "A clear Today page means there is no urgent visible task right now.",
                            "Open a project to add new work if your plan has changed.",
                            "Archived completed tasks stay hidden until new work is added.",
                            "You can still use Dashboard to check overall progress.",
                        ]}
                    />
                ) : (
                    <section className="grid gap-5">
                        {todayTasks.map((task) => (
                            <div
                                key={`${task.projectId}-${task.id}`}
                                className="rounded-[2rem] border border-slate-800 bg-slate-900 p-5 sm:p-6"
                            >
                                <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                                    <div>
                                        <p className="mb-2 text-sm font-bold text-cyan-300">
                                            {task.projectTitle}
                                        </p>
                                        <h2 className="text-2xl font-black text-white">
                                            {task.title}
                                        </h2>

                                        <div className="mt-3 flex flex-wrap gap-2 text-xs font-bold text-slate-400">
                      <span className="rounded-full border border-slate-700 bg-slate-950/70 px-3 py-1">
                        Due: {task.dueDate || task.projectDeadline}
                      </span>

                                            <span className="rounded-full border border-slate-700 bg-slate-950/70 px-3 py-1">
                        Time: {task.estimatedTime || "Not set"}
                      </span>

                                            <span
                                                className={`rounded-full border px-3 py-1 ${getPriorityClasses(
                                                    task.priority,
                                                )}`}
                                            >
                        {task.priority || "Medium"}
                      </span>
                                        </div>
                                    </div>

                                    <div className="flex flex-col gap-3 sm:flex-row md:flex-col">
                                        <button
                                            type="button"
                                            onClick={() => handleMarkDone(task.id)}
                                            className="rounded-2xl bg-cyan-400 px-5 py-3 text-sm font-bold text-slate-950 transition hover:bg-cyan-300"
                                        >
                                            Mark done
                                        </button>

                                        <a
                                            href={`/projects/${task.projectId}`}
                                            className="rounded-2xl border border-slate-700 px-5 py-3 text-center text-sm font-bold text-white transition hover:border-cyan-400 hover:text-cyan-300"
                                        >
                                            Open project
                                        </a>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </section>
                )}
            </section>
        </main>
    );
}