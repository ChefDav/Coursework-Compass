"use client";

import { useState } from "react";
import CalendarDateField from "@/components/CalendarDateField";
import ErrorNotice from "@/components/ErrorNotice";
import EstimatedTimeField, {
    normaliseEstimatedTime,
} from "@/components/EstimatedTimeField";
import { useStoredLanguage } from "@/lib/clientStores";
import type { CourseworkTask, TaskStatus } from "@/lib/localStorage";
import type { Language } from "@/lib/i18n";

type TaskPriority = "Low" | "Medium" | "High";

type TaskCardProps = {
    task: CourseworkTask;
    onUpdateTask: (taskId: string, updates: Partial<CourseworkTask>) => void;
    onUpdateStatus: (taskId: string, nextStatus: TaskStatus) => void;
    onDeleteTask: (taskId: string) => void;
};

const priorityOptions: TaskPriority[] = ["Low", "Medium", "High"];

const copy = {
    en: {
        editTask: "Edit task",
        updateTask: "Update this task.",
        taskTitle: "Task title",
        priority: "Priority",
        status: "Status",
        dueDate: "Due date",
        estimatedTime: "Estimated time",
        saveChanges: "Save changes",
        cancel: "Cancel",
        edit: "Edit",
        delete: "Delete",
        confirmDelete: "Confirm delete",
        deletePrompt: "Delete this task? This cannot be undone.",
        markDone: "Mark done",
        markAsTodo: "Mark as todo",
        taskTitleRequired: "Task title required",
        titleError: "Please enter a task title before saving this change.",
        notSet: "Not set",
        unknownDays: "Days left: unknown",
        dueToday: "Due today",
        dayLeft: "day left",
        daysLeft: "days left",
        overdue: "overdue",
        low: "Low",
        medium: "Medium",
        high: "High",
        todo: "Todo",
        inProgress: "In progress",
        done: "Done",
    },
    zh: {
        editTask: "编辑任务",
        updateTask: "更新这个任务。",
        taskTitle: "任务标题",
        priority: "优先级",
        status: "状态",
        dueDate: "任务日期",
        estimatedTime: "预计用时",
        saveChanges: "保存更改",
        cancel: "取消",
        edit: "编辑",
        delete: "删除",
        confirmDelete: "确认删除",
        deletePrompt: "要删除这个任务吗？此操作不能撤销。",
        markDone: "标记完成",
        markAsTodo: "恢复待办",
        taskTitleRequired: "需要填写任务标题",
        titleError: "请先输入任务标题，再保存这个更改。",
        notSet: "未设置",
        unknownDays: "剩余天数：未知",
        dueToday: "今天截止",
        dayLeft: "天剩余",
        daysLeft: "天剩余",
        overdue: "已逾期",
        low: "低",
        medium: "中",
        high: "高",
        todo: "待办",
        inProgress: "进行中",
        done: "已完成",
    },
} as const;

function isTaskPriority(value: string | undefined): value is TaskPriority {
    return value === "Low" || value === "Medium" || value === "High";
}

function normalisePriority(value: string | undefined): TaskPriority {
    if (isTaskPriority(value)) {
        return value;
    }

    return "Medium";
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

    return "cc-badge";
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

function getPriorityLabel(priority: string | undefined, language: Language) {
    const currentCopy = copy[language];

    if (priority === "High") {
        return currentCopy.high;
    }

    if (priority === "Low") {
        return currentCopy.low;
    }

    return currentCopy.medium;
}

function getStatusLabel(status: string | undefined, language: Language) {
    const currentCopy = copy[language];

    if (status === "Done") {
        return currentCopy.done;
    }

    if (status === "In Progress") {
        return currentCopy.inProgress;
    }

    return currentCopy.todo;
}

function getDaysLeftLabel(dateValue: string | undefined, language: Language) {
    const currentCopy = copy[language];
    const targetDate = parseDateValue(dateValue);

    if (!targetDate) {
        return currentCopy.unknownDays;
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
        if (language === "zh") {
            return `${overdueDays} 天${currentCopy.overdue}`;
        }

        return `${overdueDays} day${overdueDays === 1 ? "" : "s"} ${currentCopy.overdue}`;
    }

    if (daysLeft === 0) {
        return currentCopy.dueToday;
    }

    if (daysLeft === 1) {
        return `1 ${currentCopy.dayLeft}`;
    }

    return `${daysLeft} ${currentCopy.daysLeft}`;
}

function getDaysLeftClasses(dateValue?: string) {
    const targetDate = parseDateValue(dateValue);

    if (!targetDate) {
        return "cc-badge";
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
    const language = useStoredLanguage();
    const currentCopy = copy[language];
    const [isEditing, setIsEditing] = useState(false);
    const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);
    const taskEditKey = [
        task.id,
        task.title,
        task.priority || "",
        task.dueDate || "",
        task.estimatedTime || "",
    ].join("|");

    const [lastTaskEditKey, setLastTaskEditKey] = useState(taskEditKey);
    const [editTitle, setEditTitle] = useState(task.title);
    const [editPriority, setEditPriority] = useState<TaskPriority>(
        normalisePriority(task.priority),
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

    if (taskEditKey !== lastTaskEditKey) {
        setLastTaskEditKey(taskEditKey);
        setEditTitle(task.title);
        setEditPriority(normalisePriority(task.priority));
        setEditDueDate(task.dueDate || "");
        setEditEstimatedTime(
            getDisplayEstimatedTime(task.estimatedTime, task.priority),
        );
    }

    function handleSaveEdit() {
        const trimmedTitle = editTitle.trim();

        if (!trimmedTitle) {
            setEditError(currentCopy.titleError);
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
        setEditPriority(normalisePriority(task.priority));
        setEditDueDate(task.dueDate || "");
        setEditEstimatedTime(
            getDisplayEstimatedTime(task.estimatedTime, task.priority),
        );
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
            className={`cc-interactive-card cc-motion-fade-up rounded-[1.5rem] border p-5 transition sm:p-6 ${
                isDone
                    ? "cc-card border-emerald-400/40 bg-emerald-400/10"
                    : "cc-card"
            }`}
        >
            {isEditing ? (
                <div>
                    <div className="mb-5">
                        <p className="mb-2 text-sm font-bold text-cyan-300">
                            {currentCopy.editTask}
                        </p>
                        <h3 className="cc-card-title text-xl sm:text-2xl">
                            {currentCopy.updateTask}
                        </h3>
                    </div>

                    <div className="grid gap-4">
                        <div>
                            <label className="cc-text-muted mb-2 block text-xs font-bold">
                                {currentCopy.taskTitle}
                            </label>
                            <input
                                type="text"
                                value={editTitle}
                                onChange={(event) => {
                                    setEditTitle(event.target.value);
                                    setEditError("");
                                }}
                                className="cc-input w-full rounded-2xl px-4 py-3 text-sm font-bold transition"
                            />
                        </div>

                        <div className="grid gap-4 md:grid-cols-3">
                            <div>
                                <label className="cc-text-muted mb-2 block text-xs font-bold">
                                    {currentCopy.priority}
                                </label>
                                <select
                                    value={editPriority}
                                    onChange={(event) => {
                                        setEditPriority(normalisePriority(event.target.value));
                                    }}
                                    className="cc-input w-full rounded-2xl px-4 py-3 text-sm font-bold transition"
                                >
                                    {priorityOptions.map((priority) => (
                                        <option key={priority} value={priority}>
                                            {getPriorityLabel(priority, language)}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <CalendarDateField
                                label={currentCopy.dueDate}
                                value={editDueDate}
                                onChange={setEditDueDate}
                            />

                            <EstimatedTimeField
                                label={currentCopy.estimatedTime}
                                value={editEstimatedTime}
                                onChange={setEditEstimatedTime}
                            />
                        </div>
                    </div>

                    {editError ? (
                        <div className="mt-4">
                            <ErrorNotice
                                title={currentCopy.taskTitleRequired}
                                message={editError}
                            />
                        </div>
                    ) : null}

                    <div className="mt-5 flex flex-col gap-3 sm:flex-row">
                        <button
                            type="button"
                            onClick={handleSaveEdit}
                            className="cc-button-primary w-full rounded-2xl px-5 py-3 text-sm sm:w-auto"
                        >
                            {currentCopy.saveChanges}
                        </button>

                        <button
                            type="button"
                            onClick={handleCancelEdit}
                            className="cc-button-secondary w-full rounded-2xl px-5 py-3 text-sm sm:w-auto"
                        >
                            {currentCopy.cancel}
                        </button>
                    </div>
                </div>
            ) : (
                <div>
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                        <div className="min-w-0">
                            <h3
                                className={`text-xl font-black sm:text-2xl ${
                                    isDone ? "text-emerald-300 line-through" : "cc-text-main"
                                }`}
                            >
                                {task.title}
                            </h3>

                            <div className="mt-4 flex flex-wrap gap-2 text-xs font-bold">
                <span className="cc-pill-muted rounded-full px-3 py-1">
                  {currentCopy.estimatedTime}: {displayEstimatedTime}
                </span>

                                <span className="cc-pill-muted rounded-full px-3 py-1">
                  {currentCopy.dueDate}: {dueDate || currentCopy.notSet}
                </span>

                                <span
                                    className={`rounded-full border px-3 py-1 ${getDaysLeftClasses(
                                        dueDate,
                                    )}`}
                                >
                  {getDaysLeftLabel(dueDate, language)}
                </span>

                                <span
                                    className={`rounded-full border px-3 py-1 ${getPriorityClasses(
                                        task.priority,
                                    )}`}
                                >
                  {isDone
                      ? getStatusLabel(task.status, language)
                      : getPriorityLabel(task.priority, language)}
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
                                className="cc-button-secondary w-full rounded-2xl px-5 py-3 text-sm sm:w-auto"
                            >
                                {currentCopy.edit}
                            </button>

                            <button
                                type="button"
                                onClick={() => {
                                    setIsConfirmingDelete(true);
                                    setIsEditing(false);
                                }}
                                className="cc-button-danger w-full rounded-2xl px-5 py-3 text-sm sm:w-auto"
                            >
                                {currentCopy.delete}
                            </button>

                            <button
                                type="button"
                                onClick={handleToggleStatus}
                                className={
                                    isDone
                                        ? "cc-button-secondary w-full rounded-2xl px-5 py-3 text-sm hover:border-emerald-400 hover:text-emerald-300 sm:w-auto"
                                        : "cc-button-success w-full rounded-2xl px-5 py-3 text-sm sm:w-auto"
                                }
                            >
                                {isDone ? currentCopy.markAsTodo : currentCopy.markDone}
                            </button>
                        </div>
                    </div>

                    {isConfirmingDelete ? (
                        <div className="cc-motion-scale-in mt-5 rounded-2xl border border-red-400/30 bg-red-400/10 p-4">
                            <p className="text-sm font-bold text-red-300">
                                {currentCopy.deletePrompt}
                            </p>

                            <div className="mt-4 flex flex-col gap-3 sm:flex-row">
                                <button
                                    type="button"
                                    onClick={handleConfirmDelete}
                                    className="cc-button-danger rounded-2xl px-5 py-3 text-sm"
                                >
                                    {currentCopy.confirmDelete}
                                </button>

                                <button
                                    type="button"
                                    onClick={() => setIsConfirmingDelete(false)}
                                    className="cc-button-secondary rounded-2xl px-5 py-3 text-sm"
                                >
                                    {currentCopy.cancel}
                                </button>
                            </div>
                        </div>
                    ) : null}
                </div>
            )}
        </article>
    );
}
