"use client";

import { useEffect, useState } from "react";
import CalendarDateField from "@/components/CalendarDateField";
import FancySelect from "@/components/FancySelect";
import RiskBadge from "@/components/RiskBadge";
import type { PriorityLevel, Task, TaskStatus } from "@/types/coursework";

export type TaskUpdateInput = {
    title: string;
    priority: PriorityLevel;
    dueDate: string;
    time: string;
};

type TaskCardProps = {
    task?: Task;
    onChangeStatus?: (taskId: string, nextStatus: TaskStatus) => void;
    onUpdateTask?: (taskId: string, updates: TaskUpdateInput) => void;
};

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

export default function TaskCard({
                                     task,
                                     onChangeStatus,
                                     onUpdateTask,
                                 }: TaskCardProps) {
    const [isEditing, setIsEditing] = useState(false);
    const [editTitle, setEditTitle] = useState("");
    const [editPriority, setEditPriority] = useState<PriorityLevel>("Medium");
    const [editDueDate, setEditDueDate] = useState("");
    const [editTime, setEditTime] = useState("45 min");
    const [editError, setEditError] = useState("");
    const [editMessage, setEditMessage] = useState("");

    useEffect(() => {
        if (!task || isEditing) {
            return;
        }

        setEditTitle(task.title);
        setEditPriority(task.priority);
        setEditDueDate(task.dueDate ?? "");
        setEditTime(task.time);
    }, [isEditing, task]);

    if (!task) {
        return (
            <div className="rounded-3xl border border-red-400/30 bg-red-400/10 p-5 text-sm font-bold text-red-300 sm:p-6">
                Task data is missing.
            </div>
        );
    }

    const isDone = task.status === "Done";
    const nextStatus: TaskStatus = isDone ? "Todo" : "Done";

    function handleStartEdit() {
        if (!task) {
            return;
        }

        setEditTitle(task.title);
        setEditPriority(task.priority);
        setEditDueDate(task.dueDate ?? "");
        setEditTime(task.time);
        setEditError("");
        setEditMessage("");
        setIsEditing(true);
    }

    function handleCancelEdit() {
        if (!task) {
            return;
        }

        setEditTitle(task.title);
        setEditPriority(task.priority);
        setEditDueDate(task.dueDate ?? "");
        setEditTime(task.time);
        setEditError("");
        setEditMessage("");
        setIsEditing(false);
    }

    function handleSaveEdit() {
        if (!task) {
            return;
        }

        const trimmedTitle = editTitle.trim();

        if (!trimmedTitle) {
            setEditError("Please enter a task title.");
            return;
        }

        onUpdateTask?.(task.id, {
            title: trimmedTitle,
            priority: editPriority,
            dueDate: editDueDate,
            time: editTime.trim() || "45 min",
        });

        setEditMessage("Task updated.");
        setIsEditing(false);
    }

    if (isEditing) {
        return (
            <div className="rounded-3xl border border-cyan-400/30 bg-cyan-400/10 p-5 sm:p-6">
                <div className="mb-5">
                    <p className="mb-2 text-sm font-bold text-cyan-300">Edit task</p>
                    <h2 className="text-2xl font-black sm:text-3xl">
                        Update task details.
                    </h2>
                    <p className="mt-2 text-sm leading-6 text-slate-300">
                        Change the title, priority, due date, or estimated time for this
                        task.
                    </p>
                </div>

                <div className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
                    <div>
                        <label className="mb-2 block text-sm font-bold text-white">
                            Task title
                        </label>
                        <input
                            type="text"
                            value={editTitle}
                            onChange={(event) => {
                                setEditTitle(event.target.value);
                                setEditError("");
                                setEditMessage("");
                            }}
                            className="w-full rounded-2xl border border-slate-600 bg-slate-950/70 px-4 py-4 font-bold text-white outline-none transition placeholder:text-slate-500 focus:border-cyan-300 focus:shadow-lg focus:shadow-cyan-950/40"
                        />
                    </div>

                    <FancySelect
                        label="Priority"
                        value={editPriority}
                        placeholder="Choose priority"
                        options={priorityOptions}
                        onChange={(nextValue) => {
                            if (!isPriorityLevel(nextValue)) {
                                return;
                            }

                            setEditPriority(nextValue);
                            setEditError("");
                            setEditMessage("");
                        }}
                        helperText="Use High for urgent or high-impact work."
                    />
                </div>

                <div className="mt-4 grid gap-4 lg:grid-cols-[1fr_0.7fr]">
                    <CalendarDateField
                        label="Due date"
                        value={editDueDate}
                        onChange={(nextValue) => {
                            setEditDueDate(nextValue);
                            setEditError("");
                            setEditMessage("");
                        }}
                        helperText="Optional. Use the calendar or double-click to type manually."
                    />

                    <div>
                        <label className="mb-2 block text-sm font-bold text-white">
                            Estimated time
                        </label>
                        <input
                            type="text"
                            value={editTime}
                            onChange={(event) => {
                                setEditTime(event.target.value);
                                setEditError("");
                                setEditMessage("");
                            }}
                            placeholder="45 min"
                            className="w-full rounded-2xl border border-slate-600 bg-slate-950/70 px-4 py-4 font-bold text-white outline-none transition placeholder:text-slate-500 focus:border-cyan-300 focus:shadow-lg focus:shadow-cyan-950/40"
                        />
                        <p className="mt-2 text-xs leading-5 text-slate-400">
                            Examples: 30 min, 45 min, 1 hour, 2 hours.
                        </p>
                    </div>
                </div>

                {editError ? (
                    <div className="mt-4 rounded-2xl border border-red-400/30 bg-red-400/10 p-4 text-sm font-bold text-red-300">
                        {editError}
                    </div>
                ) : null}

                {editMessage ? (
                    <div className="mt-4 rounded-2xl border border-emerald-400/30 bg-emerald-400/10 p-4 text-sm font-bold text-emerald-300">
                        {editMessage}
                    </div>
                ) : null}

                <div className="mt-5 flex flex-col gap-4 sm:flex-row">
                    <button
                        type="button"
                        onClick={handleSaveEdit}
                        className="rounded-2xl bg-cyan-400 px-6 py-4 font-bold text-slate-950 transition hover:bg-cyan-300"
                    >
                        Save task
                    </button>

                    <button
                        type="button"
                        onClick={handleCancelEdit}
                        className="rounded-2xl border border-slate-700 px-6 py-4 font-bold text-white transition hover:border-slate-400"
                    >
                        Cancel
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div
            className={`rounded-3xl border p-5 sm:p-6 ${
                isDone
                    ? "border-emerald-400/30 bg-emerald-400/10"
                    : "border-slate-800 bg-slate-900"
            }`}
        >
            <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div className="min-w-0">
                    <h2
                        className={`break-words text-xl font-bold leading-tight ${
                            isDone ? "text-emerald-200 line-through" : "text-white"
                        }`}
                    >
                        {task.title}
                    </h2>
                    <p className="mt-1 break-words text-sm text-slate-400">
                        {task.project}
                    </p>
                </div>

                <div className="shrink-0">
                    {isDone ? (
                        <span className="rounded-full bg-emerald-400/10 px-4 py-2 text-sm font-bold text-emerald-300">
              Done
            </span>
                    ) : (
                        <RiskBadge level={task.priority} />
                    )}
                </div>
            </div>

            <div className="flex flex-col gap-4 text-sm text-slate-300 sm:flex-row sm:items-end sm:justify-between">
                <div className="space-y-1">
                    <p>Estimated time: {task.time}</p>
                    <p>Due date: {task.dueDate || "Not scheduled"}</p>
                </div>

                <div className="flex flex-col gap-3 sm:flex-row">
                    {onUpdateTask ? (
                        <button
                            type="button"
                            onClick={handleStartEdit}
                            className="w-full rounded-xl border border-slate-700 px-4 py-3 font-bold text-white transition hover:border-cyan-400 hover:text-cyan-300 sm:w-auto"
                        >
                            Edit
                        </button>
                    ) : null}

                    <button
                        type="button"
                        onClick={() => onChangeStatus?.(task.id, nextStatus)}
                        className={`w-full rounded-xl px-4 py-3 font-bold transition sm:w-auto ${
                            isDone
                                ? "border border-emerald-400/30 bg-emerald-400/10 text-emerald-200 hover:bg-emerald-400/20"
                                : "bg-cyan-400 text-slate-950 hover:bg-cyan-300"
                        }`}
                    >
                        {isDone ? "Mark as todo" : "Mark done"}
                    </button>
                </div>
            </div>
        </div>
    );
}