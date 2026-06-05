"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import AppNav from "@/components/AppNav";
import CalendarDateField from "@/components/CalendarDateField";
import EstimatedTimeField, {
    normaliseEstimatedTime,
} from "@/components/EstimatedTimeField";
import FancySelect from "@/components/FancySelect";
import ProjectCard from "@/components/ProjectCard";
import TaskCard from "@/components/TaskCard";
import type { TaskUpdateInput } from "@/components/TaskCard";
import {
    addCustomTask,
    loadProjectPlans,
    updateProjectDetails,
    updateTaskDetails,
    updateTaskStatus,
} from "@/lib/localStorage";
import { applyProgressToProject, countDoneTasks } from "@/lib/progressUtils";
import type {
    GeneratedProjectPlan,
    PriorityLevel,
    TaskStatus,
} from "@/types/coursework";

const priorityOptions = [
    {
        label: "Low",
        value: "Low",
        description: "Useful but not urgent.",
    },
    {
        label: "Medium",
        value: "Medium",
        description: "Important work that should stay visible.",
    },
    {
        label: "High",
        value: "High",
        description: "Urgent or high-impact task. Do this early.",
    },
];

function isPriorityLevel(value: string): value is PriorityLevel {
    return value === "Low" || value === "Medium" || value === "High";
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

export default function ProjectDetailPage() {
    const params = useParams<{ projectId: string }>();
    const projectId = params.projectId;

    const [savedPlans, setSavedPlans] = useState<GeneratedProjectPlan[]>([]);
    const [isEditingTitle, setIsEditingTitle] = useState(false);
    const [editTitle, setEditTitle] = useState("");
    const [editDeadline, setEditDeadline] = useState("");
    const [titleError, setTitleError] = useState("");
    const [titleMessage, setTitleMessage] = useState("");
    const [deadlineError, setDeadlineError] = useState("");
    const [deadlineMessage, setDeadlineMessage] = useState("");

    const [newTaskTitle, setNewTaskTitle] = useState("");
    const [newTaskPriority, setNewTaskPriority] =
        useState<PriorityLevel>("Medium");
    const [newTaskDueDate, setNewTaskDueDate] = useState("");
    const [newTaskTime, setNewTaskTime] = useState("45 min");
    const [newTaskError, setNewTaskError] = useState("");
    const [newTaskMessage, setNewTaskMessage] = useState("");

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

    useEffect(() => {
        if (!project) {
            return;
        }

        setEditTitle(project.title);
        setEditDeadline(normaliseDeadlineFormat(project.deadline));
    }, [project?.id, project?.title, project?.deadline]);

    function handleChangeTaskStatus(taskId: string, nextStatus: TaskStatus) {
        const updatedPlans = updateTaskStatus(taskId, nextStatus);
        setSavedPlans(updatedPlans);
    }

    function handleUpdateTaskDetails(taskId: string, updates: TaskUpdateInput) {
        const updatedPlans = updateTaskDetails(taskId, updates);
        setSavedPlans(updatedPlans);
    }

    function handleStartTitleEdit() {
        if (!project) {
            return;
        }

        setEditTitle(project.title);
        setTitleError("");
        setTitleMessage("");
        setIsEditingTitle(true);
    }

    function handleCancelTitleEdit() {
        if (!project) {
            return;
        }

        setEditTitle(project.title);
        setTitleError("");
        setIsEditingTitle(false);
    }

    function handleSaveTitle() {
        if (!project) {
            return;
        }

        setTitleError("");
        setTitleMessage("");

        const trimmedTitle = editTitle.trim();

        if (!trimmedTitle) {
            setTitleError("Please enter a project name.");
            return;
        }

        const safeDeadline = normaliseDeadlineFormat(project.deadline);

        const updatedPlans = updateProjectDetails(projectId, {
            title: trimmedTitle,
            deadline: safeDeadline,
        });

        setSavedPlans(updatedPlans);
        setEditDeadline(safeDeadline);
        setIsEditingTitle(false);
        setTitleMessage("Project title updated.");
    }

    function handleSaveDeadline() {
        if (!project) {
            return;
        }

        setDeadlineError("");
        setDeadlineMessage("");

        const normalisedDeadline = normaliseDeadlineFormat(editDeadline);
        const deadlineValidationError = validateDeadline(normalisedDeadline);

        if (deadlineValidationError) {
            setDeadlineError(deadlineValidationError);
            return;
        }

        const updatedPlans = updateProjectDetails(projectId, {
            title: project.title,
            deadline: normalisedDeadline,
        });

        setSavedPlans(updatedPlans);
        setEditDeadline(normalisedDeadline);
        setDeadlineMessage("Project deadline updated.");
    }

    function handleAddCustomTask() {
        setNewTaskError("");
        setNewTaskMessage("");

        const trimmedTitle = newTaskTitle.trim();

        if (!trimmedTitle) {
            setNewTaskError("Please enter a task title.");
            return;
        }

        const updatedPlans = addCustomTask(projectId, {
            title: trimmedTitle,
            priority: newTaskPriority,
            dueDate: newTaskDueDate,
            time: normaliseEstimatedTime(newTaskTime),
        });

        setSavedPlans(updatedPlans);
        setNewTaskTitle("");
        setNewTaskPriority("Medium");
        setNewTaskDueDate("");
        setNewTaskTime("45 min");
        setNewTaskMessage("Custom task added.");
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
                    <div className="min-w-0">
                        <p className="mb-2 text-sm font-bold text-cyan-300">
                            Project details
                        </p>

                        {isEditingTitle ? (
                            <div className="max-w-3xl">
                                <input
                                    type="text"
                                    value={editTitle}
                                    onChange={(event) => {
                                        setEditTitle(event.target.value);
                                        setTitleError("");
                                        setTitleMessage("");
                                    }}
                                    onKeyDown={(event) => {
                                        if (event.key === "Enter") {
                                            handleSaveTitle();
                                        }

                                        if (event.key === "Escape") {
                                            handleCancelTitleEdit();
                                        }
                                    }}
                                    autoFocus
                                    className="w-full rounded-3xl border border-cyan-400/50 bg-slate-950/80 px-4 py-4 text-4xl font-black tracking-tight text-white outline-none transition placeholder:text-slate-500 focus:border-cyan-300 focus:shadow-2xl focus:shadow-cyan-950/50 sm:text-5xl"
                                />

                                <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center">
                                    <button
                                        type="button"
                                        onClick={handleSaveTitle}
                                        className="rounded-2xl bg-cyan-400 px-5 py-3 text-sm font-bold text-slate-950 transition hover:bg-cyan-300"
                                    >
                                        Save title
                                    </button>

                                    <button
                                        type="button"
                                        onClick={handleCancelTitleEdit}
                                        className="rounded-2xl border border-slate-700 px-5 py-3 text-sm font-bold text-white transition hover:border-slate-400"
                                    >
                                        Cancel
                                    </button>

                                    <p className="text-xs text-slate-400">
                                        Press Enter to save or Esc to cancel.
                                    </p>
                                </div>
                            </div>
                        ) : (
                            <button
                                type="button"
                                onClick={handleStartTitleEdit}
                                className="group max-w-4xl text-left"
                            >
                                <h1 className="break-words text-4xl font-black tracking-tight transition group-hover:text-cyan-300 sm:text-5xl">
                                    {project.title}
                                </h1>
                                <p className="mt-2 text-xs font-bold uppercase tracking-[0.2em] text-slate-500 transition group-hover:text-cyan-400">
                                    Click title to rename
                                </p>
                            </button>
                        )}

                        {titleError ? (
                            <div className="mt-4 rounded-2xl border border-red-400/30 bg-red-400/10 p-4 text-sm font-bold text-red-300">
                                {titleError}
                            </div>
                        ) : null}

                        {titleMessage ? (
                            <div className="mt-4 rounded-2xl border border-emerald-400/30 bg-emerald-400/10 p-4 text-sm font-bold text-emerald-300">
                                {titleMessage}
                            </div>
                        ) : null}

                        <p className="mt-4 max-w-2xl text-slate-300">
                            Review this coursework project, track generated tasks, rename the
                            project directly from the title, adjust the deadline, and add your
                            own custom tasks.
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

                <section className="mb-8 rounded-3xl border border-cyan-400/30 bg-cyan-400/10 p-5 sm:p-6">
                    <div className="mb-5">
                        <p className="mb-2 text-sm font-bold text-cyan-300">
                            Deadline control
                        </p>
                        <h2 className="text-2xl font-black sm:text-3xl">
                            Update the project deadline.
                        </h2>
                        <p className="mt-2 text-sm leading-6 text-slate-300">
                            Change the deadline if your teacher updates the schedule. Days
                            left and risk level will be recalculated automatically.
                        </p>
                    </div>

                    <div className="grid gap-4 md:grid-cols-[1fr_auto] md:items-end">
                        <CalendarDateField
                            label="Deadline"
                            value={editDeadline}
                            onChange={(nextValue) => {
                                setEditDeadline(nextValue);
                                setDeadlineError("");
                                setDeadlineMessage("");
                            }}
                            helperText="Click to choose from the calendar. Double-click to type manually."
                        />

                        <button
                            type="button"
                            onClick={handleSaveDeadline}
                            className="rounded-2xl bg-cyan-400 px-6 py-4 font-bold text-slate-950 transition hover:bg-cyan-300"
                        >
                            Save deadline
                        </button>
                    </div>

                    {deadlineError ? (
                        <div className="mt-4 rounded-2xl border border-red-400/30 bg-red-400/10 p-4 text-sm font-bold text-red-300">
                            {deadlineError}
                        </div>
                    ) : null}

                    {deadlineMessage ? (
                        <div className="mt-4 rounded-2xl border border-emerald-400/30 bg-emerald-400/10 p-4 text-sm font-bold text-emerald-300">
                            {deadlineMessage}
                        </div>
                    ) : null}
                </section>

                <section className="mb-8 rounded-3xl border border-emerald-400/30 bg-emerald-400/10 p-5 sm:p-6">
                    <div className="mb-5">
                        <p className="mb-2 text-sm font-bold text-emerald-300">
                            Custom task
                        </p>
                        <h2 className="text-2xl font-black sm:text-3xl">
                            Add your own task.
                        </h2>
                        <p className="mt-2 text-sm leading-6 text-slate-300">
                            Generated tasks give you a starting plan. Add custom tasks for
                            teacher feedback, extra research, presentation work, or anything
                            specific to your real project.
                        </p>
                    </div>

                    <div className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
                        <div>
                            <label className="mb-2 block text-sm font-bold text-white">
                                Task title
                            </label>
                            <input
                                type="text"
                                value={newTaskTitle}
                                onChange={(event) => {
                                    setNewTaskTitle(event.target.value);
                                    setNewTaskError("");
                                    setNewTaskMessage("");
                                }}
                                placeholder="e.g. Ask teacher for feedback"
                                className="w-full rounded-2xl border border-slate-600 bg-slate-950/70 px-4 py-4 font-bold text-white outline-none transition placeholder:text-slate-500 focus:border-emerald-300 focus:shadow-lg focus:shadow-emerald-950/40"
                            />
                        </div>

                        <FancySelect
                            label="Priority"
                            value={newTaskPriority}
                            placeholder="Choose priority"
                            options={priorityOptions}
                            onChange={(nextValue) => {
                                if (!isPriorityLevel(nextValue)) {
                                    return;
                                }

                                setNewTaskPriority(nextValue);
                                setNewTaskError("");
                                setNewTaskMessage("");
                            }}
                            helperText="Use High for urgent or high-impact work."
                        />
                    </div>

                    <div className="mt-4 grid gap-4 lg:grid-cols-[1fr_0.7fr]">
                        <CalendarDateField
                            label="Due date"
                            value={newTaskDueDate}
                            onChange={(nextValue) => {
                                setNewTaskDueDate(nextValue);
                                setNewTaskError("");
                                setNewTaskMessage("");
                            }}
                            helperText="Optional. Leave blank if this task is not scheduled yet."
                        />

                        <EstimatedTimeField
                            label="Estimated time"
                            value={newTaskTime}
                            onChange={(nextValue) => {
                                setNewTaskTime(nextValue);
                                setNewTaskError("");
                                setNewTaskMessage("");
                            }}
                            helperText="Choose a number and unit. 60 min becomes 1 hour, 24 hours becomes 1 day."
                        />
                    </div>

                    {newTaskError ? (
                        <div className="mt-4 rounded-2xl border border-red-400/30 bg-red-400/10 p-4 text-sm font-bold text-red-300">
                            {newTaskError}
                        </div>
                    ) : null}

                    {newTaskMessage ? (
                        <div className="mt-4 rounded-2xl border border-emerald-400/30 bg-emerald-400/10 p-4 text-sm font-bold text-emerald-300">
                            {newTaskMessage}
                        </div>
                    ) : null}

                    <div className="mt-5">
                        <button
                            type="button"
                            onClick={handleAddCustomTask}
                            className="rounded-2xl bg-emerald-400 px-6 py-4 font-bold text-slate-950 transition hover:bg-emerald-300"
                        >
                            Add custom task
                        </button>
                    </div>
                </section>

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
                            are hidden from Today to keep your daily workspace clean. Adding a
                            custom task will reactivate the project.
                        </p>
                    </div>
                ) : null}

                <section>
                    <div className="mb-6">
                        <p className="mb-2 text-sm font-bold text-cyan-300">Task list</p>
                        <h2 className="text-2xl font-black sm:text-3xl">
                            Generated and custom coursework tasks.
                        </h2>
                        <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-300">
                            These tasks include the original generated plan plus any custom
                            tasks you add for your real workflow.
                        </p>
                    </div>

                    {tasks.length > 0 ? (
                        <div className="space-y-4">
                            {tasks.map((task) => (
                                <TaskCard
                                    key={task.id}
                                    task={task}
                                    onChangeStatus={handleChangeTaskStatus}
                                    onUpdateTask={handleUpdateTaskDetails}
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="rounded-3xl border border-slate-800 bg-slate-900 p-6">
                            <p className="mb-2 text-xl font-bold">No visible tasks.</p>
                            <p className="text-sm leading-6 text-slate-300">
                                This usually means the completed tasks were archived after the
                                project reached 100%. Add a custom task if new work appears.
                            </p>
                        </div>
                    )}
                </section>
            </section>
        </main>
    );
}