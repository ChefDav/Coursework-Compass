"use client";

import { useEffect, useMemo, useState } from "react";
import AppNav from "@/components/AppNav";
import EmptyState from "@/components/EmptyState";
import { loadProjectPlans } from "@/lib/localStorage";

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

function calculateProgress(tasks: CourseworkTask[]) {
    if (tasks.length === 0) {
        return 0;
    }

    const doneCount = tasks.filter((task) => task.status === "Done").length;
    return Math.round((doneCount / tasks.length) * 100);
}

function getRiskLabel(deadline: string) {
    const deadlineDate = new Date(deadline);
    const today = new Date();

    if (Number.isNaN(deadlineDate.getTime())) {
        return "Unknown";
    }

    const diffMs = deadlineDate.getTime() - today.getTime();
    const daysLeft = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

    if (daysLeft < 0) {
        return "Overdue";
    }

    if (daysLeft <= 7) {
        return "High";
    }

    if (daysLeft <= 21) {
        return "Medium";
    }

    return "Low";
}

function getRiskClasses(risk: string) {
    if (risk === "Overdue" || risk === "High") {
        return "border-red-400/30 bg-red-400/10 text-red-300";
    }

    if (risk === "Medium") {
        return "border-amber-400/30 bg-amber-400/10 text-amber-300";
    }

    if (risk === "Low") {
        return "border-emerald-400/30 bg-emerald-400/10 text-emerald-300";
    }

    return "border-slate-700 bg-slate-900 text-slate-300";
}

function formatDeadline(deadline: string) {
    if (!deadline) {
        return "No deadline";
    }

    return deadline;
}

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

export default function DashboardPage() {
    const [projectPlans, setProjectPlans] = useState<GeneratedProjectPlan[]>([]);

    useEffect(() => {
        setProjectPlans(loadProjectPlans() as GeneratedProjectPlan[]);
    }, []);

    const dashboardStats = useMemo(() => {
        const totalProjects = projectPlans.length;
        const totalTasks = projectPlans.reduce(
            (total, plan) => total + plan.tasks.length,
            0,
        );
        const doneTasks = projectPlans.reduce(
            (total, plan) =>
                total + plan.tasks.filter((task) => task.status === "Done").length,
            0,
        );

        const averageProgress =
            totalProjects === 0
                ? 0
                : Math.round(
                    projectPlans.reduce(
                        (total, plan) => total + calculateProgress(plan.tasks),
                        0,
                    ) / totalProjects,
                );

        return {
            totalProjects,
            totalTasks,
            doneTasks,
            averageProgress,
        };
    }, [projectPlans]);

    return (
        <main className="min-h-screen bg-slate-950 text-white">
            <section className="mx-auto max-w-6xl px-4 py-6 sm:px-6 sm:py-8">
                <AppNav />

                <div className="mb-10">
                    <p className="mb-2 text-sm font-bold text-cyan-300">Dashboard</p>
                    <h1 className="text-4xl font-black tracking-tight sm:text-5xl">
                        Your coursework command centre.
                    </h1>
                    <p className="mt-4 max-w-3xl text-sm leading-6 text-slate-300">
                        Track all saved coursework projects, progress, active tasks, and
                        deadline pressure from one place.
                    </p>
                </div>

                {projectPlans.length === 0 ? (
                    <EmptyState
                        eyebrow="Dashboard is empty"
                        title="No coursework projects yet."
                        description="Your dashboard will become useful once you create your first coursework project. Start with a template, choose a deadline, and Coursework Compass will turn the project into a task plan."
                        icon="🧭"
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
                            "Best starting point: create one sample project first.",
                            "Your project data is stored locally in this browser during the beta.",
                            "Dashboard will show progress, risk, and active projects after you save a plan.",
                            "Student testers can use the tutorial before creating real project data.",
                        ]}
                    />
                ) : (
                    <>
                        <section className="grid gap-4 md:grid-cols-4">
                            <div className="rounded-[2rem] border border-cyan-400/30 bg-cyan-400/10 p-5">
                                <p className="text-sm font-bold text-cyan-300">Projects</p>
                                <p className="mt-3 text-4xl font-black">
                                    {dashboardStats.totalProjects}
                                </p>
                            </div>

                            <div className="rounded-[2rem] border border-emerald-400/30 bg-emerald-400/10 p-5">
                                <p className="text-sm font-bold text-emerald-300">
                                    Tasks done
                                </p>
                                <p className="mt-3 text-4xl font-black">
                                    {dashboardStats.doneTasks}
                                </p>
                            </div>

                            <div className="rounded-[2rem] border border-slate-800 bg-slate-900 p-5">
                                <p className="text-sm font-bold text-slate-300">
                                    Total tasks
                                </p>
                                <p className="mt-3 text-4xl font-black">
                                    {dashboardStats.totalTasks}
                                </p>
                            </div>

                            <div className="rounded-[2rem] border border-fuchsia-400/30 bg-fuchsia-400/10 p-5">
                                <p className="text-sm font-bold text-fuchsia-300">
                                    Avg progress
                                </p>
                                <p className="mt-3 text-4xl font-black">
                                    {dashboardStats.averageProgress}%
                                </p>
                            </div>
                        </section>

                        <section className="mt-10">
                            <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                                <div>
                                    <p className="mb-2 text-sm font-bold text-cyan-300">
                                        Active overview
                                    </p>
                                    <h2 className="text-3xl font-black tracking-tight">
                                        Current projects.
                                    </h2>
                                </div>

                                <a
                                    href="/projects/new"
                                    className="w-fit rounded-2xl bg-cyan-400 px-5 py-3 text-sm font-bold text-slate-950 transition hover:bg-cyan-300"
                                >
                                    New project
                                </a>
                            </div>

                            <div className="grid gap-5 md:grid-cols-2">
                                {projectPlans.map((plan, index) => {
                                    const projectRouteId = getProjectRouteId(plan, index);
                                    const progress = calculateProgress(plan.tasks);
                                    const risk = getRiskLabel(plan.project.deadline);
                                    const todoCount = plan.tasks.filter(
                                        (task) => task.status !== "Done",
                                    ).length;
                                    const doneCount = plan.tasks.filter(
                                        (task) => task.status === "Done",
                                    ).length;

                                    return (
                                        <a
                                            key={projectRouteId}
                                            href={`/projects/${projectRouteId}`}
                                            className="rounded-[2rem] border border-slate-800 bg-slate-900 p-5 transition hover:border-cyan-400/60 hover:bg-slate-900/80 sm:p-6"
                                        >
                                            <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                                                <div>
                                                    <h3 className="text-2xl font-black text-white">
                                                        {plan.project.title}
                                                    </h3>
                                                    <p className="mt-2 text-sm text-slate-400">
                                                        Deadline: {formatDeadline(plan.project.deadline)}
                                                    </p>
                                                </div>

                                                <span
                                                    className={`w-fit rounded-full border px-3 py-1 text-xs font-black uppercase tracking-[0.16em] ${getRiskClasses(
                                                        risk,
                                                    )}`}
                                                >
                          {risk}
                        </span>
                                            </div>

                                            <div className="h-3 overflow-hidden rounded-full bg-slate-800">
                                                <div
                                                    className="h-full rounded-full bg-cyan-400 transition-all"
                                                    style={{ width: `${progress}%` }}
                                                />
                                            </div>

                                            <div className="mt-4 grid gap-3 text-sm text-slate-400 sm:grid-cols-3">
                                                <p>
                          <span className="font-bold text-slate-200">
                            {progress}%
                          </span>{" "}
                                                    complete
                                                </p>
                                                <p>
                          <span className="font-bold text-slate-200">
                            {todoCount}
                          </span>{" "}
                                                    todo
                                                </p>
                                                <p>
                          <span className="font-bold text-slate-200">
                            {doneCount}
                          </span>{" "}
                                                    done
                                                </p>
                                            </div>

                                            {plan.archivedTaskCount ? (
                                                <p className="mt-3 text-xs font-bold text-emerald-300">
                                                    {plan.archivedTaskCount} archived task
                                                    {plan.archivedTaskCount === 1 ? "" : "s"}
                                                </p>
                                            ) : null}
                                        </a>
                                    );
                                })}
                            </div>
                        </section>
                    </>
                )}
            </section>
        </main>
    );
}