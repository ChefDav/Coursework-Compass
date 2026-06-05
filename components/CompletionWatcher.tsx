"use client";

import { useEffect, useState } from "react";
import {
    archiveCompletedProjectTasks,
    findCompletedPlanWaitingForPrompt,
    keepCompletedProjectTasks,
    listenForProjectPlanUpdates,
    type GeneratedProjectPlan,
} from "@/lib/localStorage";

export default function CompletionWatcher() {
    const [completedPlan, setCompletedPlan] =
        useState<GeneratedProjectPlan | null>(null);
    const [isOpen, setIsOpen] = useState(false);

    function checkForCompletedProject() {
        const plan = findCompletedPlanWaitingForPrompt();

        if (!plan) {
            setCompletedPlan(null);
            setIsOpen(false);
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

        return () => {
            unsubscribe();
        };
    }, []);

    function handleArchiveCompletedTasks() {
        if (!completedPlan) {
            return;
        }

        archiveCompletedProjectTasks(completedPlan.id);
        setCompletedPlan(null);
        setIsOpen(false);
    }

    function handleKeepCompletedTasks() {
        if (!completedPlan) {
            return;
        }

        keepCompletedProjectTasks(completedPlan.id);
        setCompletedPlan(null);
        setIsOpen(false);
    }

    function handleCloseTemporarily() {
        setIsOpen(false);
    }

    if (!isOpen || !completedPlan) {
        return null;
    }

    const completedTaskCount = completedPlan.tasks.filter(
        (task) => task.status === "Done",
    ).length;

    return (
        <section className="fixed inset-0 z-[80] flex items-center justify-center bg-slate-950/80 px-4 py-6 backdrop-blur-md">
            <div className="relative w-full max-w-2xl overflow-hidden rounded-[2rem] border border-emerald-400/30 bg-slate-950 p-5 text-white shadow-2xl shadow-emerald-950/50 sm:p-8">
                <div className="absolute -right-20 -top-20 h-52 w-52 rounded-full bg-emerald-400/20 blur-3xl" />
                <div className="absolute -bottom-24 -left-24 h-56 w-56 rounded-full bg-cyan-400/20 blur-3xl" />

                <div className="relative z-10">
                    <div className="mb-5 inline-flex rounded-full border border-emerald-400/30 bg-emerald-400/10 px-4 py-2 text-xs font-black uppercase tracking-[0.2em] text-emerald-300">
                        Project completed
                    </div>

                    <h2 className="text-3xl font-black tracking-tight sm:text-4xl">
                        Nice work. This project looks complete.
                    </h2>

                    <p className="mt-4 text-sm leading-6 text-slate-300">
                        All active tasks in{" "}
                        <span className="font-bold text-white">
              {completedPlan.project.title}
            </span>{" "}
                        are marked as done. You can archive the completed tasks to keep the
                        workspace clean, or keep them visible if you still want to review
                        them.
                    </p>

                    <div className="mt-5 grid gap-4 sm:grid-cols-3">
                        <div className="rounded-3xl border border-slate-800 bg-slate-900 p-4">
                            <p className="text-sm font-bold text-slate-400">Completed</p>
                            <p className="mt-2 text-3xl font-black text-emerald-300">
                                {completedTaskCount}
                            </p>
                        </div>

                        <div className="rounded-3xl border border-slate-800 bg-slate-900 p-4">
                            <p className="text-sm font-bold text-slate-400">Project</p>
                            <p className="mt-2 text-lg font-black text-white">
                                {completedPlan.project.title}
                            </p>
                        </div>

                        <div className="rounded-3xl border border-slate-800 bg-slate-900 p-4">
                            <p className="text-sm font-bold text-slate-400">Status</p>
                            <p className="mt-2 text-lg font-black text-emerald-300">
                                Ready to clean
                            </p>
                        </div>
                    </div>

                    <div className="mt-6 rounded-3xl border border-cyan-400/30 bg-cyan-400/10 p-4">
                        <p className="text-sm font-bold leading-6 text-cyan-200">
                            If you add new work later, archived tasks can be restored
                            automatically so the project progress recalculates correctly.
                        </p>
                    </div>

                    <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                        <button
                            type="button"
                            onClick={handleArchiveCompletedTasks}
                            className="rounded-2xl bg-emerald-400 px-6 py-4 text-center font-bold text-slate-950 transition hover:bg-emerald-300"
                        >
                            Archive completed tasks
                        </button>

                        <button
                            type="button"
                            onClick={handleKeepCompletedTasks}
                            className="rounded-2xl border border-slate-700 px-6 py-4 text-center font-bold text-white transition hover:border-emerald-400 hover:text-emerald-300"
                        >
                            Keep tasks visible
                        </button>

                        <button
                            type="button"
                            onClick={handleCloseTemporarily}
                            className="rounded-2xl border border-slate-700 px-6 py-4 text-center font-bold text-slate-300 transition hover:border-slate-400 hover:text-white"
                        >
                            Decide later
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
}