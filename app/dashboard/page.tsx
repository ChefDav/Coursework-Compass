"use client";

import { useEffect, useMemo, useState } from "react";
import AppNav from "@/components/AppNav";
import ProjectCard from "@/components/ProjectCard";
import {
    listenForProjectPlanUpdates,
    loadProjectPlans,
} from "@/lib/localStorage";
import {
    applyProgressToProject,
    countDoneTasks,
} from "@/lib/progressUtils";
import type { GeneratedProjectPlan } from "@/types/coursework";

export default function DashboardPage() {
    const [savedPlans, setSavedPlans] = useState<GeneratedProjectPlan[]>([]);

    useEffect(() => {
        function refreshPlans() {
            const plans = loadProjectPlans();
            setSavedPlans(plans);
        }

        refreshPlans();

        const unsubscribe = listenForProjectPlanUpdates(refreshPlans);

        return unsubscribe;
    }, []);

    const savedProjects = useMemo(() => {
        return savedPlans.map((plan) => applyProgressToProject(plan));
    }, [savedPlans]);

    const savedProjectIds = useMemo(() => {
        return new Set(savedProjects.map((project) => project.id));
    }, [savedProjects]);

    const savedTasks = useMemo(() => {
        return savedPlans.flatMap((plan) => plan.tasks);
    }, [savedPlans]);

    const activeProjects = savedProjects.filter(
        (project) => project.status !== "Completed",
    );

    const completedProjects = savedProjects.filter(
        (project) => project.status === "Completed",
    );

    const totalTaskCount = savedTasks.length;
    const doneTaskCount = countDoneTasks(savedTasks);

    const highRiskProjectCount = savedProjects.filter(
        (project) => project.risk === "High" && project.status !== "Completed",
    ).length;

    return (
        <main className="min-h-screen bg-slate-950 text-white">
            <section className="mx-auto max-w-6xl px-6 py-8">
                <AppNav />

                <div className="mb-10">
                    <p className="mb-2 text-sm font-bold text-cyan-300">
                        Student command center
                    </p>
                    <h1 className="text-5xl font-black tracking-tight">
                        Your coursework dashboard.
                    </h1>
                    <p className="mt-4 max-w-2xl text-slate-300">
                        Track your saved coursework projects, monitor progress, and decide
                        what deserves your attention next.
                    </p>
                </div>

                <div className="mb-10 grid gap-6 md:grid-cols-4">
                    <div className="rounded-3xl border border-slate-800 bg-slate-900 p-6">
                        <p className="text-sm text-slate-400">Active projects</p>
                        <p className="mt-2 text-4xl font-black">{activeProjects.length}</p>
                    </div>

                    <div className="rounded-3xl border border-slate-800 bg-slate-900 p-6">
                        <p className="text-sm text-slate-400">Total tasks</p>
                        <p className="mt-2 text-4xl font-black">{totalTaskCount}</p>
                    </div>

                    <div className="rounded-3xl border border-emerald-400/30 bg-emerald-400/10 p-6">
                        <p className="text-sm text-emerald-200">Completed tasks</p>
                        <p className="mt-2 text-4xl font-black text-emerald-200">
                            {doneTaskCount}
                        </p>
                    </div>

                    <div className="rounded-3xl border border-red-400/30 bg-red-400/10 p-6">
                        <p className="text-sm text-red-200">High risk items</p>
                        <p className="mt-2 text-4xl font-black text-red-200">
                            {highRiskProjectCount}
                        </p>
                    </div>
                </div>

                {savedPlans.length > 0 ? (
                    <div className="mb-8 rounded-3xl border border-emerald-400/30 bg-emerald-400/10 p-6">
                        <p className="mb-2 text-sm font-bold text-emerald-300">
                            Local projects loaded
                        </p>
                        <h2 className="text-2xl font-black">
                            {savedPlans.length} saved project
                            {savedPlans.length === 1 ? "" : "s"} found in this browser.
                        </h2>
                        <p className="mt-2 text-sm leading-6 text-slate-300">
                            Project progress is calculated from completed tasks. Mark tasks
                            done on the Today page or inside a project detail page to move
                            the progress bar forward.
                        </p>
                    </div>
                ) : (
                    <div className="mb-8 rounded-3xl border border-cyan-400/30 bg-cyan-400/10 p-8">
                        <p className="mb-2 text-sm font-bold text-cyan-300">
                            Empty dashboard
                        </p>
                        <h2 className="text-3xl font-black">
                            No saved coursework projects yet.
                        </h2>
                        <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-300">
                            Your dashboard is clear. Create your first coursework plan from a
                            template, then it will appear here with live progress, risk, and
                            task statistics.
                        </p>

                        <div className="mt-6 flex flex-col gap-4 sm:flex-row">
                            <a
                                href="/projects/new"
                                className="rounded-2xl bg-cyan-400 px-6 py-4 text-center font-bold text-slate-950 transition hover:bg-cyan-300"
                            >
                                Create first project
                            </a>

                            <a
                                href="/projects"
                                className="rounded-2xl border border-slate-700 px-6 py-4 text-center font-bold text-white transition hover:border-slate-400"
                            >
                                Browse templates
                            </a>
                        </div>
                    </div>
                )}

                {completedProjects.length > 0 ? (
                    <div className="mb-8 rounded-3xl border border-slate-800 bg-slate-900 p-6">
                        <p className="mb-2 text-sm font-bold text-slate-300">
                            Completed projects
                        </p>
                        <h2 className="text-2xl font-black">
                            {completedProjects.length} project
                            {completedProjects.length === 1 ? "" : "s"} completed.
                        </h2>
                        <p className="mt-2 text-sm leading-6 text-slate-300">
                            Completed projects stay visible here even if their tasks are
                            archived from Today.
                        </p>
                    </div>
                ) : null}

                {savedProjects.length > 0 ? (
                    <div className="grid gap-6">
                        {savedProjects.map((project) => (
                            <ProjectCard
                                key={project.id}
                                project={project}
                                detailsHref={
                                    savedProjectIds.has(project.id)
                                        ? `/projects/${project.id}`
                                        : undefined
                                }
                            />
                        ))}
                    </div>
                ) : null}
            </section>
        </main>
    );
}