"use client";

import { useEffect, useMemo, useState } from "react";
import AppNav from "@/components/AppNav";
import TaskCard from "@/components/TaskCard";
import { loadProjectPlans } from "@/lib/localStorage";
import { tasks } from "@/lib/mockData";
import type { GeneratedProjectPlan } from "@/types/coursework";

export default function TodayPage() {
    const [savedPlans, setSavedPlans] = useState<GeneratedProjectPlan[]>([]);

    useEffect(() => {
        const plans = loadProjectPlans();
        setSavedPlans(plans);
    }, []);

    const savedTasks = useMemo(() => {
        return savedPlans.flatMap((plan) => plan.tasks);
    }, [savedPlans]);

    const allTasks = useMemo(() => {
        const savedTaskIds = new Set(savedTasks.map((task) => task.id));

        const mockTasksWithoutDuplicates = tasks.filter(
            (task) => !savedTaskIds.has(task.id),
        );

        return [...savedTasks, ...mockTasksWithoutDuplicates];
    }, [savedTasks]);

    const highPriorityTaskCount = allTasks.filter(
        (task) => task.priority === "High",
    ).length;

    const firstHighPriorityTask = allTasks.find(
        (task) => task.priority === "High",
    );

    return (
        <main className="min-h-screen bg-slate-950 text-white">
            <section className="mx-auto max-w-6xl px-6 py-8">
                <AppNav />

                <div className="mb-10">
                    <p className="mb-2 text-sm font-bold text-cyan-300">
                        Daily execution
                    </p>
                    <h1 className="text-5xl font-black tracking-tight">
                        What should I do today?
                    </h1>
                    <p className="mt-4 max-w-2xl text-slate-300">
                        A focused list of tasks chosen from your saved projects, deadlines,
                        project risks, and current progress.
                    </p>
                </div>

                <div className="mb-8 grid gap-6 md:grid-cols-3">
                    <div className="rounded-3xl border border-slate-800 bg-slate-900 p-6">
                        <p className="text-sm text-slate-400">Tasks available</p>
                        <p className="mt-2 text-4xl font-black">{allTasks.length}</p>
                    </div>

                    <div className="rounded-3xl border border-slate-800 bg-slate-900 p-6">
                        <p className="text-sm text-slate-400">Saved plans</p>
                        <p className="mt-2 text-4xl font-black">{savedPlans.length}</p>
                    </div>

                    <div className="rounded-3xl border border-red-400/30 bg-red-400/10 p-6">
                        <p className="text-sm text-red-200">High priority tasks</p>
                        <p className="mt-2 text-4xl font-black text-red-200">
                            {highPriorityTaskCount}
                        </p>
                    </div>
                </div>

                {savedTasks.length > 0 ? (
                    <div className="mb-8 rounded-3xl border border-emerald-400/30 bg-emerald-400/10 p-6">
                        <p className="mb-2 text-sm font-bold text-emerald-300">
                            Local tasks loaded
                        </p>
                        <h2 className="text-2xl font-black">
                            {savedTasks.length} generated task
                            {savedTasks.length === 1 ? "" : "s"} found in this browser.
                        </h2>
                        <p className="mt-2 text-sm leading-6 text-slate-300">
                            These tasks came from your locally saved project plans. Later,
                            they will sync through user accounts.
                        </p>
                    </div>
                ) : null}

                <div className="grid gap-6 md:grid-cols-[2fr_1fr]">
                    <div className="space-y-4">
                        {allTasks.map((task) => (
                            <TaskCard key={task.id} task={task} />
                        ))}
                    </div>

                    <aside className="rounded-3xl border border-cyan-400/30 bg-cyan-400/10 p-6">
                        <p className="mb-2 text-sm font-bold text-cyan-300">
                            Today&apos;s strategy
                        </p>

                        {firstHighPriorityTask ? (
                            <>
                                <h2 className="mb-4 text-2xl font-black">
                                    Start with {firstHighPriorityTask.project}.
                                </h2>
                                <p className="text-sm leading-6 text-slate-300">
                                    Your highest-priority task is{" "}
                                    <span className="font-bold text-white">
                    {firstHighPriorityTask.title}
                  </span>
                                    . Finish this first before moving to lower-risk tasks.
                                </p>
                            </>
                        ) : (
                            <>
                                <h2 className="mb-4 text-2xl font-black">
                                    Keep steady pressure.
                                </h2>
                                <p className="text-sm leading-6 text-slate-300">
                                    No high-priority tasks are currently detected. Use this time
                                    to make calm, consistent progress before deadlines get teeth.
                                </p>
                            </>
                        )}
                    </aside>
                </div>
            </section>
        </main>
    );
}