"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { projectTemplates } from "@/lib/mockData";

export default function NewProjectForm() {
    const searchParams = useSearchParams();
    const templateFromUrl = searchParams.get("template") ?? "";

    const [selectedTemplateId, setSelectedTemplateId] =
        useState(templateFromUrl);

    useEffect(() => {
        setSelectedTemplateId(templateFromUrl);
    }, [templateFromUrl]);

    const selectedTemplate = projectTemplates.find(
        (template) => template.id === selectedTemplateId,
    );

    return (
        <div className="rounded-3xl border border-slate-800 bg-slate-900 p-6">
            <form className="space-y-6">
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
                        className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-4 text-white outline-none transition focus:border-cyan-400"
                        defaultValue="balanced"
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
                        Soon, clicking Create Project will build a real coursework plan
                        from your template and deadline. For now, this form can already
                        read the selected template from the URL.
                    </p>
                </div>

                <div className="flex flex-col gap-4 sm:flex-row">
                    <button
                        type="button"
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
            </form>
        </div>
    );
}