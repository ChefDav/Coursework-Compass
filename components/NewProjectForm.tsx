"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import CalendarDateField from "@/components/CalendarDateField";
import FancySelect from "@/components/FancySelect";
import { projectTemplates } from "@/lib/mockData";
import { generateProjectPlan } from "@/lib/taskGenerator";
import { saveProjectPlan } from "@/lib/localStorage";
import type {
    GeneratedProjectPlan,
    PlanningIntensity,
} from "@/types/coursework";

const planningIntensityOptions = [
    {
        label: "Light",
        value: "light",
        description: "4 focused tasks for a lighter workload or early planning.",
    },
    {
        label: "Balanced",
        value: "balanced",
        description: "6 tasks for steady daily progress without overload.",
    },
    {
        label: "Intense",
        value: "intense",
        description: "8 tasks for urgent deadlines or a stronger work sprint.",
    },
];

function isPlanningIntensity(value: string): value is PlanningIntensity {
    return value === "light" || value === "balanced" || value === "intense";
}

function normaliseDeadlineFormat(deadline: string) {
    return deadline.trim().replaceAll("-", "/");
}

function validateDeadline(deadline: string) {
    const normalisedDeadline = normaliseDeadlineFormat(deadline);
    const deadlinePattern = /^(\d{4})\/(\d{2})\/(\d{2})$/;
    const match = normalisedDeadline.match(deadlinePattern);

    if (!match) {
        return "Use the format yyyy/mm/dd, for example 2026/07/10.";
    }

    const year = Number(match[1]);
    const month = Number(match[2]);
    const day = Number(match[3]);

    if (year < 2026) {
        return "The year cannot be earlier than 2026.";
    }

    if (month < 1 || month > 12) {
        return "The month must be between 01 and 12.";
    }

    const parsedDate = new Date(year, month - 1, day);

    const isRealDate =
        parsedDate.getFullYear() === year &&
        parsedDate.getMonth() === month - 1 &&
        parsedDate.getDate() === day;

    if (!isRealDate) {
        return "Enter a real calendar date.";
    }

    return "";
}

export default function NewProjectForm() {
    const searchParams = useSearchParams();
    const templateFromUrl = searchParams.get("template") ?? "";

    const [projectName, setProjectName] = useState("");
    const [selectedTemplateId, setSelectedTemplateId] = useState("");
    const [deadline, setDeadline] = useState("");
    const [planningIntensity, setPlanningIntensity] =
        useState<PlanningIntensity>("balanced");
    const [generatedPlan, setGeneratedPlan] =
        useState<GeneratedProjectPlan | null>(null);
    const [formError, setFormError] = useState("");
    const [saveMessage, setSaveMessage] = useState("");

    useEffect(() => {
        const templateExists = projectTemplates.some(
            (template) => template.id === templateFromUrl,
        );

        if (templateExists) {
            setSelectedTemplateId(templateFromUrl);
        }
    }, [templateFromUrl]);

    const templateOptions = useMemo(() => {
        return projectTemplates.map((template) => ({
            label: template.name,
            value: template.id,
            description: template.description,
        }));
    }, []);

    const selectedTemplate = projectTemplates.find(
        (template) => template.id === selectedTemplateId,
    );

    function handleCreateProject() {
        setFormError("");
        setSaveMessage("");

        const trimmedProjectName = projectName.trim();

        if (!trimmedProjectName) {
            setFormError("Please enter a project name.");
            return;
        }

        if (!selectedTemplateId) {
            setFormError("Please choose a project template.");
            return;
        }

        const normalisedDeadline = normaliseDeadlineFormat(deadline);
        const deadlineError = validateDeadline(normalisedDeadline);

        if (deadlineError) {
            setFormError(deadlineError);
            return;
        }

        const plan = generateProjectPlan({
            projectName: trimmedProjectName,
            templateId: selectedTemplateId,
            deadline: normalisedDeadline,
            intensity: planningIntensity,
        });

        setDeadline(normalisedDeadline);
        setGeneratedPlan(plan);
    }

    function handleSaveProject() {
        if (!generatedPlan) {
            return;
        }

        saveProjectPlan(generatedPlan);
        setSaveMessage(
            `${generatedPlan.project.title} was saved locally in this browser.`,
        );
    }

    return (
        <div className="rounded-3xl border border-cyan-400/20 bg-slate-900/80 p-5 shadow-2xl shadow-cyan-950/30 sm:p-8">
            <div className="space-y-6">
                <div>
                    <label className="mb-2 block text-sm font-bold text-white">
                        Project name
                    </label>
                    <input
                        type="text"
                        value={projectName}
                        onChange={(event) => {
                            setProjectName(event.target.value);
                            setGeneratedPlan(null);
                            setSaveMessage("");
                        }}
                        placeholder="e.g. Math IA Exploration"
                        className="w-full rounded-2xl border border-slate-600 bg-slate-950/70 px-4 py-4 font-bold text-white outline-none transition placeholder:text-slate-500 focus:border-cyan-300 focus:shadow-lg focus:shadow-cyan-950/40"
                    />
                </div>

                <FancySelect
                    label="Project type"
                    value={selectedTemplateId}
                    placeholder="Choose a template"
                    options={templateOptions}
                    onChange={(nextValue) => {
                        setSelectedTemplateId(nextValue);
                        setGeneratedPlan(null);
                        setSaveMessage("");
                    }}
                    helperText={
                        selectedTemplate
                            ? selectedTemplate.description
                            : "Choose a coursework type so Coursework Compass can prepare a deadline-based plan."
                    }
                />

                <CalendarDateField
                    label="Deadline"
                    value={deadline}
                    onChange={(nextValue) => {
                        setDeadline(nextValue);
                        setGeneratedPlan(null);
                        setSaveMessage("");
                    }}
                    helperText="Click to choose from the calendar. Double-click to type manually."
                />

                <FancySelect
                    label="Planning intensity"
                    value={planningIntensity}
                    placeholder="Choose planning intensity"
                    options={planningIntensityOptions}
                    onChange={(nextValue) => {
                        if (!isPlanningIntensity(nextValue)) {
                            return;
                        }

                        setPlanningIntensity(nextValue);
                        setGeneratedPlan(null);
                        setSaveMessage("");
                    }}
                    helperText="Choose how aggressively Coursework Compass should break down your plan."
                />

                {formError ? (
                    <div className="rounded-2xl border border-red-400/30 bg-red-400/10 p-4 text-sm font-bold text-red-300">
                        {formError}
                    </div>
                ) : null}

                <div className="rounded-3xl border border-cyan-400/30 bg-cyan-400/10 p-5">
                    <p className="mb-2 text-sm font-bold text-cyan-300">Coming next</p>
                    <p className="text-sm leading-6 text-slate-300">
                        Click Create Project to generate a real coursework plan from your
                        template, deadline, and planning intensity. You can then save it
                        locally and track it through Dashboard, Today, and Project Details.
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
            </div>

            {generatedPlan ? (
                <section className="mt-8 rounded-3xl border border-emerald-400/30 bg-emerald-400/10 p-5 sm:p-6">
                    <div className="mb-6">
                        <p className="mb-2 text-sm font-bold text-emerald-300">
                            Project preview
                        </p>
                        <h2 className="text-2xl font-black sm:text-3xl">
                            {generatedPlan.project.title}
                        </h2>
                        <p className="mt-2 text-sm leading-6 text-slate-300">
                            {generatedPlan.project.type} · {generatedPlan.tasks.length} tasks
                            generated · deadline {generatedPlan.project.deadline}
                        </p>
                    </div>

                    <div className="mb-6 grid gap-4 sm:grid-cols-3">
                        <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-4">
                            <p className="text-xs font-bold text-slate-400">Risk</p>
                            <p className="mt-1 text-xl font-black">
                                {generatedPlan.project.risk}
                            </p>
                        </div>

                        <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-4">
                            <p className="text-xs font-bold text-slate-400">Days left</p>
                            <p className="mt-1 text-xl font-black">
                                {generatedPlan.project.daysLeft}
                            </p>
                        </div>

                        <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-4">
                            <p className="text-xs font-bold text-slate-400">Intensity</p>
                            <p className="mt-1 text-xl font-black capitalize">
                                {generatedPlan.intensity}
                            </p>
                        </div>
                    </div>

                    <div className="space-y-3">
                        {generatedPlan.tasks.map((task) => (
                            <div
                                key={task.id}
                                className="rounded-2xl border border-slate-800 bg-slate-950/70 p-4"
                            >
                                <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                                    <div>
                                        <p className="font-bold text-white">{task.title}</p>
                                        <p className="mt-1 text-xs text-slate-400">
                                            Due {task.dueDate || "Not scheduled"} · {task.time}
                                        </p>
                                    </div>

                                    <span className="w-fit rounded-full bg-cyan-400/10 px-3 py-1 text-xs font-bold text-cyan-300">
                    {task.priority}
                  </span>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center">
                        <button
                            type="button"
                            onClick={handleSaveProject}
                            className="rounded-2xl bg-emerald-400 px-6 py-4 font-bold text-slate-950 transition hover:bg-emerald-300"
                        >
                            Save Project Locally
                        </button>

                        {saveMessage ? (
                            <p className="text-sm font-bold text-emerald-300">
                                {saveMessage}
                            </p>
                        ) : null}
                    </div>
                </section>
            ) : null}
        </div>
    );
}