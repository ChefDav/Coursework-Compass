"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import AppNav from "@/components/AppNav";
import ProjectCard from "@/components/ProjectCard";
import TaskCard from "@/components/TaskCard";
import { loadProjectPlans, updateTaskStatus } from "@/lib/localStorage";
import { applyProgressToProject, countDoneTasks } from "@/lib/progressUtils";
import type {
    GeneratedProjectPlan,
    TaskStatus,
} from "@/types/coursework";

export default function ProjectDetailPage() {
    const params = useParams<{ projectId: string }>();
    const projectId = params.projectId;

    const [savedPlans, setSavedPlans] = useState<GeneratedProjectPlan[]>([]);

    useEffect(() => {
        const plans = loadProjectPlans();
        setSavedPlans(plans);
    }, []);

    const currentPlan = useMemo(() => {
        return savedPlans.find((plan) => plan.project.id === projectId) ?? null;
    }, [projectId, savedPlans]);

    const project = currentPlan ? applyProgressToProject(currentPlan) : null;
    const tasks = currentPlan?.tasks ?? [];
    const doneTaskCount = countDoneTasks(tasks);
    const todoTaskCount = tasks.filter((task) => task.status === "Todo").length;
    const archivedTaskCount = currentPlan?.archivedTaskCount ?? 0;

    function handleChangeTaskStatus(taskId: string, nextStatus: TaskStatus) {
        const updatedPlans = updateTaskStatus(taskId, nextStatus);
        setSavedPlans(updatedPlans);
    }

    if (projectId === "new") {
        return (
            <main className="min-h-screen bg-slate-950 text-white">
                <section className="mx-auto max-w-6xl px-4 py-6 sm:px-6 sm:py-8">
                    <AppNav />

                    <div className="rounded-3xl border border-red-400/30 bg-red-400/10 p-8">
                        <p className="mb-2 text-sm font-bold text-red-300">
                            Route issue detected
                        </p>
                        <h1 className="text-4xl font-black tracking-tight sm:text-5xl">
                            The new project page was not reached.
                        </h1>
                        <p className="mt-4 max-w-2xl text-slate-300">
                            The app tried to treat /projects/new as a project detail route.
                            Please check that app/projects/new/page.tsx exists in the correct
                            folder.
                        </p>

                        <a
                            href="/projects/new"
                            className="mt-6 inline-block rounded-2xl bg-cyan-400 px-6 py-4 font-bold text-slate-950 transition hover:bg-cyan-300"
                        >
                            Try New Project again
                        </a>
                    </div>
                </section>
            </main>
        );
    }

    if (!project || !currentPlan) {
        return (
            <main className="min-h-screen bg-slate-950 text-white">
                <section className="mx-auto max-w-6xl px-4 py-6 sm:px-6 sm:py-8">
                    <AppNav />

                    <div className="rounded-3xl border border-slate-800 bg-slate-900 p-8">
                        <p className="mb-2 text-sm font-bold text-red-300">
                            Project not found
                        </p>
                        <h1 className="text-4xl font-black tracking-tight sm:text-5xl">
                            This project is not saved here.
                        </h1>
                        <p className="mt-4 max-w-2xl text-slate-300">
                            This project may have been deleted, archived in another browser,
                            or never saved locally on this device.
                        </p>

                        <a
                            href="/projects"
                            className="mt-6 inline-block rounded-2xl bg-cyan-400 px-6 py-4 font-bold text-slate-950 transition hover:bg-cyan-300"
                        >
                            Back to Projects
                        </a>
                    </div>
                </section>
            </main>
        );
    }

    return (
        <main className="min-h-screen bg-slate-950 text-white">
            <section className="mx-auto max-w-6xl px-4 py-6 sm:px-6 sm:py-8">
                <AppNav />

                <div className="mb-10 flex flex-col justify-between gap-6 md:flex-row md:items-end">
                    <div>
                        <p className="mb-2 text-sm font-bold text-cyan-300">
                            Project details
                        </p>
                        <h1 className="text-4xl font-black tracking-tight sm:text-5xl">
                            {project.title}
                        </h1>
                        <p className="mt-4 max-w-2xl text-slate-300">
                            Review this coursework project, track generated tasks, and keep
                            pressure on the deadline.
                        </p>
                    </div>

                    <a
                        href="/projects"
                        className="rounded-2xl border border-slate-700 px-6 py-4 text-center font-bold text-white transition hover:border-slate-400"
                    >
                        Back to Projects
                    </a>
                </div>

                <div className="mb-8">
                    <ProjectCard project={project} />
                </div>

                <div className="mb-8 grid gap-6 md:grid-cols-4">
                    <div className="rounded-3xl border border-slate-800 bg-slate-900 p-5 sm:p-6">
                        <p className="text-sm text-slate-400">Total tasks</p>
                        <p className="mt-2 text-3xl font-black sm:text-4xl">
                            {tasks.length}
                        </p>
                    </div>

                    <div className="rounded-3xl border border-slate-800 bg-slate-900 p-5 sm:p-6">
                        <p className="text-sm text-slate-400">Todo</p>
                        <p className="mt-2 text-3xl font-black sm:text-4xl">
                            {todoTaskCount}
                        </p>
                    </div>

                    <div className="rounded-3xl border border-emerald-400/30 bg-emerald-400/10 p-5 sm:p-6">
                        <p className="text-sm text-emerald-200">Done</p>
                        <p className="mt-2 text-3xl font-black text-emerald-200 sm:text-4xl">
                            {doneTaskCount}
                        </p>
                    </div>

                    <div className="rounded-3xl border border-cyan-400/30 bg-cyan-400/10 p-5 sm:p-6">
                        <p className="text-sm text-cyan-200">Archived</p>
                        <p className="mt-2 text-3xl font-black text-cyan-200 sm:text-4xl">
                            {archivedTaskCount}
                        </p>
                    </div>
                </div>

                {currentPlan.tasksArchivedAt ? (
                    <div className="mb-8 rounded-3xl border border-cyan-400/30 bg-cyan-400/10 p-6">
                        <p className="mb-2 text-sm font-bold text-cyan-300">
                            Tasks archived
                        </p>
                        <h2 className="text-2xl font-black sm:text-3xl">
                            Completed tasks were archived.
                        </h2>
                        <p className="mt-2 text-sm leading-6 text-slate-300">
                            This project remains completed at 100%, but its finished tasks
                            are hidden from Today to keep your daily workspace clean.
                        </p>
                    </div>
                ) : null}

                <section>
                    <div className="mb-6">
                        <p className="mb-2 text-sm font-bold text-cyan-300">Task list</p>
                        <h2 className="text-2xl font-black sm:text-3xl">
                            Generated coursework tasks.
                        </h2>
                        <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-300">
                            These tasks were generated from the original template and
                            deadline.
                        </p>
                    </div>

                    {tasks.length > 0 ? (
                        <div className="space-y-4">
                            {tasks.map((task) => (
                                <TaskCard
                                    key={task.id}
                                    task={task}
                                    onChangeStatus={handleChangeTaskStatus}
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="rounded-3xl border border-slate-800 bg-slate-900 p-6">
                            <p className="mb-2 text-xl font-bold">No visible tasks.</p>
                            <p className="text-sm leading-6 text-slate-300">
                                This usually means the completed tasks were archived after the
                                project reached 100%.
                            </p>
                        </div>
                    )}
                </section>
            </section>
        </main>
    );
}