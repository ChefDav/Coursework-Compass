"use client";

import { useEffect, useMemo, useState } from "react";
import AppNav from "@/components/AppNav";
import ProjectCard from "@/components/ProjectCard";
import TemplateCard from "@/components/TemplateCard";
import {
    deleteProjectPlan,
    loadProjectPlans,
} from "@/lib/localStorage";
import { projectTemplates } from "@/lib/mockData";
import { applyProgressToProject } from "@/lib/progressUtils";
import type { GeneratedProjectPlan } from "@/types/coursework";

export default function ProjectsPage() {
    const [savedPlans, setSavedPlans] = useState<GeneratedProjectPlan[]>([]);
    const [statusMessage, setStatusMessage] = useState("");

    useEffect(() => {
        const plans = loadProjectPlans();
        setSavedPlans(plans);
    }, []);

    const savedProjects = useMemo(() => {
        return savedPlans.map((plan) => applyProgressToProject(plan));
    }, [savedPlans]);

    function handleDeleteProject(projectId: string, projectTitle: string) {
        const shouldDelete = window.confirm(
            `Delete "${projectTitle}" from this browser? This will also remove its generated tasks.`,
        );

        if (!shouldDelete) {
            return;
        }

        const updatedPlans = deleteProjectPlan(projectId);

        setSavedPlans(updatedPlans);
        setStatusMessage(`${projectTitle} was deleted from local storage.`);
    }

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

                {statusMessage ? (
                    <div className="mb-8 rounded-3xl border border-emerald-400/30 bg-emerald-400/10 p-5 text-sm font-bold text-emerald-300">
                        {statusMessage}
                    </div>
                ) : null}

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
                                <div
                                    key={project.id}
                                    className="rounded-3xl border border-slate-800 bg-slate-950 p-4"
                                >
                                    <ProjectCard
                                        project={project}
                                        detailsHref={`/projects/${project.id}`}
                                    />

                                    <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                                        <p className="text-sm text-slate-400">
                                            Stored locally in this browser.
                                        </p>

                                        <button
                                            type="button"
                                            onClick={() =>
                                                handleDeleteProject(project.id, project.title)
                                            }
                                            className="rounded-2xl border border-red-400/30 px-5 py-3 text-sm font-bold text-red-300 transition hover:bg-red-400/10"
                                        >
                                            Delete local project
                                        </button>
                                    </div>
                                </div>
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