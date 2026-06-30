"use client";

import { useState } from "react";
import {
    useCompletedPlanWaitingForPrompt,
    useStoredLanguage,
} from "@/lib/clientStores";
import {
    archiveCompletedProjectTasks,
    keepCompletedProjectTasks,
} from "@/lib/localStorage";

const copy = {
    en: {
        eyebrow: "Project completed",
        title: "Nice work. This project looks complete.",
        descriptionBefore: "All active tasks in",
        descriptionAfter:
            "are marked as done. You can archive the completed tasks to keep the workspace clean, or keep them visible if you still want to review them.",
        completed: "Completed",
        project: "Project",
        status: "Status",
        readyToClean: "Ready to clean",
        note:
            "If you add new work later, archived tasks can be restored automatically so the project progress recalculates correctly.",
        archive: "Archive completed tasks",
        keep: "Keep tasks visible",
        decideLater: "Decide later",
    },
    zh: {
        eyebrow: "项目已完成",
        title: "做得很好。这个项目看起来已经完成了。",
        descriptionBefore: "项目",
        descriptionAfter:
            "中的所有活跃任务都已标记完成。你可以归档已完成任务，让工作区保持清爽；如果还想复查，也可以继续保留它们。",
        completed: "已完成",
        project: "项目",
        status: "状态",
        readyToClean: "可以整理",
        note:
            "如果之后添加新的工作，已归档任务可以在需要时恢复，这样项目进度会重新正确计算。",
        archive: "归档已完成任务",
        keep: "保留任务可见",
        decideLater: "稍后决定",
    },
} as const;

export default function CompletionWatcher() {
    const completedPlan = useCompletedPlanWaitingForPrompt();
    const language = useStoredLanguage();
    const currentCopy = copy[language];
    const [temporarilyClosedPlanId, setTemporarilyClosedPlanId] = useState("");

    function handleArchiveCompletedTasks() {
        if (!completedPlan) {
            return;
        }

        archiveCompletedProjectTasks(completedPlan.id);
        setTemporarilyClosedPlanId("");
    }

    function handleKeepCompletedTasks() {
        if (!completedPlan) {
            return;
        }

        keepCompletedProjectTasks(completedPlan.id);
        setTemporarilyClosedPlanId("");
    }

    function handleCloseTemporarily() {
        setTemporarilyClosedPlanId(completedPlan?.id ?? "");
    }

    if (!completedPlan || temporarilyClosedPlanId === completedPlan.id) {
        return null;
    }

    const completedTaskCount = completedPlan.tasks.filter(
        (task) => task.status === "Done",
    ).length;

    return (
        <section className="cc-modal-overlay cc-motion-fade-in fixed inset-0 z-[80] flex items-center justify-center px-4 py-6 backdrop-blur-md">
            <div className="cc-panel-strong cc-modal-motion relative w-full max-w-2xl overflow-hidden rounded-[2rem] border-emerald-400/30 p-5 sm:p-8">
                <div className="absolute -right-20 -top-20 h-52 w-52 rounded-full bg-emerald-400/20 blur-3xl" />
                <div className="absolute -bottom-24 -left-24 h-56 w-56 rounded-full bg-cyan-400/20 blur-3xl" />

                <div className="relative z-10">
                    <div className="mb-5 inline-flex rounded-full border border-emerald-400/30 bg-emerald-400/10 px-4 py-2 text-xs font-black uppercase tracking-[0.2em] text-emerald-300">
                        {currentCopy.eyebrow}
                    </div>

                    <h2 className="text-3xl font-black tracking-tight sm:text-4xl">
                        {currentCopy.title}
                    </h2>

                    <p className="cc-text-muted mt-4 text-sm leading-6">
                        {currentCopy.descriptionBefore}{" "}
                        <span className="cc-text-main font-bold">
              {completedPlan.project.title}
            </span>{" "}
                        {currentCopy.descriptionAfter}
                    </p>

                    <div className="mt-5 grid gap-4 sm:grid-cols-3">
                        <div className="cc-surface-muted rounded-3xl p-4">
                            <p className="cc-text-subtle text-sm font-bold">
                                {currentCopy.completed}
                            </p>
                            <p className="mt-2 text-3xl font-black text-emerald-300">
                                {completedTaskCount}
                            </p>
                        </div>

                        <div className="cc-surface-muted rounded-3xl p-4">
                            <p className="cc-text-subtle text-sm font-bold">
                                {currentCopy.project}
                            </p>
                            <p className="cc-text-main mt-2 text-lg font-black">
                                {completedPlan.project.title}
                            </p>
                        </div>

                        <div className="cc-surface-muted rounded-3xl p-4">
                            <p className="cc-text-subtle text-sm font-bold">
                                {currentCopy.status}
                            </p>
                            <p className="mt-2 text-lg font-black text-emerald-300">
                                {currentCopy.readyToClean}
                            </p>
                        </div>
                    </div>

                    <div className="mt-6 rounded-3xl border border-cyan-400/30 bg-cyan-400/10 p-4">
                        <p className="text-sm font-bold leading-6 text-cyan-200">
                            {currentCopy.note}
                        </p>
                    </div>

                    <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                        <button
                            type="button"
                            onClick={handleArchiveCompletedTasks}
                            className="cc-interactive-button rounded-2xl bg-emerald-400 px-6 py-4 text-center font-bold text-slate-950 transition hover:bg-emerald-300"
                        >
                            {currentCopy.archive}
                        </button>

                        <button
                            type="button"
                            onClick={handleKeepCompletedTasks}
                            className="cc-button-secondary rounded-2xl px-6 py-4 text-center hover:border-emerald-400 hover:text-emerald-300"
                        >
                            {currentCopy.keep}
                        </button>

                        <button
                            type="button"
                            onClick={handleCloseTemporarily}
                            className="cc-button-secondary rounded-2xl px-6 py-4 text-center"
                        >
                            {currentCopy.decideLater}
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
}
