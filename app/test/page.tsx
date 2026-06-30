"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import FeedbackPanel from "@/components/FeedbackPanel";

type TutorialStep = 0 | 1 | 2 | 3 | 4;

type PriorityLevel = "Low" | "Medium" | "High";

type DemoTask = {
    id: string;
    title: string;
    priority: PriorityLevel;
    time: string;
    status: "Todo" | "Done";
};

const sampleProjects = [
    {
        id: "biology-ia",
        name: "Sample Biology IA",
        template: "Biology IA",
        deadline: "3 to 4 weeks from today",
        intensity: "Balanced",
        description:
            "Good for testing science coursework planning, data collection, analysis, and evaluation tasks.",
    },
    {
        id: "math-ia",
        name: "Sample Math IA",
        template: "Math IA",
        deadline: "Around one month from today",
        intensity: "Balanced",
        description:
            "Good for testing research question planning, exploration structure, data, graphs, and reflection.",
    },
    {
        id: "extended-essay",
        name: "Sample Extended Essay",
        template: "Extended Essay",
        deadline: "6 to 8 weeks from today",
        intensity: "Light or Balanced",
        description:
            "Good for testing long-term planning, research stages, source tracking, drafting, and revision.",
    },
];

const initialDemoTasks: DemoTask[] = [
    {
        id: "task-1",
        title: "Refine the research question",
        priority: "High",
        time: "45 min",
        status: "Todo",
    },
    {
        id: "task-2",
        title: "Create a short evidence or data collection plan",
        priority: "Medium",
        time: "1 hour",
        status: "Todo",
    },
    {
        id: "task-3",
        title: "Draft the first analysis paragraph",
        priority: "Medium",
        time: "1.5 hours",
        status: "Todo",
    },
];

const loadingMessages = [
    "Sorting coursework chaos into tiny boxes...",
    "Checking whether the deadline monster has been weakened...",
    "Sharpening the task list...",
    "Preparing the feedback portal...",
    "Polishing the student testing route...",
    "Almost there...",
];

const priorityOptions: PriorityLevel[] = ["Low", "Medium", "High"];

function getPriorityClasses(priority: DemoTask["priority"]) {
    if (priority === "High") {
        return "border-red-400/30 bg-red-400/10 text-red-300";
    }

    if (priority === "Medium") {
        return "border-amber-400/30 bg-amber-400/10 text-amber-300";
    }

    return "border-emerald-400/30 bg-emerald-400/10 text-emerald-300";
}

function getStepLabel(step: TutorialStep) {
    if (step === 0) {
        return "Choose sample";
    }

    if (step === 1) {
        return "Try planner";
    }

    if (step === 2) {
        return "Review";
    }

    if (step === 3) {
        return "Feedback";
    }

    return "Complete";
}

function isPriorityLevel(value: string): value is PriorityLevel {
    return value === "Low" || value === "Medium" || value === "High";
}

export default function StudentTestingPage() {
    const [step, setStep] = useState<TutorialStep>(0);
    const [selectedProjectId, setSelectedProjectId] = useState(
        sampleProjects[0].id,
    );
    const [demoTasks, setDemoTasks] = useState<DemoTask[]>(initialDemoTasks);

    const [hasMarkedDone, setHasMarkedDone] = useState(false);
    const [hasAddedTask, setHasAddedTask] = useState(false);
    const [hasEditedTask, setHasEditedTask] = useState(false);
    const [hasDeletedTask, setHasDeletedTask] = useState(false);

    const [newTaskTitle, setNewTaskTitle] = useState("");
    const [newTaskPriority, setNewTaskPriority] =
        useState<PriorityLevel>("Medium");
    const [newTaskTime, setNewTaskTime] = useState("30 min");
    const [newTaskError, setNewTaskError] = useState("");

    const [editingTaskId, setEditingTaskId] = useState("");
    const [editTitle, setEditTitle] = useState("");
    const [editPriority, setEditPriority] = useState<PriorityLevel>("Medium");
    const [editTime, setEditTime] = useState("");
    const [editError, setEditError] = useState("");

    const [deleteCandidateId, setDeleteCandidateId] = useState("");

    const [loadingProgress, setLoadingProgress] = useState(0);
    const [loadingMessageIndex, setLoadingMessageIndex] = useState(0);
    const [showFeedback, setShowFeedback] = useState(false);

    const selectedProject = useMemo(() => {
        return (
            sampleProjects.find((project) => project.id === selectedProjectId) ??
            sampleProjects[0]
        );
    }, [selectedProjectId]);

    const completedActions = [
        hasMarkedDone,
        hasAddedTask,
        hasEditedTask,
        hasDeletedTask,
    ].filter(Boolean).length;

    const tutorialProgress = Math.round((completedActions / 4) * 100);

    useEffect(() => {
        if (step !== 3 || showFeedback) {
            return;
        }

        const progressTimer = window.setInterval(() => {
            setLoadingProgress((currentProgress) => {
                if (currentProgress >= 100) {
                    window.clearInterval(progressTimer);
                    return 100;
                }

                return Math.min(currentProgress + 4, 100);
            });
        }, 90);

        const messageTimer = window.setInterval(() => {
            setLoadingMessageIndex((currentIndex) => {
                return (currentIndex + 1) % loadingMessages.length;
            });
        }, 900);

        return () => {
            window.clearInterval(progressTimer);
            window.clearInterval(messageTimer);
        };
    }, [showFeedback, step]);

    useEffect(() => {
        if (step !== 3 || loadingProgress < 100) {
            return;
        }

        const revealTimer = window.setTimeout(() => {
            setShowFeedback(true);
        }, 450);

        return () => {
            window.clearTimeout(revealTimer);
        };
    }, [loadingProgress, step]);

    function handleToggleTaskStatus(taskId: string) {
        setDemoTasks((currentTasks) =>
            currentTasks.map((task) => {
                if (task.id !== taskId) {
                    return task;
                }

                const nextStatus = task.status === "Done" ? "Todo" : "Done";

                if (nextStatus === "Done") {
                    setHasMarkedDone(true);
                }

                return {
                    ...task,
                    status: nextStatus,
                };
            }),
        );
    }

    function handleAddTask() {
        const trimmedTitle = newTaskTitle.trim();
        const trimmedTime = newTaskTime.trim() || "30 min";

        if (!trimmedTitle) {
            setNewTaskError("Please type a task title first.");
            return;
        }

        setDemoTasks((currentTasks) => [
            ...currentTasks,
            {
                id: `custom-${Date.now().toString(36)}`,
                title: trimmedTitle,
                priority: newTaskPriority,
                time: trimmedTime,
                status: "Todo",
            },
        ]);

        setNewTaskTitle("");
        setNewTaskPriority("Medium");
        setNewTaskTime("30 min");
        setNewTaskError("");
        setHasAddedTask(true);
    }

    function handleStartEdit(task: DemoTask) {
        setEditingTaskId(task.id);
        setEditTitle(task.title);
        setEditPriority(task.priority);
        setEditTime(task.time);
        setEditError("");
        setDeleteCandidateId("");
    }

    function handleCancelEdit() {
        setEditingTaskId("");
        setEditTitle("");
        setEditPriority("Medium");
        setEditTime("");
        setEditError("");
    }

    function handleSaveEdit(taskId: string) {
        const trimmedTitle = editTitle.trim();
        const trimmedTime = editTime.trim() || "30 min";

        if (!trimmedTitle) {
            setEditError("Please type a task title before saving.");
            return;
        }

        setDemoTasks((currentTasks) =>
            currentTasks.map((task) => {
                if (task.id !== taskId) {
                    return task;
                }

                return {
                    ...task,
                    title: trimmedTitle,
                    priority: editPriority,
                    time: trimmedTime,
                };
            }),
        );

        setHasEditedTask(true);
        handleCancelEdit();
    }

    function handleAskDelete(taskId: string) {
        setDeleteCandidateId(taskId);
        setEditingTaskId("");
    }

    function handleConfirmDelete(taskId: string) {
        setDemoTasks((currentTasks) =>
            currentTasks.filter((task) => task.id !== taskId),
        );

        setDeleteCandidateId("");
        setHasDeletedTask(true);
    }

    function handleResetTutorial() {
        setStep(0);
        setSelectedProjectId(sampleProjects[0].id);
        setDemoTasks(initialDemoTasks);
        setHasMarkedDone(false);
        setHasAddedTask(false);
        setHasEditedTask(false);
        setHasDeletedTask(false);
        setNewTaskTitle("");
        setNewTaskPriority("Medium");
        setNewTaskTime("30 min");
        setNewTaskError("");
        handleCancelEdit();
        setDeleteCandidateId("");
        setLoadingProgress(0);
        setLoadingMessageIndex(0);
        setShowFeedback(false);
    }

    function handleStartFeedbackStep() {
        setLoadingProgress(0);
        setLoadingMessageIndex(0);
        setShowFeedback(false);
        setStep(3);
    }

    return (
        <main className="min-h-screen overflow-hidden bg-slate-950 text-white">
            <section className="mx-auto max-w-6xl px-4 py-6 sm:px-6 sm:py-8">
                <header className="mb-10 flex flex-col gap-5 rounded-[2rem] border border-slate-800 bg-slate-900/70 p-5 shadow-2xl shadow-cyan-950/20 sm:p-6 md:flex-row md:items-center md:justify-between">
                    <div>
                        <p className="mb-2 text-sm font-bold text-cyan-300">
                            Coursework Compass Tutorial
                        </p>
                        <h1 className="text-3xl font-black tracking-tight sm:text-4xl">
                            Guided student testing flow.
                        </h1>
                        <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-300">
                            This tutorial is separate from the real app. It uses simulated
                            tasks, so students can learn the workflow without changing real
                            project data.
                        </p>
                    </div>

                    <Link
                        href="/"
                        className="w-fit rounded-2xl border border-slate-700 px-5 py-3 text-sm font-bold text-white transition hover:border-cyan-400 hover:text-cyan-300"
                    >
                        Main site
                    </Link>
                </header>

                <section className="mb-8 rounded-[2rem] border border-cyan-400/30 bg-cyan-400/10 p-5 sm:p-6">
                    <div className="mb-5 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                        <div>
                            <p className="mb-2 text-sm font-bold text-cyan-300">
                                Tutorial progress
                            </p>
                            <h2 className="text-2xl font-black sm:text-3xl">
                                {getStepLabel(step)}
                            </h2>
                        </div>

                        <div className="rounded-full border border-cyan-400/30 bg-slate-950/70 px-4 py-2 text-xs font-black uppercase tracking-[0.2em] text-cyan-300">
                            v1.2
                        </div>
                    </div>

                    <div className="grid gap-3 md:grid-cols-5">
                        {(
                            [
                                "Choose sample",
                                "Try planner",
                                "Review",
                                "Feedback",
                                "Complete",
                            ] as const
                        ).map((label, index) => {
                            const isActive = index === step;
                            const isComplete = index < step;

                            return (
                                <div
                                    key={label}
                                    className={`rounded-2xl border p-4 ${
                                        isActive
                                            ? "border-cyan-300 bg-cyan-400 text-slate-950"
                                            : isComplete
                                                ? "border-emerald-400/30 bg-emerald-400/10 text-emerald-300"
                                                : "border-slate-800 bg-slate-950/70 text-slate-400"
                                    }`}
                                >
                                    <p className="mb-1 text-xs font-black uppercase tracking-[0.2em]">
                                        Step {index + 1}
                                    </p>
                                    <p className="text-sm font-bold">{label}</p>
                                </div>
                            );
                        })}
                    </div>
                </section>

                {step === 0 ? (
                    <section className="rounded-[2rem] border border-slate-800 bg-slate-900 p-5 sm:p-8">
                        <p className="mb-2 text-sm font-bold text-emerald-300">Step 1</p>
                        <h2 className="text-3xl font-black tracking-tight sm:text-4xl">
                            Choose a sample project.
                        </h2>
                        <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-300">
                            Pick one sample project to use for the tutorial. This does not
                            create a real project and does not save anything to the browser.
                        </p>

                        <div className="mt-6 grid gap-4 md:grid-cols-3">
                            {sampleProjects.map((project) => {
                                const isSelected = selectedProjectId === project.id;

                                return (
                                    <button
                                        key={project.id}
                                        type="button"
                                        onClick={() => setSelectedProjectId(project.id)}
                                        className={`rounded-[2rem] border p-5 text-left transition ${
                                            isSelected
                                                ? "border-emerald-300 bg-emerald-400 text-slate-950"
                                                : "border-slate-800 bg-slate-950/70 text-slate-300 hover:border-emerald-400 hover:text-emerald-300"
                                        }`}
                                    >
                                        <h3 className="text-xl font-black">{project.name}</h3>
                                        <div className="mt-4 space-y-2 text-sm leading-6">
                                            <p>
                                                <span className="font-bold">Template:</span>{" "}
                                                {project.template}
                                            </p>
                                            <p>
                                                <span className="font-bold">Deadline:</span>{" "}
                                                {project.deadline}
                                            </p>
                                            <p>
                                                <span className="font-bold">Intensity:</span>{" "}
                                                {project.intensity}
                                            </p>
                                        </div>
                                        <p className="mt-4 text-sm leading-6">
                                            {project.description}
                                        </p>
                                    </button>
                                );
                            })}
                        </div>

                        <div className="mt-8 flex flex-col gap-4 sm:flex-row">
                            <button
                                type="button"
                                onClick={() => setStep(1)}
                                className="rounded-2xl bg-emerald-400 px-6 py-4 font-bold text-slate-950 transition hover:bg-emerald-300"
                            >
                                Continue to planner tutorial
                            </button>

                            <button
                                type="button"
                                onClick={handleResetTutorial}
                                className="rounded-2xl border border-slate-700 px-6 py-4 font-bold text-white transition hover:border-slate-400"
                            >
                                Reset tutorial
                            </button>
                        </div>
                    </section>
                ) : null}

                {step === 1 ? (
                    <section className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
                        <div className="rounded-[2rem] border border-slate-800 bg-slate-900 p-5 sm:p-6">
                            <p className="mb-2 text-sm font-bold text-cyan-300">Step 2</p>
                            <h2 className="text-3xl font-black tracking-tight">
                                Try the planner controls yourself.
                            </h2>
                            <p className="mt-3 text-sm leading-6 text-slate-300">
                                This is a simulated project board for{" "}
                                <span className="font-bold text-white">
                  {selectedProject.name}
                </span>
                                . You need to interact with the cards and form yourself. This
                                does not affect real saved data.
                            </p>

                            <div className="mt-6 rounded-3xl border border-cyan-400/30 bg-cyan-400/10 p-4">
                                <div className="mb-3 flex items-center justify-between">
                                    <p className="font-bold text-white">{selectedProject.name}</p>
                                    <span className="rounded-full border border-cyan-400/30 bg-slate-950/70 px-3 py-1 text-xs font-bold text-cyan-300">
                    Tutorial project
                  </span>
                                </div>

                                <div className="h-3 overflow-hidden rounded-full bg-slate-800">
                                    <div
                                        className="h-full rounded-full bg-cyan-400 transition-all"
                                        style={{ width: `${tutorialProgress}%` }}
                                    />
                                </div>

                                <p className="mt-2 text-xs text-slate-400">
                                    Tutorial actions completed: {completedActions}/4
                                </p>
                            </div>

                            <div className="mt-5 space-y-4">
                                {demoTasks.map((task) => {
                                    const isEditing = editingTaskId === task.id;
                                    const isConfirmingDelete = deleteCandidateId === task.id;

                                    return (
                                        <div
                                            key={task.id}
                                            className={`rounded-3xl border p-4 ${
                                                task.status === "Done"
                                                    ? "border-emerald-400/30 bg-emerald-400/10"
                                                    : "border-slate-800 bg-slate-950/70"
                                            }`}
                                        >
                                            {isEditing ? (
                                                <div>
                                                    <p className="mb-3 text-sm font-bold text-cyan-300">
                                                        Edit this task
                                                    </p>

                                                    <div className="grid gap-3 md:grid-cols-[1.2fr_0.7fr_0.7fr]">
                                                        <div>
                                                            <label className="mb-2 block text-xs font-bold text-slate-300">
                                                                Task title
                                                            </label>
                                                            <input
                                                                type="text"
                                                                value={editTitle}
                                                                onChange={(event) => {
                                                                    setEditTitle(event.target.value);
                                                                    setEditError("");
                                                                }}
                                                                className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm font-bold text-white outline-none transition focus:border-cyan-300"
                                                            />
                                                        </div>

                                                        <div>
                                                            <label className="mb-2 block text-xs font-bold text-slate-300">
                                                                Priority
                                                            </label>
                                                            <select
                                                                value={editPriority}
                                                                onChange={(event) => {
                                                                    if (!isPriorityLevel(event.target.value)) {
                                                                        return;
                                                                    }

                                                                    setEditPriority(event.target.value);
                                                                }}
                                                                className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm font-bold text-white outline-none transition focus:border-cyan-300"
                                                            >
                                                                {priorityOptions.map((priority) => (
                                                                    <option key={priority} value={priority}>
                                                                        {priority}
                                                                    </option>
                                                                ))}
                                                            </select>
                                                        </div>

                                                        <div>
                                                            <label className="mb-2 block text-xs font-bold text-slate-300">
                                                                Time
                                                            </label>
                                                            <input
                                                                type="text"
                                                                value={editTime}
                                                                onChange={(event) => {
                                                                    setEditTime(event.target.value);
                                                                    setEditError("");
                                                                }}
                                                                className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm font-bold text-white outline-none transition focus:border-cyan-300"
                                                            />
                                                        </div>
                                                    </div>

                                                    {editError ? (
                                                        <div className="mt-3 rounded-2xl border border-red-400/30 bg-red-400/10 p-3 text-sm font-bold text-red-300">
                                                            {editError}
                                                        </div>
                                                    ) : null}

                                                    <div className="mt-4 flex flex-col gap-3 sm:flex-row">
                                                        <button
                                                            type="button"
                                                            onClick={() => handleSaveEdit(task.id)}
                                                            className="rounded-xl bg-cyan-400 px-4 py-3 text-sm font-bold text-slate-950 transition hover:bg-cyan-300"
                                                        >
                                                            Save edit
                                                        </button>

                                                        <button
                                                            type="button"
                                                            onClick={handleCancelEdit}
                                                            className="rounded-xl border border-slate-700 px-4 py-3 text-sm font-bold text-white transition hover:border-slate-400"
                                                        >
                                                            Cancel
                                                        </button>
                                                    </div>
                                                </div>
                                            ) : (
                                                <div>
                                                    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                                                        <div>
                                                            <h3
                                                                className={`text-lg font-black ${
                                                                    task.status === "Done"
                                                                        ? "text-emerald-200 line-through"
                                                                        : "text-white"
                                                                }`}
                                                            >
                                                                {task.title}
                                                            </h3>
                                                            <p className="mt-1 text-sm text-slate-400">
                                                                Estimated time: {task.time}
                                                            </p>
                                                        </div>

                                                        <div
                                                            className={`w-fit rounded-full border px-3 py-1 text-xs font-bold ${getPriorityClasses(
                                                                task.priority,
                                                            )}`}
                                                        >
                                                            {task.status === "Done" ? "Done" : task.priority}
                                                        </div>
                                                    </div>

                                                    <div className="mt-4 flex flex-col gap-3 sm:flex-row">
                                                        <button
                                                            type="button"
                                                            onClick={() => handleToggleTaskStatus(task.id)}
                                                            className={`rounded-xl px-4 py-3 text-sm font-bold transition ${
                                                                task.status === "Done"
                                                                    ? "border border-emerald-400/30 bg-emerald-400/10 text-emerald-200 hover:bg-emerald-400/20"
                                                                    : "bg-cyan-400 text-slate-950 hover:bg-cyan-300"
                                                            }`}
                                                        >
                                                            {task.status === "Done"
                                                                ? "Mark as todo"
                                                                : "Mark done"}
                                                        </button>

                                                        <button
                                                            type="button"
                                                            onClick={() => handleStartEdit(task)}
                                                            className="rounded-xl border border-slate-700 px-4 py-3 text-sm font-bold text-white transition hover:border-cyan-400 hover:text-cyan-300"
                                                        >
                                                            Edit
                                                        </button>

                                                        <button
                                                            type="button"
                                                            onClick={() => handleAskDelete(task.id)}
                                                            className="rounded-xl border border-red-400/30 px-4 py-3 text-sm font-bold text-red-300 transition hover:bg-red-400/10"
                                                        >
                                                            Delete
                                                        </button>
                                                    </div>

                                                    {isConfirmingDelete ? (
                                                        <div className="mt-4 rounded-2xl border border-red-400/30 bg-red-400/10 p-4">
                                                            <p className="text-sm font-bold text-red-300">
                                                                Delete this tutorial task?
                                                            </p>

                                                            <div className="mt-3 flex flex-col gap-3 sm:flex-row">
                                                                <button
                                                                    type="button"
                                                                    onClick={() => handleConfirmDelete(task.id)}
                                                                    className="rounded-xl bg-red-400 px-4 py-3 text-sm font-bold text-slate-950 transition hover:bg-red-300"
                                                                >
                                                                    Confirm delete
                                                                </button>

                                                                <button
                                                                    type="button"
                                                                    onClick={() => setDeleteCandidateId("")}
                                                                    className="rounded-xl border border-slate-700 px-4 py-3 text-sm font-bold text-white transition hover:border-slate-400"
                                                                >
                                                                    Cancel
                                                                </button>
                                                            </div>
                                                        </div>
                                                    ) : null}
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        <aside className="space-y-5">
                            <div className="rounded-[2rem] border border-emerald-400/30 bg-emerald-400/10 p-5 sm:p-6">
                                <p className="mb-2 text-sm font-bold text-emerald-300">
                                    Add a custom task
                                </p>
                                <h2 className="text-2xl font-black">
                                    Type your own task.
                                </h2>

                                <div className="mt-5 space-y-4">
                                    <div>
                                        <label className="mb-2 block text-xs font-bold text-slate-300">
                                            Task title
                                        </label>
                                        <input
                                            type="text"
                                            value={newTaskTitle}
                                            onChange={(event) => {
                                                setNewTaskTitle(event.target.value);
                                                setNewTaskError("");
                                            }}
                                            placeholder="e.g. Ask teacher for feedback"
                                            className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm font-bold text-white outline-none transition placeholder:text-slate-500 focus:border-emerald-300"
                                        />
                                    </div>

                                    <div>
                                        <label className="mb-2 block text-xs font-bold text-slate-300">
                                            Priority
                                        </label>
                                        <select
                                            value={newTaskPriority}
                                            onChange={(event) => {
                                                if (!isPriorityLevel(event.target.value)) {
                                                    return;
                                                }

                                                setNewTaskPriority(event.target.value);
                                            }}
                                            className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm font-bold text-white outline-none transition focus:border-emerald-300"
                                        >
                                            {priorityOptions.map((priority) => (
                                                <option key={priority} value={priority}>
                                                    {priority}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    <div>
                                        <label className="mb-2 block text-xs font-bold text-slate-300">
                                            Estimated time
                                        </label>
                                        <input
                                            type="text"
                                            value={newTaskTime}
                                            onChange={(event) => setNewTaskTime(event.target.value)}
                                            className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm font-bold text-white outline-none transition focus:border-emerald-300"
                                        />
                                    </div>
                                </div>

                                {newTaskError ? (
                                    <div className="mt-4 rounded-2xl border border-red-400/30 bg-red-400/10 p-3 text-sm font-bold text-red-300">
                                        {newTaskError}
                                    </div>
                                ) : null}

                                <button
                                    type="button"
                                    onClick={handleAddTask}
                                    className="mt-5 w-full rounded-2xl bg-emerald-400 px-6 py-4 font-bold text-slate-950 transition hover:bg-emerald-300"
                                >
                                    Add this task
                                </button>
                            </div>

                            <div className="rounded-[2rem] border border-cyan-400/30 bg-cyan-400/10 p-5 sm:p-6">
                                <p className="mb-2 text-sm font-bold text-cyan-300">
                                    Action checklist
                                </p>
                                <h2 className="text-2xl font-black">
                                    Complete these four real interactions.
                                </h2>

                                <div className="mt-5 space-y-3 text-sm font-bold">
                                    <div
                                        className={`rounded-2xl border p-3 ${
                                            hasMarkedDone
                                                ? "border-emerald-400/30 bg-emerald-400/10 text-emerald-300"
                                                : "border-slate-800 bg-slate-950/70 text-slate-400"
                                        }`}
                                    >
                                        {hasMarkedDone ? "✓ " : ""}Mark a task as done
                                    </div>

                                    <div
                                        className={`rounded-2xl border p-3 ${
                                            hasAddedTask
                                                ? "border-emerald-400/30 bg-emerald-400/10 text-emerald-300"
                                                : "border-slate-800 bg-slate-950/70 text-slate-400"
                                        }`}
                                    >
                                        {hasAddedTask ? "✓ " : ""}Add your own task using the form
                                    </div>

                                    <div
                                        className={`rounded-2xl border p-3 ${
                                            hasEditedTask
                                                ? "border-emerald-400/30 bg-emerald-400/10 text-emerald-300"
                                                : "border-slate-800 bg-slate-950/70 text-slate-400"
                                        }`}
                                    >
                                        {hasEditedTask ? "✓ " : ""}Open Edit and save a change
                                    </div>

                                    <div
                                        className={`rounded-2xl border p-3 ${
                                            hasDeletedTask
                                                ? "border-emerald-400/30 bg-emerald-400/10 text-emerald-300"
                                                : "border-slate-800 bg-slate-950/70 text-slate-400"
                                        }`}
                                    >
                                        {hasDeletedTask ? "✓ " : ""}Delete a task with confirmation
                                    </div>
                                </div>

                                <button
                                    type="button"
                                    onClick={() => setStep(2)}
                                    disabled={completedActions < 4}
                                    className={`mt-6 w-full rounded-2xl px-6 py-4 font-bold transition ${
                                        completedActions >= 4
                                            ? "bg-cyan-400 text-slate-950 hover:bg-cyan-300"
                                            : "cursor-not-allowed bg-slate-800 text-slate-500"
                                    }`}
                                >
                                    Continue to review
                                </button>

                                <p className="mt-3 text-xs leading-5 text-slate-400">
                                    The continue button unlocks only after the student actually
                                    uses the tutorial controls.
                                </p>
                            </div>
                        </aside>
                    </section>
                ) : null}

                {step === 2 ? (
                    <section className="rounded-[2rem] border border-slate-800 bg-slate-900 p-5 sm:p-8">
                        <p className="mb-2 text-sm font-bold text-fuchsia-300">Step 3</p>
                        <h2 className="text-3xl font-black tracking-tight sm:text-4xl">
                            Review what you tested.
                        </h2>
                        <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-300">
                            You have now walked through the core planner ideas in a safe
                            tutorial space. Before sending feedback, think about what felt
                            useful, confusing, missing, or unrealistic.
                        </p>

                        <div className="mt-6 grid gap-4 md:grid-cols-2">
                            <div className="rounded-3xl border border-slate-800 bg-slate-950/70 p-5">
                                <p className="mb-2 text-sm font-bold text-emerald-300">
                                    Completed tutorial actions
                                </p>
                                <div className="space-y-2 text-sm leading-6 text-slate-300">
                                    <p>• Chose a sample project</p>
                                    <p>• Marked a task as done</p>
                                    <p>• Added a custom task by typing it yourself</p>
                                    <p>• Edited a task using the edit form</p>
                                    <p>• Deleted a task with confirmation</p>
                                </div>
                            </div>

                            <div className="rounded-3xl border border-slate-800 bg-slate-950/70 p-5">
                                <p className="mb-2 text-sm font-bold text-fuchsia-300">
                                    Feedback ideas
                                </p>
                                <div className="space-y-2 text-sm leading-6 text-slate-300">
                                    <p>• Was the workflow easy to understand?</p>
                                    <p>• Did the edit form feel natural?</p>
                                    <p>• Was adding a custom task clear?</p>
                                    <p>• Was delete confirmation useful?</p>
                                    <p>• Would you return to this website?</p>
                                </div>
                            </div>
                        </div>

                        <div className="mt-8 flex flex-col gap-4 sm:flex-row">
                            <button
                                type="button"
                                onClick={handleStartFeedbackStep}
                                className="rounded-2xl bg-fuchsia-400 px-6 py-4 font-bold text-slate-950 transition hover:bg-fuchsia-300"
                            >
                                Prepare feedback form
                            </button>

                            <button
                                type="button"
                                onClick={() => setStep(1)}
                                className="rounded-2xl border border-slate-700 px-6 py-4 font-bold text-white transition hover:border-slate-400"
                            >
                                Back to planner tutorial
                            </button>
                        </div>
                    </section>
                ) : null}

                {step === 3 ? (
                    <section className="rounded-[2rem] border border-fuchsia-400/30 bg-fuchsia-400/10 p-5 sm:p-8">
                        {!showFeedback ? (
                            <div>
                                <p className="mb-2 text-sm font-bold text-fuchsia-300">
                                    Preparing feedback
                                </p>
                                <h2 className="text-3xl font-black tracking-tight sm:text-4xl">
                                    Building your feedback portal.
                                </h2>
                                <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-300">
                                    {loadingMessages[loadingMessageIndex]}
                                </p>

                                <div className="mt-8">
                                    <div className="mb-3 flex items-center justify-between">
                                        <p className="text-sm font-bold text-slate-300">
                                            Loading progress
                                        </p>
                                        <p className="text-sm font-black text-fuchsia-300">
                                            {loadingProgress}%
                                        </p>
                                    </div>

                                    <div className="h-4 overflow-hidden rounded-full bg-slate-900">
                                        <div
                                            className="h-full rounded-full bg-fuchsia-400 transition-all duration-100"
                                            style={{ width: `${loadingProgress}%` }}
                                        />
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div>
                                <div className="mb-8">
                                    <p className="mb-2 text-sm font-bold text-fuchsia-300">
                                        Final step
                                    </p>
                                    <h2 className="text-3xl font-black tracking-tight sm:text-4xl">
                                        Send your feedback.
                                    </h2>
                                    <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-300">
                                        Short feedback is enough. One clear sentence can help shape
                                        the next version of Coursework Compass.
                                    </p>
                                </div>

                                <FeedbackPanel />

                                <div className="mt-6 flex flex-col gap-4 sm:flex-row">
                                    <button
                                        type="button"
                                        onClick={() => setStep(4)}
                                        className="rounded-2xl bg-emerald-400 px-6 py-4 font-bold text-slate-950 transition hover:bg-emerald-300"
                                    >
                                        I finished the test
                                    </button>

                                    <button
                                        type="button"
                                        onClick={handleResetTutorial}
                                        className="rounded-2xl border border-slate-700 px-6 py-4 font-bold text-white transition hover:border-slate-400"
                                    >
                                        Restart tutorial
                                    </button>
                                </div>
                            </div>
                        )}
                    </section>
                ) : null}

                {step === 4 ? (
                    <section className="relative overflow-hidden rounded-[2rem] border border-emerald-400/30 bg-emerald-400/10 p-6 shadow-2xl shadow-emerald-950/30 sm:p-10">
                        <div className="absolute -left-16 -top-16 h-40 w-40 rounded-full bg-cyan-400/20 blur-3xl" />
                        <div className="absolute -bottom-16 -right-16 h-48 w-48 rounded-full bg-fuchsia-400/20 blur-3xl" />
                        <div className="absolute right-10 top-10 h-4 w-4 animate-ping rounded-full bg-emerald-300" />
                        <div className="absolute bottom-12 left-12 h-3 w-3 animate-pulse rounded-full bg-cyan-300" />

                        <div className="relative z-10">
                            <div className="mb-6 inline-flex rounded-full border border-emerald-400/30 bg-slate-950/70 px-4 py-2 text-xs font-black uppercase tracking-[0.2em] text-emerald-300">
                                Tutorial complete
                            </div>

                            <h2 className="max-w-4xl text-5xl font-black tracking-tight sm:text-6xl">
                                Congrats, you completed the guided test.
                            </h2>

                            <p className="mt-6 max-w-3xl text-base leading-8 text-slate-300 sm:text-lg">
                                You have finished the tutorial route and helped test the core
                                Coursework Compass workflow. Now you are ready to begin the real
                                planning journey.
                            </p>

                            <div className="mt-8 grid gap-4 md:grid-cols-3">
                                <div className="rounded-3xl border border-slate-800 bg-slate-950/70 p-5">
                                    <p className="mb-2 text-sm font-black text-emerald-300">
                                        01
                                    </p>
                                    <h3 className="font-bold text-white">
                                        You explored planning
                                    </h3>
                                    <p className="mt-2 text-sm leading-6 text-slate-400">
                                        You saw how a large coursework project can become visible
                                        tasks.
                                    </p>
                                </div>

                                <div className="rounded-3xl border border-slate-800 bg-slate-950/70 p-5">
                                    <p className="mb-2 text-sm font-black text-emerald-300">
                                        02
                                    </p>
                                    <h3 className="font-bold text-white">
                                        You tested controls
                                    </h3>
                                    <p className="mt-2 text-sm leading-6 text-slate-400">
                                        You tried real tutorial interactions for task completion,
                                        adding, editing, and deleting.
                                    </p>
                                </div>

                                <div className="rounded-3xl border border-slate-800 bg-slate-950/70 p-5">
                                    <p className="mb-2 text-sm font-black text-emerald-300">
                                        03
                                    </p>
                                    <h3 className="font-bold text-white">
                                        You shaped the product
                                    </h3>
                                    <p className="mt-2 text-sm leading-6 text-slate-400">
                                        Your feedback helps decide what Coursework Compass becomes
                                        next.
                                    </p>
                                </div>
                            </div>

                            <div className="mt-8 flex flex-col gap-4 sm:flex-row">
                                <Link
                                    href="/"
                                    className="rounded-[1.75rem] bg-emerald-400 px-8 py-5 text-center text-lg font-black text-slate-950 shadow-2xl shadow-emerald-950/40 transition hover:bg-emerald-300"
                                >
                                    Return to main menu
                                </Link>

                                <Link
                                    href="/projects/new"
                                    className="rounded-[1.75rem] border border-slate-700 px-8 py-5 text-center text-lg font-black text-white transition hover:border-cyan-400 hover:text-cyan-300"
                                >
                                    Officially start the journey
                                </Link>

                                <button
                                    type="button"
                                    onClick={handleResetTutorial}
                                    className="rounded-[1.75rem] border border-slate-700 px-8 py-5 text-center text-lg font-black text-white transition hover:border-slate-400"
                                >
                                    Try tutorial again
                                </button>
                            </div>
                        </div>
                    </section>
                ) : null}
            </section>
        </main>
    );
}
