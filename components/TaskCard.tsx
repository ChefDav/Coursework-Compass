"use client";

import { useEffect, useState } from "react";
import CalendarDateField from "@/components/CalendarDateField";
import EstimatedTimeField, {
    normaliseEstimatedTime,
} from "@/components/EstimatedTimeField";
import type { CourseworkTask, TaskStatus } from "@/lib/localStorage";

type TaskPriority = "Low" | "Medium" | "High";

type TaskCardProps = {
    task: CourseworkTask;
    onUpdateTask: (taskId: string, updates: Partial<CourseworkTask>) => void;
    onUpdateStatus: (taskId: string, nextStatus: TaskStatus) => void;
    onDeleteTask: (taskId: string) => void;
};

const priorityOptions: TaskPriority[] = ["Low", "Medium", "High"];

function isTaskPriority(value: string): value is TaskPriority {
    return value === "Low" || value === "Medium" || value === "High";
}

function getPriorityClasses(priority?: string) {
    if (priority === "High") {
        return "border-red-400/30 bg-red-400/10 text-red-300";
    }

    if (priority === "Medium") {
        return "border-amber-400/30 bg-amber-400/10 text-amber-300";
    }

    if (priority === "Low") {
        return "border-emerald-400/30 bg-emerald-400/10 text-emerald-300";
    }

    return "border-slate-700 bg-slate-900 text-slate-300";
}

function getDefaultEstimatedTime(priority?: string) {
    if (priority === "High") {
        return "1 hour";
    }

    if (priority === "Low") {
        return "30 min";
    }

    return "45 min";
}

function getDisplayEstimatedTime(value?: string, priority?: string) {
    const normalisedValue = normaliseEstimatedTime(value);

    if (!normalisedValue || normalisedValue === "Not set") {
        return getDefaultEstimatedTime(priority);
    }

    return normalisedValue;
}

function parseDateValue(value?: string) {
    if (!value) {
        return null;
    }

    const cleanedValue = value.trim().replaceAll("/", "-");
    const parts = cleanedValue.split("-").map((part) => Number(part));

    if (parts.length < 3 || parts.some((part) => Number.isNaN(part))) {
        return null;
    }

    const [year, month, day] = parts;

    return new Date(year, month - 1, day);
}

function getDaysLeftLabel(dateValue?: string) {
    const targetDate = parseDateValue(dateValue);

    if (!targetDate) {
        return "Days left: unknown";
    }

    const today = new Date();
    const todayDate = new Date(
        today.getFullYear(),
        today.getMonth(),
        today.getDate(),
    );

    const diffMs = targetDate.getTime() - todayDate.getTime();
    const daysLeft = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

    if (daysLeft < 0) {
        const overdueDays = Math.abs(daysLeft);
        return `${overdueDays} day${overdueDays === 1 ? "" : "s"} overdue`;
    }

    if (daysLeft === 0) {
        return "Due today";
    }

    if (daysLeft === 1) {
        return "1 day left";
    }

    return `${daysLeft} days left`;
}

function getDaysLeftClasses(dateValue?: string) {
    const targetDate = parseDateValue(dateValue);

    if (!targetDate) {
        return "border-slate-700 bg-slate-900 text-slate-300";
    }

    const today = new Date();
    const todayDate = new Date(
        today.getFullYear(),
        today.getMonth(),
        today.getDate(),
    );

    const diffMs = targetDate.getTime() - todayDate.getTime();
    const daysLeft = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

    if (daysLeft < 0 || daysLeft <= 3) {
        return "border-red-400/30 bg-red-400/10 text-red-300";
    }

    if (daysLeft <= 10) {
        return "border-amber-400/30 bg-amber-400/10 text-amber-300";
    }

    return "border-emerald-400/30 bg-emerald-400/10 text-emerald-300";
}

export default function TaskCard({
                                     task,
                                     onUpdateTask,
                                     onUpdateStatus,
                                     onDeleteTask,
                                 }: TaskCardProps) {
    const [isEditing, setIsEditing] = useState(false);
    const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);

    const [editTitle, setEditTitle] = useState(task.title);
    const [editPriority, setEditPriority] = useState<TaskPriority>(
        isTaskPriority(task.priority || "") ? task.priority : "Medium",
    );
    const [editDueDate, setEditDueDate] = useState(task.dueDate || "");
    const [editEstimatedTime, setEditEstimatedTime] = useState(
        getDisplayEstimatedTime(task.estimatedTime, task.priority),
    );
    const [editError, setEditError] = useState("");

    const isDone = task.status === "Done";
    const displayEstimatedTime = getDisplayEstimatedTime(
        task.estimatedTime,
        task.priority,
    );
    const dueDate = task.dueDate || "";

    useEffect(() => {
        setEditTitle(task.title);
        setEditPriority(isTaskPriority(task.priority || "") ? task.priority : "Medium");
        setEditDueDate(task.dueDate || "");
        setEditEstimatedTime(getDisplayEstimatedTime(task.estimatedTime, task.priority));
    }, [task]);

    function handleSaveEdit() {
        const trimmedTitle = editTitle.trim();

        if (!trimmedTitle) {
            setEditError("Please type a task title before saving.");
            return;
        }

        onUpdateTask(task.id, {
            title: trimmedTitle,
            priority: editPriority,
            dueDate: editDueDate,
            estimatedTime: normaliseEstimatedTime(editEstimatedTime),
        });

        setIsEditing(false);
        setIsConfirmingDelete(false);
        setEditError("");
    }

    function handleCancelEdit() {
        setEditTitle(task.title);
        setEditPriority(isTaskPriority(task.priority || "") ? task.priority : "Medium");
        setEditDueDate(task.dueDate || "");
        setEditEstimatedTime(getDisplayEstimatedTime(task.estimatedTime, task.priority));
        setEditError("");
        setIsEditing(false);
    }

    function handleToggleStatus() {
        onUpdateStatus(task.id, isDone ? "Todo" : "Done");
    }

    function handleConfirmDelete() {
        onDeleteTask(task.id);
        setIsConfirmingDelete(false);
    }

    return (
        <article
            className={`rounded-[2rem] border p-5 transition sm:p-6 ${
                isDone
                    ? "border-emerald-400/30 bg-emerald-400/10"
                    : "border-slate-800 bg-slate-900"
            }`}
        >
            {isEditing ? (
                <div>
                    <div className="mb-5">
                        <p className="mb-2 text-sm font-bold text-cyan-300">Edit task</p>
                        <h3 className="text-2xl font-black text-white">
                            Update this task.
                        </h3>
                    </div>

                    <div className="grid gap-4">
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

                        <div className="grid gap-4 md:grid-cols-3">
                            <div>
                                <label className="mb-2 block text-xs font-bold text-slate-300">
                                    Priority
                                </label>
                                <select
                                    value={editPriority}
                                    onChange={(event) => {
                                        if (!isTaskPriority(event.target.value)) {
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

                            <CalendarDateField
                                label="Due date"
                                value={editDueDate}
                                onChange={setEditDueDate}
                            />

                            <EstimatedTimeField
                                label="Estimated time"
                                value={editEstimatedTime}
                                onChange={setEditEstimatedTime}
                            />
                        </div>
                    </div>

                    {editError ? (
                        <div className="mt-4 rounded-2xl border border-red-400/30 bg-red-400/10 p-4 text-sm font-bold text-red-300">
                            {editError}
                        </div>
                    ) : null}

                    <div className="mt-5 flex flex-col gap-3 sm:flex-row">
                        <button
                            type="button"
                            onClick={handleSaveEdit}
                            className="rounded-2xl bg-cyan-400 px-5 py-3 text-sm font-bold text-slate-950 transition hover:bg-cyan-300"
                        >
                            Save changes
                        </button>

                        <button
                            type="button"
                            onClick={handleCancelEdit}
                            className="rounded-2xl border border-slate-700 px-5 py-3 text-sm font-bold text-white transition hover:border-slate-400"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            ) : (
                <div>
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                        <div className="min-w-0">
                            <h3
                                className={`text-2xl font-black ${
                                    isDone ? "text-emerald-200 line-through" : "text-white"
                                }`}
                            >
                                {task.title}
                            </h3>

                            <div className="mt-4 flex flex-wrap gap-2 text-xs font-bold">
                <span className="rounded-full border border-slate-700 bg-slate-950/70 px-3 py-1 text-slate-300">
                  Estimated time: {displayEstimatedTime}
                </span>

                                <span className="rounded-full border border-slate-700 bg-slate-950/70 px-3 py-1 text-slate-300">
                  Due date: {dueDate || "Not set"}
                </span>

                                <span
                                    className={`rounded-full border px-3 py-1 ${getDaysLeftClasses(
                                        dueDate,
                                    )}`}
                                >
                  {getDaysLeftLabel(dueDate)}
                </span>

                                <span
                                    className={`rounded-full border px-3 py-1 ${getPriorityClasses(
                                        task.priority,
                                    )}`}
                                >
                  {isDone ? "Done" : task.priority || "Medium"}
                </span>
                            </div>
                        </div>

                        <div className="flex shrink-0 flex-col gap-3 sm:flex-row lg:flex-col xl:flex-row">
                            <button
                                type="button"
                                onClick={() => {
                                    setIsEditing(true);
                                    setIsConfirmingDelete(false);
                                }}
                                className="rounded-2xl border border-slate-700 px-5 py-3 text-sm font-bold text-white transition hover:border-cyan-400 hover:text-cyan-300"
                            >
                                Edit
                            </button>

                            <button
                                type="button"
                                onClick={() => {
                                    setIsConfirmingDelete(true);
                                    setIsEditing(false);
                                }}
                                className="rounded-2xl border border-red-400/30 bg-red-400/10 px-5 py-3 text-sm font-bold text-red-300 transition hover:bg-red-400/20"
                            >
                                Delete
                            </button>

                            <button
                                type="button"
                                onClick={handleToggleStatus}
                                className={
                                    isDone
                                        ? "rounded-2xl border border-emerald-400/30 bg-emerald-400/10 px-5 py-3 text-sm font-bold text-emerald-200 transition hover:bg-emerald-400/20"
                                        : "rounded-2xl bg-cyan-400 px-5 py-3 text-sm font-bold text-slate-950 transition hover:bg-cyan-300"
                                }
                            >
                                {isDone ? "Mark as todo" : "Mark done"}
                            </button>
                        </div>
                    </div>

                    {isConfirmingDelete ? (
                        <div className="mt-5 rounded-2xl border border-red-400/30 bg-red-400/10 p-4">
                            <p className="text-sm font-bold text-red-300">
                                Delete this task? This cannot be undone.
                            </p>

                            <div className="mt-4 flex flex-col gap-3 sm:flex-row">
                                <button
                                    type="button"
                                    onClick={handleConfirmDelete}
                                    className="rounded-2xl bg-red-400 px-5 py-3 text-sm font-bold text-slate-950 transition hover:bg-red-300"
                                >
                                    Confirm delete
                                </button>

                                <button
                                    type="button"
                                    onClick={() => setIsConfirmingDelete(false)}
                                    className="rounded-2xl border border-slate-700 px-5 py-3 text-sm font-bold text-white transition hover:border-slate-400"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    ) : null}
                </div>
            )}
        </article>
    );
}