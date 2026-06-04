"use client";

import { useEffect, useMemo, useState } from "react";
import AppNav from "@/components/AppNav";
import ProjectCard from "@/components/ProjectCard";
import TemplateCard from "@/components/TemplateCard";
import { loadProjectPlans } from "@/lib/localStorage";
import { projectTemplates } from "@/lib/mockData";
import { applyProgressToProject } from "@/lib/progressUtils";
import type { GeneratedProjectPlan } from "@/types/coursework";

export default function ProjectsPage() {
    const [savedPlans, setSavedPlans] = useState<GeneratedProjectPlan[]>([]);

    useEffect(() => {
        const plans = loadProjectPlans();
        setSavedPlans(plans);
    }, []);

    const savedProjects = useMemo(() => {
        return savedPlans.map((plan) => applyProgressToProject(plan));
    }, [savedPlans]);

    return (
        <main className="min-h-screen bg-slate-950 text-white">
            <section className="mx-auto max-w-6xl px-6 py-8">
                <AppNav />

                <div className="mb-10 flex flex-col justify-between gap-6 md:flex-row md:items-end">
                    <div>
                        <p className="mb-2 text-sm font-bold text-cyan-300">
                            Coursework library
                        </p>
                        <h1 className="text-5xl font-black tracking-tight">
                            Manage your projects.
                        </h1>
                        <p className="mt-4 max-w-2xl text-slate-300">
                            Review your saved coursework projects or create a new plan from
                            an IB and A-Level template.
                        </p>
                    </div>

                    <a
                        href="/projects/new"
                        className="rounded-2xl bg-cyan-400 px-6 py-4 text-center font-bold text-slate-950 transition hover:bg-cyan-300"
                    >
                        New Project
                    </a>
                </div>

                <section className="mb-12">
                    <div className="mb-6 flex flex-col justify-between gap-3 md:flex-row md:items-end">
                        <div>
                            <p className="mb-2 text-sm font-bold text-emerald-300">
                                Saved projects
                            </p>
                            <h2 className="text-3xl font-black">
                                Your local coursework plans.
                            </h2>
                            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-300">
                                These projects are saved in this browser for now. Later, they
                                will move into your account and sync across devices.
                            </p>
                        </div>

                        <p className="text-sm text-slate-400">
                            {savedProjects.length} saved project
                            {savedProjects.length === 1 ? "" : "s"}
                        </p>
                    </div>

                    {savedProjects.length > 0 ? (
                        <div className="grid gap-6">
                            {savedProjects.map((project) => (
                                <ProjectCard key={project.id} project={project} />
                            ))}
                        </div>
                    ) : (
                        <div className="rounded-3xl border border-slate-800 bg-slate-900 p-6">
                            <p className="mb-2 text-xl font-bold">No saved projects yet.</p>
                            <p className="mb-6 text-sm leading-6 text-slate-300">
                                Create your first coursework plan from a template below. Once
                                saved, it will appear here.
                            </p>
                            <a
                                href="/projects/new"
                                className="inline-block rounded-2xl bg-cyan-400 px-6 py-4 font-bold text-slate-950 transition hover:bg-cyan-300"
                            >
                                Create first project
                            </a>
                        </div>
                    )}
                </section>

                <section>
                    <div className="mb-6">
                        <p className="mb-2 text-sm font-bold text-cyan-300">
                            Template library
                        </p>
                        <h2 className="text-3xl font-black">
                            Start from a coursework template.
                        </h2>
                        <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-300">
                            Pick a template to generate milestones and tasks based on your
                            deadline.
                        </p>
                    </div>

                    <div className="grid gap-6 md:grid-cols-3">
                        {projectTemplates.map((template) => (
                            <TemplateCard key={template.id} template={template} />
                        ))}
                    </div>
                </section>
            </section>
        </main>
    );
}