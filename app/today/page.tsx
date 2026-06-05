"use client";

import { useEffect, useMemo, useState } from "react";
import AppNav from "@/components/AppNav";
import TaskCard from "@/components/TaskCard";
import {
    deleteTask,
    loadProjectPlans,
    updateTaskDetails,
    updateTaskStatus,
} from "@/lib/localStorage";
import { tasks } from "@/lib/mockData";
import type {
    GeneratedProjectPlan,
    PriorityLevel,
    Task,
    TaskStatus,
} from "@/types/coursework";

export default function TodayPage() {
    const [savedPlans, setSavedPlans] = useState<GeneratedProjectPlan[]>([]);
    const [mockTasks, setMockTasks] = useState<Task[]>(tasks);

    useEffect(() => {
        const plans = loadProjectPlans();
        setSavedPlans(plans);
    }, []);

    const hasSavedPlans = savedPlans.length > 0;

    const visibleSavedTasks = useMemo(() => {
        return savedPlans.flatMap((plan) => plan.tasks);
    }, [savedPlans]);

    const activeTasks = useMemo(() => {
        if (hasSavedPlans) {
            return visibleSavedTasks;
        }

        return mockTasks;
    }, [hasSavedPlans, mockTasks, visibleSavedTasks]);

    const todoTasks = activeTasks.filter((task) => task.status === "Todo");
    const doneTasks = activeTasks.filter((task) => task.status === "Done");

    const archivedPlanCount = savedPlans.filter((plan) =>
        Boolean(plan.tasksArchivedAt),
    ).length;

    const completedPlanCount = savedPlans.filter(
        (plan) => plan.project.status === "Completed" || plan.tasksArchivedAt,
    ).length;

    const firstHighPriorityTask = todoTasks.find(
        (task) => task.priority === "High",
    );

    const firstTodoTask = todoTasks[0];

    function handleChangeTaskStatus(taskId: string, nextStatus: TaskStatus) {
        setMockTasks((currentTasks) =>
            currentTasks.map((task) => {
                if (task.id !== taskId) {
                    return task;
                }

                return {
                    ...task,
                    status: nextStatus,
                };
            }),
        );

        const updatedPlans = updateTaskStatus(taskId, nextStatus);
        setSavedPlans(updatedPlans);
    }

    function handleUpdateTaskDetails(
        taskId: string,
        updates: {
            title: string;
            priority: PriorityLevel;
            dueDate: string;
            time: string;
        },
    ) {
        setMockTasks((currentTasks) =>
            currentTasks.map((task) => {
                if (task.id !== taskId) {
                    return task;
                }

                return {
                    ...task,
                    title: updates.title,
                    priority: updates.priority,
                    dueDate: updates.dueDate,
                    time: updates.time,
                };
            }),
        );

        const updatedPlans = updateTaskDetails(taskId, updates);
        setSavedPlans(updatedPlans);
    }

    function handleDeleteTask(taskId: string) {
        setMockTasks((currentTasks) =>
            currentTasks.filter((task) => task.id !== taskId),
        );

        const updatedPlans = deleteTask(taskId);
        setSavedPlans(updatedPlans);
    }

    return (
        <main className="min-h-screen bg-slate-950 text-white">
            <section className="mx-auto max-w-6xl px-4 py-6 sm:px-6 sm:py-8">
                <AppNav />

                <div className="mb-10">
                    <p className="mb-2 text-sm font-bold text-cyan-300">
                        Daily execution
                    </p>
                    <h1 className="text-4xl font-black tracking-tight sm:text-5xl">
                        What should I do today?
                    </h1>
                    <p className="mt-4 max-w-2xl text-slate-300">
                        A focused list of visible tasks from your saved coursework plans.
                        Archived completed tasks stay out of your daily workspace.
                    </p>
                </div>

                <div className="mb-8 grid gap-6 md:grid-cols-4">
                    <div className="rounded-3xl border border-slate-800 bg-slate-900 p-5 sm:p-6">
                        <p className="text-sm text-slate-400">Visible tasks</p>
                        <p className="mt-2 text-3xl font-black sm:text-4xl">
                            {activeTasks.length}
                        </p>
                    </div>

                    <div className="rounded-3xl border border-slate-800 bg-slate-900 p-5 sm:p-6">
                        <p className="text-sm text-slate-400">Todo</p>
                        <p className="mt-2 text-3xl font-black sm:text-4xl">
                            {todoTasks.length}
                        </p>
                    </div>

                    <div className="rounded-3xl border border-emerald-400/30 bg-emerald-400/10 p-5 sm:p-6">
                        <p className="text-sm text-emerald-200">Done</p>
                        <p className="mt-2 text-3xl font-black text-emerald-200 sm:text-4xl">
                            {doneTasks.length}
                        </p>
                    </div>

                    <div className="rounded-3xl border border-cyan-400/30 bg-cyan-400/10 p-5 sm:p-6">
                        <p className="text-sm text-cyan-200">Archived plans</p>
                        <p className="mt-2 text-3xl font-black text-cyan-200 sm:text-4xl">
                            {archivedPlanCount}
                        </p>
                    </div>
                </div>

                {!hasSavedPlans ? (
                    <div className="mb-8 rounded-3xl border border-amber-400/30 bg-amber-400/10 p-6">
                        <p className="mb-2 text-sm font-bold text-amber-300">
                            Demo task mode
                        </p>
                        <h2 className="text-2xl font-black sm:text-3xl">
                            These are sample tasks until you save your first project.
                        </h2>
                        <p className="mt-2 text-sm leading-6 text-slate-300">
                            Create and save a coursework project to replace this demo list
                            with your own generated plan.
                        </p>
                    </div>
                ) : null}

                {hasSavedPlans && visibleSavedTasks.length > 0 ? (
                    <div className="mb-8 rounded-3xl border border-emerald-400/30 bg-emerald-400/10 p-6">
                        <p className="mb-2 text-sm font-bold text-emerald-300">
                            Local tasks loaded
                        </p>
                        <h2 className="text-2xl font-black sm:text-3xl">
                            {visibleSavedTasks.length} visible generated task
                            {visibleSavedTasks.length === 1 ? "" : "s"} found.
                        </h2>
                        <p className="mt-2 text-sm leading-6 text-slate-300">
                            Completed archived tasks are hidden from Today. Your project
                            history still stays available through Projects and Dashboard.
                        </p>
                    </div>
                ) : null}

                {hasSavedPlans && visibleSavedTasks.length === 0 ? (
                    <div className="mb-8 rounded-3xl border border-cyan-400/30 bg-cyan-400/10 p-8">
                        <p className="mb-2 text-sm font-bold text-cyan-300">
                            Today is clean
                        </p>
                        <h2 className="text-2xl font-black sm:text-3xl">
                            No visible tasks right now.
                        </h2>
                        <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-300">
                            Your saved tasks are either completed and archived, or you have
                            not generated a new active project plan yet. Create another
                            coursework plan when the next deadline monster appears.
                        </p>

                        <div className="mt-6 flex flex-col gap-4 sm:flex-row">
                            <a
                                href="/projects/new"
                                className="rounded-2xl bg-cyan-400 px-6 py-4 text-center font-bold text-slate-950 transition hover:bg-cyan-300"
                            >
                                Create new project
                            </a>

                            <a
                                href="/projects"
                                className="rounded-2xl border border-slate-700 px-6 py-4 text-center font-bold text-white transition hover:border-slate-400"
                            >
                                View projects
                            </a>
                        </div>
                    </div>
                ) : null}

                {completedPlanCount > 0 ? (
                    <div className="mb-8 rounded-3xl border border-slate-800 bg-slate-900 p-6">
                        <p className="mb-2 text-sm font-bold text-slate-300">
                            Completed project memory
                        </p>
                        <h2 className="text-2xl font-black sm:text-3xl">
                            {completedPlanCount} completed project
                            {completedPlanCount === 1 ? "" : "s"} recorded locally.
                        </h2>
                        <p className="mt-2 text-sm leading-6 text-slate-300">
                            Completed projects stay visible in Dashboard and Projects even
                            when their finished tasks are archived from Today.
                        </p>
                    </div>
                ) : null}

                <div className="grid gap-6 md:grid-cols-[2fr_1fr]">
                    <div className="space-y-4">
                        {activeTasks.length > 0 ? (
                            activeTasks.map((task) => (
                                <TaskCard
                                    key={task.id}
                                    task={task}
                                    onChangeStatus={handleChangeTaskStatus}
                                    onUpdateTask={handleUpdateTaskDetails}
                                    onDeleteTask={handleDeleteTask}
                                />
                            ))
                        ) : (
                            <div className="rounded-3xl border border-slate-800 bg-slate-900 p-6">
                                <p className="mb-2 text-xl font-bold">No task cards to show.</p>
                                <p className="text-sm leading-6 text-slate-300">
                                    Your Today page is clear. That is rare. Guard it like a tiny
                                    blue flame.
                                </p>
                            </div>
                        )}
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
                                    Your highest-priority visible task is{" "}
                                    <span className="font-bold text-white">
                    {firstHighPriorityTask.title}
                  </span>
                                    . Finish this first before moving to lower-risk work.
                                </p>
                            </>
                        ) : firstTodoTask ? (
                            <>
                                <h2 className="mb-4 text-2xl font-black">
                                    Keep the pressure steady.
                                </h2>
                                <p className="text-sm leading-6 text-slate-300">
                                    Start with{" "}
                                    <span className="font-bold text-white">
                    {firstTodoTask.title}
                  </span>
                                    . No high-priority visible task is currently detected.
                                </p>
                            </>
                        ) : (
                            <>
                                <h2 className="mb-4 text-2xl font-black">
                                    The board is clear.
                                </h2>
                                <p className="text-sm leading-6 text-slate-300">
                                    No visible Todo tasks remain. Review your completed projects
                                    or create a fresh plan when a new assignment arrives.
                                </p>
                            </>
                        )}
                    </aside>
                </div>
            </section>
        </main>
    );
}