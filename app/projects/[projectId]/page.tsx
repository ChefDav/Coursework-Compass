"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import AppNav from "@/components/AppNav";
import CalendarDateField from "@/components/CalendarDateField";
import EmptyState from "@/components/EmptyState";
import ErrorNotice from "@/components/ErrorNotice";
import EstimatedTimeField, {
    normaliseEstimatedTime,
} from "@/components/EstimatedTimeField";
import TaskCard from "@/components/TaskCard";
import {
    addCustomTask,
    archiveCompletedTasks,
    deleteTask,
    getProjectRouteId,
    loadProjectPlans,
    updateProjectDetails,
    updateTaskDetails,
    updateTaskStatus,
    type CourseworkTask,
    type GeneratedProjectPlan,
    type TaskStatus,
} from "@/lib/localStorage";

type TaskPriority = "Low" | "Medium" | "High";

const priorityOptions: TaskPriority[] = ["Low", "Medium", "High"];

function getParamAsString(value: string | string[] | undefined) {
    if (Array.isArray(value)) {
        return value[0] || "";
    }

    return value || "";
}

function isTaskPriority(value: string): value is TaskPriority {
    return value === "Low" || value === "Medium" || value === "High";
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

function calculateProgress(tasks: CourseworkTask[]) {
    if (tasks.length === 0) {
        return 0;
    }

    const doneCount = tasks.filter((task) => task.status === "Done").length;
    return Math.round((doneCount / tasks.length) * 100);
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

function getDeadlineClasses(dateValue?: string) {
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

function getProjectStatus(progress: number) {
    if (progress >= 100) {
        return "Complete";
    }

    if (progress >= 60) {
        return "In progress";
    }

    return "Active";
}

function getStatusClasses(status: string) {
    if (status === "Complete") {
        return "border-emerald-400/30 bg-emerald-400/10 text-emerald-300";
    }

    if (status === "In progress") {
        return "border-cyan-400/30 bg-cyan-400/10 text-cyan-300";
    }

    return "border-amber-400/30 bg-amber-400/10 text-amber-300";
}

function repairTaskForDisplay(task: CourseworkTask) {
    return {
        ...task,
        priority: task.priority || "Medium",
        estimatedTime: getDisplayEstimatedTime(task.estimatedTime, task.priority),
    };
}

export default function ProjectDetailPage() {
    const params = useParams();
    const routeProjectId = getParamAsString(params.projectId);

    const [hasMounted, setHasMounted] = useState(false);
    const [projectPlans, setProjectPlans] = useState<GeneratedProjectPlan[]>([]);

    const [isEditingProject, setIsEditingProject] = useState(false);
    const [projectTitle, setProjectTitle] = useState("");
    const [projectDeadline, setProjectDeadline] = useState("");
    const [projectError, setProjectError] = useState("");

    const [newTaskTitle, setNewTaskTitle] = useState("");
    const [newTaskPriority, setNewTaskPriority] =
        useState<TaskPriority>("Medium");
    const [newTaskDueDate, setNewTaskDueDate] = useState("");
    const [newTaskEstimatedTime, setNewTaskEstimatedTime] = useState("45 min");
    const [newTaskError, setNewTaskError] = useState("");

    function refreshProjectPlans() {
        setProjectPlans(loadProjectPlans());
    }

    useEffect(() => {
        setHasMounted(true);
        setProjectPlans(loadProjectPlans());
    }, []);

    const projectInfo = useMemo(() => {
        if (!hasMounted) {
            return null;
        }

        const foundIndex = projectPlans.findIndex((plan, index) => {
            const projectRouteId = getProjectRouteId(plan, index);

            return (
                projectRouteId === routeProjectId ||
                plan.id === routeProjectId ||
                plan.slug === routeProjectId ||
                plan.projectId === routeProjectId ||
                plan.project.id === routeProjectId ||
                plan.project.slug === routeProjectId ||
                plan.project.projectId === routeProjectId
            );
        });

        if (foundIndex < 0) {
            return null;
        }

        return {
            plan: projectPlans[foundIndex],
            index: foundIndex,
            routeId: getProjectRouteId(projectPlans[foundIndex], foundIndex),
        };
    }, [hasMounted, projectPlans, routeProjectId]);

    useEffect(() => {
        if (!projectInfo) {
            return;
        }

        setProjectTitle(projectInfo.plan.project.title);
        setProjectDeadline(projectInfo.plan.project.deadline);
    }, [projectInfo]);

    if (!hasMounted) {
        return (
            <main className="min-h-screen bg-slate-950 text-white">
                <section className="mx-auto max-w-6xl px-4 py-6 sm:px-6 sm:py-8">
                    <AppNav />

                    <section className="rounded-[2rem] border border-cyan-400/30 bg-cyan-400/10 p-6 shadow-2xl shadow-cyan-950/20 sm:p-8">
                        <p className="mb-2 text-sm font-bold text-cyan-300">
                            Loading project
                        </p>
                        <h1 className="text-4xl font-black tracking-tight sm:text-5xl">
                            Preparing your project workspace.
                        </h1>
                        <p className="mt-4 max-w-3xl text-sm leading-6 text-slate-300">
                            Coursework Compass is loading the project saved in this browser.
                        </p>
                    </section>
                </section>
            </main>
        );
    }

    if (!projectInfo) {
        return (
            <main className="min-h-screen bg-slate-950 text-white">
                <section className="mx-auto max-w-6xl px-4 py-6 sm:px-6 sm:py-8">
                    <AppNav />

                    <EmptyState
                        eyebrow="Project not found"
                        title="This project is not saved here."
                        description="This project could not be found in this browser. It may have been deleted, reset, or saved in another browser or device."
                        icon="🗂️"
                        actions={[
                            {
                                label: "Back to projects",
                                href: "/projects",
                            },
                            {
                                label: "Create new project",
                                href: "/projects/new",
                                variant: "secondary",
                            },
                        ]}
                        tips={[
                            "The current beta stores project data locally in this browser.",
                            "If you reset local data, old project links will no longer open.",
                            "Create a new project to start a fresh saved plan.",
                            "Cloud sync is planned for a later version.",
                        ]}
                    />
                </section>
            </main>
        );
    }

    const projectPlan = projectInfo.plan;
    const projectRouteId = projectInfo.routeId;
    const repairedTasks = projectPlan.tasks.map(repairTaskForDisplay);

    const progress = calculateProgress(repairedTasks);
    const status = getProjectStatus(progress);
    const todoCount = repairedTasks.filter((task) => task.status !== "Done").length;
    const doneCount = repairedTasks.filter((task) => task.status === "Done").length;
    const completedTasksCount = repairedTasks.filter(
        (task) => task.status === "Done",
    ).length;

    function handleSaveProjectDetails() {
        const trimmedTitle = projectTitle.trim();

        if (!trimmedTitle) {
            setProjectError("Please enter a project title before saving.");
            return;
        }

        updateProjectDetails(projectRouteId, {
            title: trimmedTitle,
            deadline: projectDeadline,
        });

        setProjectError("");
        setIsEditingProject(false);
        refreshProjectPlans();
    }

    function handleUpdateTask(taskId: string, updates: Partial<CourseworkTask>) {
        updateTaskDetails(projectRouteId, taskId, updates);
        refreshProjectPlans();
    }

    function handleUpdateStatus(taskId: string, nextStatus: TaskStatus) {
        updateTaskStatus(projectRouteId, taskId, nextStatus);
        refreshProjectPlans();
    }

    function handleDeleteTask(taskId: string) {
        deleteTask(projectRouteId, taskId);
        refreshProjectPlans();
    }

    function handleAddCustomTask() {
        const trimmedTitle = newTaskTitle.trim();

        if (!trimmedTitle) {
            setNewTaskError("Please enter a task title before adding it.");
            return;
        }

        addCustomTask(projectRouteId, {
            title: trimmedTitle,
            status: "Todo",
            priority: newTaskPriority,
            dueDate: newTaskDueDate,
            estimatedTime: normaliseEstimatedTime(newTaskEstimatedTime),
        });

        setNewTaskTitle("");
        setNewTaskPriority("Medium");
        setNewTaskDueDate("");
        setNewTaskEstimatedTime("45 min");
        setNewTaskError("");
        refreshProjectPlans();
    }

    function handleArchiveCompletedTasks() {
        archiveCompletedTasks(projectRouteId);
        refreshProjectPlans();
    }

    return (
        <main className="min-h-screen bg-slate-950 text-white">
            <section className="mx-auto max-w-6xl px-4 py-6 sm:px-6 sm:py-8">
                <AppNav />

                <section className="mb-10 rounded-[2rem] border border-cyan-400/30 bg-cyan-400/10 p-5 shadow-2xl shadow-cyan-950/20 sm:p-8">
                    <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
                        <div className="min-w-0">
                            <p className="mb-2 text-sm font-bold text-cyan-300">
                                Project details
                            </p>

                            {isEditingProject ? (
                                <div className="space-y-4">
                                    <div>
                                        <label className="mb-2 block text-xs font-bold text-slate-300">
                                            Project title
                                        </label>
                                        <input
                                            type="text"
                                            value={projectTitle}
                                            onChange={(event) => {
                                                setProjectTitle(event.target.value);
                                                setProjectError("");
                                            }}
                                            className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm font-bold text-white outline-none transition focus:border-cyan-300"
                                        />
                                    </div>

                                    <CalendarDateField
                                        label="Project deadline"
                                        value={projectDeadline}
                                        onChange={setProjectDeadline}
                                    />

                                    {projectError ? (
                                        <ErrorNotice
                                            title="Project title required"
                                            message={projectError}
                                        />
                                    ) : null}

                                    <div className="flex flex-col gap-3 sm:flex-row">
                                        <button
                                            type="button"
                                            onClick={handleSaveProjectDetails}
                                            className="rounded-2xl bg-cyan-400 px-5 py-3 text-sm font-bold text-slate-950 transition hover:bg-cyan-300"
                                        >
                                            Save project details
                                        </button>

                                        <button
                                            type="button"
                                            onClick={() => {
                                                setProjectTitle(projectPlan.project.title);
                                                setProjectDeadline(projectPlan.project.deadline);
                                                setProjectError("");
                                                setIsEditingProject(false);
                                            }}
                                            className="rounded-2xl border border-slate-700 px-5 py-3 text-sm font-bold text-white transition hover:border-slate-400"
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <>
                                    <h1 className="text-4xl font-black tracking-tight sm:text-5xl">
                                        {projectPlan.project.title}
                                    </h1>

                                    <div className="mt-5 flex flex-wrap gap-2 text-xs font-bold">
                    <span className="rounded-full border border-slate-700 bg-slate-950/70 px-3 py-1 text-slate-300">
                      Deadline: {projectPlan.project.deadline || "Not set"}
                    </span>

                                        <span
                                            className={`rounded-full border px-3 py-1 ${getDeadlineClasses(
                                                projectPlan.project.deadline,
                                            )}`}
                                        >
                      {getDaysLeftLabel(projectPlan.project.deadline)}
                    </span>

                                        <span
                                            className={`rounded-full border px-3 py-1 ${getStatusClasses(
                                                status,
                                            )}`}
                                        >
                      {status}
                    </span>

                                        {projectPlan.archivedTaskCount ? (
                                            <span className="rounded-full border border-emerald-400/30 bg-emerald-400/10 px-3 py-1 text-emerald-300">
                        {projectPlan.archivedTaskCount} archived
                      </span>
                                        ) : null}
                                    </div>
                                </>
                            )}
                        </div>

                        {!isEditingProject ? (
                            <button
                                type="button"
                                onClick={() => setIsEditingProject(true)}
                                className="w-fit rounded-2xl border border-slate-700 px-5 py-3 text-sm font-bold text-white transition hover:border-cyan-400 hover:text-cyan-300"
                            >
                                Edit project
                            </button>
                        ) : null}
                    </div>

                    <div className="mt-8">
                        <div className="mb-3 flex items-center justify-between gap-4">
                            <p className="text-sm font-bold text-slate-300">
                                Project progress
                            </p>
                            <p className="text-sm font-black text-cyan-300">{progress}%</p>
                        </div>

                        <div className="h-4 overflow-hidden rounded-full bg-slate-800">
                            <div
                                className="h-full rounded-full bg-cyan-400 transition-all"
                                style={{ width: `${progress}%` }}
                            />
                        </div>

                        <div className="mt-4 grid gap-3 text-sm text-slate-400 sm:grid-cols-3">
                            <p>
                                <span className="font-bold text-slate-200">{todoCount}</span>{" "}
                                todo
                            </p>
                            <p>
                                <span className="font-bold text-slate-200">{doneCount}</span>{" "}
                                done
                            </p>
                            <p>
                <span className="font-bold text-slate-200">
                  {repairedTasks.length}
                </span>{" "}
                                total
                            </p>
                        </div>
                    </div>

                    {completedTasksCount > 0 ? (
                        <div className="mt-6 rounded-3xl border border-emerald-400/30 bg-emerald-400/10 p-4">
                            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                                <div>
                                    <p className="mb-1 text-sm font-bold text-emerald-300">
                                        Completed task cleanup
                                    </p>
                                    <p className="text-sm leading-6 text-slate-300">
                                        Archive completed tasks to keep this project focused on
                                        active work.
                                    </p>
                                </div>

                                <button
                                    type="button"
                                    onClick={handleArchiveCompletedTasks}
                                    className="rounded-2xl bg-emerald-400 px-5 py-3 text-sm font-bold text-slate-950 transition hover:bg-emerald-300"
                                >
                                    Archive completed tasks
                                </button>
                            </div>
                        </div>
                    ) : null}
                </section>

                <section className="mb-10 rounded-[2rem] border border-slate-800 bg-slate-900 p-5 sm:p-6">
                    <p className="mb-2 text-sm font-bold text-emerald-300">
                        Add custom task
                    </p>
                    <h2 className="text-3xl font-black tracking-tight">
                        Add work that belongs to this project.
                    </h2>
                    <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-300">
                        Use this when your real coursework changes, your teacher gives new
                        advice, or you need to add a task that the template did not include.
                    </p>

                    <div className="mt-6 grid gap-4">
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

                        <div className="grid gap-4 md:grid-cols-3">
                            <div>
                                <label className="mb-2 block text-xs font-bold text-slate-300">
                                    Priority
                                </label>
                                <select
                                    value={newTaskPriority}
                                    onChange={(event) => {
                                        if (!isTaskPriority(event.target.value)) {
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

                            <CalendarDateField
                                label="Due date"
                                value={newTaskDueDate}
                                onChange={setNewTaskDueDate}
                            />

                            <EstimatedTimeField
                                label="Estimated time"
                                value={newTaskEstimatedTime}
                                onChange={setNewTaskEstimatedTime}
                            />
                        </div>
                    </div>

                    {newTaskError ? (
                        <div className="mt-4">
                            <ErrorNotice title="Task title required" message={newTaskError} />
                        </div>
                    ) : null}

                    <button
                        type="button"
                        onClick={handleAddCustomTask}
                        className="mt-5 rounded-2xl bg-emerald-400 px-6 py-4 font-bold text-slate-950 transition hover:bg-emerald-300"
                    >
                        Add task
                    </button>
                </section>

                <section className="space-y-5">
                    <div className="mb-6">
                        <p className="mb-2 text-sm font-bold text-cyan-300">
                            Project tasks
                        </p>
                        <h2 className="text-3xl font-black tracking-tight">
                            Active task list.
                        </h2>
                    </div>

                    {repairedTasks.length === 0 ? (
                        <EmptyState
                            eyebrow="No active tasks"
                            title="This project has no active tasks right now."
                            description="You may have archived completed tasks, or this project may need new work. Add a custom task to continue planning."
                            icon="✨"
                            actions={[
                                {
                                    label: "Back to projects",
                                    href: "/projects",
                                },
                                {
                                    label: "Open Today",
                                    href: "/today",
                                    variant: "secondary",
                                },
                            ]}
                            tips={[
                                "Archived completed tasks stay out of the active workspace.",
                                "Adding new work can restore archived context when needed.",
                                "Use custom tasks for teacher feedback, corrections, or extra drafting.",
                                "Today will show active todo tasks from this project.",
                            ]}
                        />
                    ) : (
                        repairedTasks.map((task) => (
                            <TaskCard
                                key={task.id}
                                task={task}
                                onUpdateTask={handleUpdateTask}
                                onUpdateStatus={handleUpdateStatus}
                                onDeleteTask={handleDeleteTask}
                            />
                        ))
                    )}
                </section>
            </section>
        </main>
    );
}