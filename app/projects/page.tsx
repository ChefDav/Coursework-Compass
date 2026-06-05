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

function getProjectStatus(progress: number) {
    if (progress >= 100) {
        return "Complete";
    }

    if (progress >= 60) {
        return "In progress";
    }

    return "Active";
}

function getStatusClasses(status: string) {
    if (status === "Complete") {
        return "border-emerald-400/30 bg-emerald-400/10 text-emerald-300";
    }

    if (status === "In progress") {
        return "border-cyan-400/30 bg-cyan-400/10 text-cyan-300";
    }

    return "border-amber-400/30 bg-amber-400/10 text-amber-300";
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

export default function ProjectsPage() {
    const [projectPlans, setProjectPlans] = useState<GeneratedProjectPlan[]>([]);

    useEffect(() => {
        setProjectPlans(loadProjectPlans() as GeneratedProjectPlan[]);
    }, []);

    const sortedPlans = useMemo(() => {
        return [...projectPlans].sort((a, b) => {
            const aDeadline = new Date(a.project.deadline).getTime();
            const bDeadline = new Date(b.project.deadline).getTime();

            if (Number.isNaN(aDeadline) || Number.isNaN(bDeadline)) {
                return a.project.title.localeCompare(b.project.title);
            }

            return aDeadline - bDeadline;
        });
    }, [projectPlans]);

    return (
        <main className="min-h-screen bg-slate-950 text-white">
            <section className="mx-auto max-w-6xl px-4 py-6 sm:px-6 sm:py-8">
                <AppNav />

                <div className="mb-10 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                        <p className="mb-2 text-sm font-bold text-cyan-300">Projects</p>
                        <h1 className="text-4xl font-black tracking-tight sm:text-5xl">
                            Your coursework library.
                        </h1>
                        <p className="mt-4 max-w-3xl text-sm leading-6 text-slate-300">
                            Open saved projects, review progress, and return to long-term
                            coursework plans whenever you need.
                        </p>
                    </div>

                    <a
                        href="/projects/new"
                        className="w-fit rounded-2xl bg-cyan-400 px-6 py-4 text-center font-bold text-slate-950 transition hover:bg-cyan-300"
                    >
                        New project
                    </a>
                </div>

                {projectPlans.length === 0 ? (
                    <EmptyState
                        eyebrow="Projects library is empty"
                        title="Your coursework library is waiting for its first project."
                        description="Once you create a project, it will appear here as part of your coursework library. You can return to it later, edit tasks, check progress, and keep the project moving."
                        icon="📚"
                        actions={[
                            {
                                label: "Create project",
                                href: "/projects/new",
                            },
                            {
                                label: "Open tutorial",
                                href: "/test",
                                variant: "secondary",
                            },
                        ]}
                        tips={[
                            "Use Projects as your long-term coursework shelf.",
                            "Each saved plan can be opened again from this page.",
                            "Start with one project first rather than creating too many at once.",
                            "Templates are designed for IA, EE, TOK, essays, EPQ, and more.",
                        ]}
                    />
                ) : (
                    <section className="grid gap-5 md:grid-cols-2">
                        {sortedPlans.map((plan, index) => {
                            const projectRouteId = getProjectRouteId(plan, index);
                            const progress = calculateProgress(plan.tasks);
                            const status = getProjectStatus(progress);
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
                                            <h2 className="text-2xl font-black text-white">
                                                {plan.project.title}
                                            </h2>
                                            <p className="mt-2 text-sm text-slate-400">
                                                Deadline: {plan.project.deadline || "No deadline"}
                                            </p>
                                        </div>

                                        <span
                                            className={`w-fit rounded-full border px-3 py-1 text-xs font-black uppercase tracking-[0.16em] ${getStatusClasses(
                                                status,
                                            )}`}
                                        >
                      {status}
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
                    </section>
                )}
            </section>
        </main>
    );
}