"use client";

import { useEffect, useMemo, useState } from "react";
import AppNav from "@/components/AppNav";
import ProjectCard from "@/components/ProjectCard";
import { loadProjectPlans } from "@/lib/localStorage";
import { projects, tasks } from "@/lib/mockData";
import {
    applyProgressToProject,
    countDoneTasks,
} from "@/lib/progressUtils";
import type { GeneratedProjectPlan } from "@/types/coursework";

export default function DashboardPage() {
    const [savedPlans, setSavedPlans] = useState<GeneratedProjectPlan[]>([]);

    useEffect(() => {
        const plans = loadProjectPlans();
        setSavedPlans(plans);
    }, []);

    const savedProjects = useMemo(() => {
        return savedPlans.map((plan) => applyProgressToProject(plan));
    }, [savedPlans]);

    const savedTasks = useMemo(() => {
        return savedPlans.flatMap((plan) => plan.tasks);
    }, [savedPlans]);

    const allProjects = useMemo(() => {
        const savedProjectIds = new Set(
            savedProjects.map((project) => project.id),
        );

        const mockProjectsWithoutDuplicates = projects.filter(
            (project) => !savedProjectIds.has(project.id),
        );

        return [...savedProjects, ...mockProjectsWithoutDuplicates];
    }, [savedProjects]);

    const allTasks = useMemo(() => {
        return [...savedTasks, ...tasks];
    }, [savedTasks]);

    const totalTaskCount = allTasks.length;
    const doneTaskCount = countDoneTasks(allTasks);

    const highRiskProjectCount = allProjects.filter(
        (project) => project.risk === "High",
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
                        Track every major assignment, spot risky deadlines, and decide what
                        deserves your attention today.
                    </p>
                </div>

                <div className="mb-10 grid gap-6 md:grid-cols-4">
                    <div className="rounded-3xl border border-slate-800 bg-slate-900 p-6">
                        <p className="text-sm text-slate-400">Active projects</p>
                        <p className="mt-2 text-4xl font-black">{allProjects.length}</p>
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
                            Project progress is now calculated from completed tasks. Mark
                            tasks done on the Today page, then return here to see progress
                            move.
                        </p>
                    </div>
                ) : null}

                <div className="grid gap-6">
                    {allProjects.map((project) => (
                        <ProjectCard key={project.id} project={project} />
                    ))}
                </div>
            </section>
        </main>
    );
}