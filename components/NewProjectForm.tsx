"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { projectTemplates } from "@/lib/mockData";
import type { Project, RiskLevel } from "@/types/coursework";

function createProjectId(title: string) {
    return title
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");
}

function calculateDaysLeft(deadline: string) {
    const today = new Date();
    const deadlineDate = new Date(`${deadline}T23:59:59`);

    const differenceInMilliseconds = deadlineDate.getTime() - today.getTime();
    const daysLeft = Math.ceil(differenceInMilliseconds / (1000 * 60 * 60 * 24));

    return Math.max(daysLeft, 0);
}

function calculateRisk(daysLeft: number): RiskLevel {
    if (daysLeft <= 14) {
        return "High";
    }

    if (daysLeft <= 30) {
        return "Medium";
    }

    return "Low";
}

export default function NewProjectForm() {
    const searchParams = useSearchParams();
    const templateFromUrl = searchParams.get("template") ?? "";

    const [projectTitle, setProjectTitle] = useState("");
    const [selectedTemplateId, setSelectedTemplateId] =
        useState(templateFromUrl);
    const [deadline, setDeadline] = useState("");
    const [intensity, setIntensity] = useState("balanced");
    const [errorMessage, setErrorMessage] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const [previewProject, setPreviewProject] = useState<Project | null>(null);

    useEffect(() => {
        setSelectedTemplateId(templateFromUrl);
    }, [templateFromUrl]);

    const selectedTemplate = projectTemplates.find(
        (template) => template.id === selectedTemplateId,
    );

    function handleCreateProject() {
        setErrorMessage("");
        setSuccessMessage("");
        setPreviewProject(null);

        if (!projectTitle.trim()) {
            setErrorMessage("Please enter a project name.");
            return;
        }

        if (!selectedTemplateId || !selectedTemplate) {
            setErrorMessage("Please choose a project type.");
            return;
        }

        if (!deadline) {
            setErrorMessage("Please choose a deadline.");
            return;
        }

        const daysLeft = calculateDaysLeft(deadline);
        const risk = calculateRisk(daysLeft);

        const newProject: Project = {
            id: createProjectId(projectTitle),
            title: projectTitle.trim(),
            type: selectedTemplate.name,
            progress: 0,
            daysLeft,
            risk,
            deadline,
            status: "Active",
        };

        setPreviewProject(newProject);
        setSuccessMessage(
            `Project preview created. Next mission will generate tasks for ${newProject.title}.`,
        );

        console.log({
            project: newProject,
            intensity,
        });
    }

    return (
        <div className="rounded-3xl border border-slate-800 bg-slate-900 p-6">
            <form className="space-y-6">
                {errorMessage ? (
                    <div className="rounded-2xl border border-red-400/30 bg-red-400/10 p-4 text-sm font-bold text-red-300">
                        {errorMessage}
                    </div>
                ) : null}

                {successMessage ? (
                    <div className="rounded-2xl border border-emerald-400/30 bg-emerald-400/10 p-4 text-sm font-bold text-emerald-300">
                        {successMessage}
                    </div>
                ) : null}

                <div>
                    <label
                        htmlFor="project-title"
                        className="mb-2 block text-sm font-bold text-slate-200"
                    >
                        Project name
                    </label>
                    <input
                        id="project-title"
                        name="project-title"
                        type="text"
                        value={projectTitle}
                        onChange={(event) => setProjectTitle(event.target.value)}
                        placeholder="e.g. Math IA Exploration"
                        className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-4 text-white outline-none transition placeholder:text-slate-500 focus:border-cyan-400"
                    />
                </div>

                <div>
                    <label
                        htmlFor="project-template"
                        className="mb-2 block text-sm font-bold text-slate-200"
                    >
                        Project type
                    </label>
                    <select
                        id="project-template"
                        name="project-template"
                        value={selectedTemplateId}
                        onChange={(event) => setSelectedTemplateId(event.target.value)}
                        className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-4 text-white outline-none transition focus:border-cyan-400"
                    >
                        <option value="" disabled>
                            Choose a template
                        </option>
                        {projectTemplates.map((template) => (
                            <option key={template.id} value={template.id}>
                                {template.name}
                            </option>
                        ))}
                    </select>
                </div>

                {selectedTemplate ? (
                    <div className="rounded-2xl border border-cyan-400/30 bg-cyan-400/10 p-5">
                        <p className="mb-2 text-sm font-bold text-cyan-300">
                            Selected template
                        </p>
                        <h2 className="mb-2 text-xl font-black">
                            {selectedTemplate.name}
                        </h2>
                        <p className="text-sm leading-6 text-slate-300">
                            {selectedTemplate.description}
                        </p>
                    </div>
                ) : (
                    <div className="rounded-2xl border border-slate-800 bg-slate-950 p-5">
                        <p className="mb-2 text-sm font-bold text-slate-300">
                            No template selected
                        </p>
                        <p className="text-sm leading-6 text-slate-400">
                            Choose a coursework type so Coursework Compass can prepare a
                            deadline-based plan in the next missions.
                        </p>
                    </div>
                )}

                <div>
                    <label
                        htmlFor="deadline"
                        className="mb-2 block text-sm font-bold text-slate-200"
                    >
                        Deadline
                    </label>
                    <input
                        id="deadline"
                        name="deadline"
                        type="date"
                        value={deadline}
                        onChange={(event) => setDeadline(event.target.value)}
                        className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-4 text-white outline-none transition focus:border-cyan-400"
                    />
                </div>

                <div>
                    <label
                        htmlFor="intensity"
                        className="mb-2 block text-sm font-bold text-slate-200"
                    >
                        Planning intensity
                    </label>
                    <select
                        id="intensity"
                        name="intensity"
                        value={intensity}
                        onChange={(event) => setIntensity(event.target.value)}
                        className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-4 text-white outline-none transition focus:border-cyan-400"
                    >
                        <option value="light">Light: fewer tasks per week</option>
                        <option value="balanced">Balanced: steady daily progress</option>
                        <option value="intense">Intense: faster deadline attack</option>
                    </select>
                </div>

                <div className="rounded-2xl border border-cyan-400/30 bg-cyan-400/10 p-5">
                    <p className="mb-2 text-sm font-bold text-cyan-300">
                        Coming next
                    </p>
                    <p className="text-sm leading-6 text-slate-300">
                        Soon, Coursework Compass will turn this project preview into a real
                        generated task plan.
                    </p>
                </div>

                <div className="flex flex-col gap-4 sm:flex-row">
                    <button
                        type="button"
                        onClick={handleCreateProject}
                        className="rounded-2xl bg-cyan-400 px-6 py-4 font-bold text-slate-950 transition hover:bg-cyan-300"
                    >
                        Create Project
                    </button>

                    <a
                        href="/projects"
                        className="rounded-2xl border border-slate-700 px-6 py-4 text-center font-bold text-white transition hover:border-slate-400"
                    >
                        Back to Projects
                    </a>
                </div>

                {previewProject ? (
                    <div className="mt-8 rounded-3xl border border-slate-700 bg-slate-950 p-6">
                        <p className="mb-2 text-sm font-bold text-cyan-300">
                            Project preview
                        </p>

                        <div className="mb-5 flex flex-col justify-between gap-4 md:flex-row md:items-center">
                            <div>
                                <h2 className="text-2xl font-black">
                                    {previewProject.title}
                                </h2>
                                <p className="text-sm text-slate-400">
                                    {previewProject.type}
                                </p>
                            </div>

                            <span
                                className={`rounded-full px-4 py-2 text-sm font-bold ${
                                    previewProject.risk === "High"
                                        ? "bg-red-400/10 text-red-300"
                                        : previewProject.risk === "Medium"
                                            ? "bg-amber-400/10 text-amber-300"
                                            : "bg-emerald-400/10 text-emerald-300"
                                }`}
                            >
                {previewProject.risk} Risk
              </span>
                        </div>

                        <div className="grid gap-4 md:grid-cols-3">
                            <div className="rounded-2xl border border-slate-800 bg-slate-900 p-4">
                                <p className="text-sm text-slate-400">Progress</p>
                                <p className="mt-2 text-2xl font-black">
                                    {previewProject.progress}%
                                </p>
                            </div>

                            <div className="rounded-2xl border border-slate-800 bg-slate-900 p-4">
                                <p className="text-sm text-slate-400">Days left</p>
                                <p className="mt-2 text-2xl font-black">
                                    {previewProject.daysLeft}
                                </p>
                            </div>

                            <div className="rounded-2xl border border-slate-800 bg-slate-900 p-4">
                                <p className="text-sm text-slate-400">Deadline</p>
                                <p className="mt-2 text-2xl font-black">
                                    {previewProject.deadline}
                                </p>
                            </div>
                        </div>
                    </div>
                ) : null}
            </form>
        </div>
    );
}