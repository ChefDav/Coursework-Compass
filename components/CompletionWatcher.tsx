"use client";

import { useEffect, useState } from "react";
import {
    archiveCompletedProjectTasks,
    findCompletedPlanWaitingForPrompt,
    keepCompletedProjectTasks,
    listenForProjectPlanUpdates,
} from "@/lib/localStorage";
import type { GeneratedProjectPlan } from "@/types/coursework";

export default function CompletionWatcher() {
    const [completedPlan, setCompletedPlan] =
        useState<GeneratedProjectPlan | null>(null);
    const [isOpen, setIsOpen] = useState(false);

    function checkForCompletedProject() {
        const plan = findCompletedPlanWaitingForPrompt();

        if (!plan) {
            return;
        }

        setCompletedPlan(plan);
        setIsOpen(true);
    }

    useEffect(() => {
        checkForCompletedProject();

        const unsubscribe = listenForProjectPlanUpdates(() => {
            checkForCompletedProject();
        });

        return unsubscribe;
    }, []);

    function handleKeepTasksVisible() {
        if (!completedPlan) {
            return;
        }

        keepCompletedProjectTasks(completedPlan.project.id);
        setIsOpen(false);
        setCompletedPlan(null);
    }

    function handleArchiveTasks() {
        if (!completedPlan) {
            return;
        }

        archiveCompletedProjectTasks(completedPlan.project.id);
        setIsOpen(false);
        setCompletedPlan(null);
    }

    if (!isOpen || !completedPlan) {
        return null;
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 px-6 backdrop-blur-sm">
            <div className="w-full max-w-xl rounded-3xl border border-cyan-400/30 bg-slate-900 p-6 text-white shadow-2xl shadow-cyan-950/50">
                <div className="mb-6">
                    <p className="mb-2 text-sm font-bold text-cyan-300">
                        Project completed
                    </p>
                    <h2 className="text-3xl font-black">
                        You finished {completedPlan.project.title}! 🎉
                    </h2>
                    <p className="mt-4 text-sm leading-6 text-slate-300">
                        Every task in this project is marked done. Would you like to keep
                        those tasks visible, or archive them so your Today page stays clean?
                    </p>
                </div>

                <div className="mb-6 rounded-2xl border border-slate-800 bg-slate-950 p-5">
                    <p className="text-sm text-slate-400">Completed project</p>
                    <p className="mt-2 text-xl font-bold">
                        {completedPlan.project.title}
                    </p>
                    <p className="mt-1 text-sm text-slate-400">
                        {completedPlan.tasks.length} completed tasks
                    </p>
                </div>

                <div className="flex flex-col gap-4 sm:flex-row">
                    <button
                        type="button"
                        onClick={handleArchiveTasks}
                        className="rounded-2xl bg-cyan-400 px-6 py-4 font-bold text-slate-950 transition hover:bg-cyan-300"
                    >
                        Archive completed tasks
                    </button>

                    <button
                        type="button"
                        onClick={handleKeepTasksVisible}
                        className="rounded-2xl border border-slate-700 px-6 py-4 font-bold text-white transition hover:border-slate-400"
                    >
                        Keep tasks visible
                    </button>
                </div>

                <p className="mt-4 text-xs leading-5 text-slate-500">
                    Archiving hides completed tasks from Today, but keeps the project as
                    completed with 100% progress.
                </p>
            </div>
        </div>
    );
}