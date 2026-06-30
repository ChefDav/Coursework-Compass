"use client";

import { useMemo, useState } from "react";
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
    useHasMounted,
    useProjectPlans,
    useStoredLanguage,
} from "@/lib/clientStores";
import {
    addCustomTask,
    archiveCompletedTasks,
    deleteTask,
    getProjectRouteId,
    updateProjectDetails,
    updateTaskDetails,
    updateTaskStatus,
    type CourseworkTask,
    type TaskStatus,
} from "@/lib/localStorage";
import type { Language } from "@/lib/i18n";

type TaskPriority = "Low" | "Medium" | "High";

const priorityOptions: TaskPriority[] = ["Low", "Medium", "High"];

const copy = {
    en: {
        loadingEyebrow: "Loading project",
        loadingTitle: "Preparing your project workspace.",
        loadingDescription:
            "Coursework Compass is loading the project saved in this browser.",
        projectDetails: "Project details",
        projectTitle: "Project title",
        projectDeadline: "Project deadline",
        saveProjectDetails: "Save project details",
        cancel: "Cancel",
        editProject: "Edit project",
        deadline: "Deadline",
        notSet: "Not set",
        projectType: "Project type",
        courseworkProject: "Coursework project",
        archived: "archived",
        projectProgress: "Project progress",
        todo: "todo",
        done: "done",
        total: "total",
        active: "Active",
        inProgress: "In progress",
        complete: "Complete",
        completedTaskCleanup: "Completed task cleanup",
        cleanupDescription:
            "Archive completed tasks to keep this project focused on active work.",
        archiveCompletedTasks: "Archive completed tasks",
        addCustomTask: "Add custom task",
        addCustomTaskTitle: "Add work that belongs to this project.",
        addCustomTaskDescription:
            "Use this when your real coursework changes, your teacher gives new advice, or you need to add a task that the template did not include.",
        taskTitle: "Task title",
        taskTitlePlaceholder: "e.g. Ask teacher for feedback",
        priority: "Priority",
        dueDate: "Due date",
        estimatedTime: "Estimated time",
        addTask: "Add task",
        projectTasks: "Project tasks",
        activeTaskList: "Active task list.",
        noActiveTasksDescription:
            "You may have archived completed tasks, or this project may need new work. Add a custom task to continue planning.",
        backToProjects: "Back to projects",
        createNewProject: "Create new project",
        openToday: "Open Today",
        projectNotFound: "Project not found",
        projectNotSavedHere: "This project is not saved here.",
        projectNotSavedHereDescription:
            "This project could not be found in this browser. It may have been deleted, reset, or saved in another browser or device.",
        emptyTaskEyebrow: "No active tasks",
        emptyTaskTitle: "This project has no active tasks right now.",
        titleRequired: "Project title required",
        taskTitleRequired: "Task title required",
        projectTitleError: "Please enter a project title before saving.",
        taskTitleError: "Please enter a task title before adding it.",
        dueToday: "Due today",
        dayLeft: "day left",
        daysLeft: "days left",
        overdue: "overdue",
        unknownDays: "Days left: unknown",
        low: "Low",
        medium: "Medium",
        high: "High",
        notFoundTips: [
            "The current beta stores project data locally in this browser.",
            "If you reset local data, old project links will no longer open.",
            "Create a new project to start a fresh saved plan.",
            "Cloud sync is planned for a later version.",
        ],
        emptyTaskTips: [
            "Archived completed tasks stay out of the active workspace.",
            "Adding new work can restore archived context when needed.",
            "Use custom tasks for teacher feedback, corrections, or extra drafting.",
            "Today will show active todo tasks from this project.",
        ],
    },
    zh: {
        loadingEyebrow: "正在加载项目",
        loadingTitle: "正在准备你的项目工作区。",
        loadingDescription:
            "Coursework Compass 正在读取保存在当前浏览器中的项目。",
        projectDetails: "项目详情",
        projectTitle: "项目标题",
        projectDeadline: "项目截止日期",
        saveProjectDetails: "保存项目详情",
        cancel: "取消",
        editProject: "编辑项目",
        deadline: "截止日期",
        notSet: "未设置",
        projectType: "项目类型",
        courseworkProject: "Coursework 项目",
        archived: "已归档",
        projectProgress: "项目进度",
        todo: "待办",
        done: "已完成",
        total: "总任务",
        active: "活跃",
        inProgress: "进行中",
        complete: "完成",
        completedTaskCleanup: "已完成任务整理",
        cleanupDescription:
            "归档已完成任务，让这个项目继续专注于还需要推进的工作。",
        archiveCompletedTasks: "归档已完成任务",
        addCustomTask: "添加自定义任务",
        addCustomTaskTitle: "添加这个项目真正需要的工作。",
        addCustomTaskDescription:
            "当真实 coursework 有变化、老师给出新建议，或模板没有覆盖某个任务时，可以在这里添加。",
        taskTitle: "任务标题",
        taskTitlePlaceholder: "例如：请老师给反馈",
        priority: "优先级",
        dueDate: "任务日期",
        estimatedTime: "预计用时",
        addTask: "添加任务",
        projectTasks: "项目任务",
        activeTaskList: "活跃任务列表。",
        noActiveTasksDescription:
            "你可能已经归档了已完成任务，或者这个项目需要新的工作。添加自定义任务即可继续规划。",
        backToProjects: "返回项目列表",
        createNewProject: "创建新项目",
        openToday: "打开今日任务",
        projectNotFound: "未找到项目",
        projectNotSavedHere: "这个项目没有保存在当前浏览器中。",
        projectNotSavedHereDescription:
            "当前浏览器中找不到这个项目。它可能已被删除、重置，或保存在另一台设备/另一个浏览器中。",
        emptyTaskEyebrow: "暂无活跃任务",
        emptyTaskTitle: "这个项目目前没有活跃任务。",
        titleRequired: "需要填写项目标题",
        taskTitleRequired: "需要填写任务标题",
        projectTitleError: "请先输入项目标题，再保存。",
        taskTitleError: "请先输入任务标题，再添加任务。",
        dueToday: "今天截止",
        dayLeft: "天剩余",
        daysLeft: "天剩余",
        overdue: "已逾期",
        unknownDays: "剩余天数：未知",
        low: "低",
        medium: "中",
        high: "高",
        notFoundTips: [
            "当前 beta 版本会把项目数据保存在这个浏览器中。",
            "如果你重置本地数据，旧项目链接将无法再打开。",
            "可以创建一个新项目，开始新的保存计划。",
            "云端同步会在后续版本中规划。",
        ],
        emptyTaskTips: [
            "已归档的完成任务会离开活跃工作区。",
            "添加新工作时，可以在需要时恢复归档任务背景。",
            "自定义任务适合记录老师反馈、修改和额外草稿工作。",
            "今日任务页会显示这个项目中的活跃待办任务。",
        ],
    },
} as const;

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

function formatDate(dateValue: string | undefined, language: Language) {
    const date = parseDateValue(dateValue);

    if (!date) {
        return copy[language].notSet;
    }

    return new Intl.DateTimeFormat(language === "zh" ? "zh-CN" : "en-GB", {
        year: "numeric",
        month: "short",
        day: "numeric",
    }).format(date);
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

function getProjectStatusLabel(status: string, language: Language) {
    const currentCopy = copy[language];

    if (status === "Complete") {
        return currentCopy.complete;
    }

    if (status === "In progress") {
        return currentCopy.inProgress;
    }

    return currentCopy.active;
}

function getPriorityLabel(priority: TaskPriority, language: Language) {
    const currentCopy = copy[language];

    if (priority === "High") {
        return currentCopy.high;
    }

    if (priority === "Low") {
        return currentCopy.low;
    }

    return currentCopy.medium;
}

function isTaskArchived(task: CourseworkTask) {
    const compatibilityTask = task as CourseworkTask & {
        archived?: boolean;
        archivedAt?: string;
    };

    return compatibilityTask.archived === true || Boolean(compatibilityTask.archivedAt);
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

    const hasMounted = useHasMounted();
    const projectPlans = useProjectPlans();
    const language = useStoredLanguage();
    const currentCopy = copy[language];

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

    if (!hasMounted) {
        return (
            <main className="min-h-screen bg-slate-950 text-white">
                <section className="mx-auto max-w-6xl px-4 py-6 sm:px-6 sm:py-8">
                    <AppNav />

                    <section className="rounded-[2rem] border border-cyan-400/30 bg-cyan-400/10 p-6 shadow-2xl shadow-cyan-950/20 sm:p-8">
                        <p className="mb-2 text-sm font-bold text-cyan-300">
                            {currentCopy.loadingEyebrow}
                        </p>
                        <h1 className="text-4xl font-black tracking-tight sm:text-5xl">
                            {currentCopy.loadingTitle}
                        </h1>
                        <p className="mt-4 max-w-3xl text-sm leading-6 text-slate-300">
                            {currentCopy.loadingDescription}
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
                        eyebrow={currentCopy.projectNotFound}
                        title={currentCopy.projectNotSavedHere}
                        description={currentCopy.projectNotSavedHereDescription}
                        icon="🗂️"
                        actions={[
                            {
                                label: currentCopy.backToProjects,
                                href: "/projects",
                            },
                            {
                                label: currentCopy.createNewProject,
                                href: "/projects/new",
                                variant: "secondary",
                            },
                        ]}
                        tips={[...currentCopy.notFoundTips]}
                    />
                </section>
            </main>
        );
    }

    const projectPlan = projectInfo.plan;
    const projectRouteId = projectInfo.routeId;
    const activeProjectTasks = projectPlan.tasks.filter(
        (task) => !isTaskArchived(task),
    );
    const repairedTasks = activeProjectTasks.map(repairTaskForDisplay);

    const progress = calculateProgress(repairedTasks);
    const status = getProjectStatus(progress);
    const todoCount = repairedTasks.filter((task) => task.status !== "Done").length;
    const doneCount = repairedTasks.filter((task) => task.status === "Done").length;
    const completedTasksCount = repairedTasks.filter(
        (task) => task.status === "Done",
    ).length;
    const archivedCompatibilityCount = projectPlan.tasks.filter(isTaskArchived).length;
    const archivedTaskCount =
        (projectPlan.archivedTaskCount ?? projectPlan.archivedTasks?.length ?? 0) +
        archivedCompatibilityCount;
    const projectTypeDisplay =
        projectPlan.project.courseworkType ||
        projectPlan.project.subject ||
        currentCopy.courseworkProject;

    function handleSaveProjectDetails() {
        const trimmedTitle = projectTitle.trim();

        if (!trimmedTitle) {
            setProjectError(currentCopy.projectTitleError);
            return;
        }

        updateProjectDetails(projectRouteId, {
            title: trimmedTitle,
            deadline: projectDeadline,
        });

        setProjectError("");
        setIsEditingProject(false);
    }

    function handleUpdateTask(taskId: string, updates: Partial<CourseworkTask>) {
        updateTaskDetails(projectRouteId, taskId, updates);
    }

    function handleUpdateStatus(taskId: string, nextStatus: TaskStatus) {
        updateTaskStatus(projectRouteId, taskId, nextStatus);
    }

    function handleDeleteTask(taskId: string) {
        deleteTask(projectRouteId, taskId);
    }

    function handleAddCustomTask() {
        const trimmedTitle = newTaskTitle.trim();

        if (!trimmedTitle) {
            setNewTaskError(currentCopy.taskTitleError);
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
    }

    function handleArchiveCompletedTasks() {
        archiveCompletedTasks(projectRouteId);
    }

    return (
        <main className="min-h-screen bg-slate-950 text-white">
            <section className="mx-auto max-w-6xl px-4 py-6 sm:px-6 sm:py-8">
                <AppNav />

                <section className="mb-10 rounded-[2rem] border border-cyan-400/30 bg-cyan-400/10 p-5 shadow-2xl shadow-cyan-950/20 sm:p-8">
                    <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
                        <div className="min-w-0">
                            <p className="mb-2 text-sm font-bold text-cyan-300">
                                {currentCopy.projectDetails}
                            </p>

                            {isEditingProject ? (
                                <div className="space-y-4">
                                    <div>
                                        <label className="mb-2 block text-xs font-bold text-slate-300">
                                            {currentCopy.projectTitle}
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
                                        label={currentCopy.projectDeadline}
                                        value={projectDeadline}
                                        onChange={setProjectDeadline}
                                    />

                                    {projectError ? (
                                        <ErrorNotice
                                            title={currentCopy.titleRequired}
                                            message={projectError}
                                        />
                                    ) : null}

                                    <div className="flex flex-col gap-3 sm:flex-row">
                                        <button
                                            type="button"
                                            onClick={handleSaveProjectDetails}
                                            className="rounded-2xl bg-cyan-400 px-5 py-3 text-sm font-bold text-slate-950 transition hover:bg-cyan-300"
                                        >
                                            {currentCopy.saveProjectDetails}
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
                                            {currentCopy.cancel}
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
                      {currentCopy.deadline}: {formatDate(projectPlan.project.deadline, language)}
                    </span>

                                        <span className="rounded-full border border-slate-700 bg-slate-950/70 px-3 py-1 text-slate-300">
                      {currentCopy.projectType}: {projectTypeDisplay}
                    </span>

                                        <span
                                            className={`rounded-full border px-3 py-1 ${getDeadlineClasses(
                                                projectPlan.project.deadline,
                                            )}`}
                                        >
                      {getDaysLeftLabel(projectPlan.project.deadline, language)}
                    </span>

                                        <span
                                            className={`rounded-full border px-3 py-1 ${getStatusClasses(
                                                status,
                                            )}`}
                                        >
                      {getProjectStatusLabel(status, language)}
                    </span>

                                        {archivedTaskCount ? (
                                            <span className="rounded-full border border-emerald-400/30 bg-emerald-400/10 px-3 py-1 text-emerald-300">
                        {archivedTaskCount} {currentCopy.archived}
                      </span>
                                        ) : null}
                                    </div>
                                </>
                            )}
                        </div>

                        {!isEditingProject ? (
                            <button
                                type="button"
                                onClick={() => {
                                    setProjectTitle(projectPlan.project.title);
                                    setProjectDeadline(projectPlan.project.deadline);
                                    setIsEditingProject(true);
                                }}
                                className="w-fit rounded-2xl border border-slate-700 px-5 py-3 text-sm font-bold text-white transition hover:border-cyan-400 hover:text-cyan-300"
                            >
                                {currentCopy.editProject}
                            </button>
                        ) : null}
                    </div>

                    <div className="mt-8">
                        <div className="mb-3 flex items-center justify-between gap-4">
                            <p className="text-sm font-bold text-slate-300">
                                {currentCopy.projectProgress}
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
                                {currentCopy.todo}
                            </p>
                            <p>
                                <span className="font-bold text-slate-200">{doneCount}</span>{" "}
                                {currentCopy.done}
                            </p>
                            <p>
                <span className="font-bold text-slate-200">
                  {repairedTasks.length}
                </span>{" "}
                                {currentCopy.total}
                            </p>
                        </div>
                    </div>

                    {completedTasksCount > 0 ? (
                        <div className="mt-6 rounded-3xl border border-emerald-400/30 bg-emerald-400/10 p-4">
                            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                                <div>
                                    <p className="mb-1 text-sm font-bold text-emerald-300">
                                        {currentCopy.completedTaskCleanup}
                                    </p>
                                    <p className="text-sm leading-6 text-slate-300">
                                        {currentCopy.cleanupDescription}
                                    </p>
                                </div>

                                <button
                                    type="button"
                                    onClick={handleArchiveCompletedTasks}
                                    className="rounded-2xl bg-emerald-400 px-5 py-3 text-sm font-bold text-slate-950 transition hover:bg-emerald-300"
                                >
                                    {currentCopy.archiveCompletedTasks}
                                </button>
                            </div>
                        </div>
                    ) : null}
                </section>

                <section className="mb-10 rounded-[2rem] border border-slate-800 bg-slate-900 p-5 sm:p-6">
                    <p className="mb-2 text-sm font-bold text-emerald-300">
                        {currentCopy.addCustomTask}
                    </p>
                    <h2 className="text-3xl font-black tracking-tight">
                        {currentCopy.addCustomTaskTitle}
                    </h2>
                    <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-300">
                        {currentCopy.addCustomTaskDescription}
                    </p>

                    <div className="mt-6 grid gap-4">
                        <div>
                            <label className="mb-2 block text-xs font-bold text-slate-300">
                                {currentCopy.taskTitle}
                            </label>
                            <input
                                type="text"
                                value={newTaskTitle}
                                onChange={(event) => {
                                    setNewTaskTitle(event.target.value);
                                    setNewTaskError("");
                                }}
                                placeholder={currentCopy.taskTitlePlaceholder}
                                className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm font-bold text-white outline-none transition placeholder:text-slate-500 focus:border-emerald-300"
                            />
                        </div>

                        <div className="grid gap-4 md:grid-cols-3">
                            <div>
                                <label className="mb-2 block text-xs font-bold text-slate-300">
                                    {currentCopy.priority}
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
                                            {getPriorityLabel(priority, language)}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <CalendarDateField
                                label={currentCopy.dueDate}
                                value={newTaskDueDate}
                                onChange={setNewTaskDueDate}
                            />

                            <EstimatedTimeField
                                label={currentCopy.estimatedTime}
                                value={newTaskEstimatedTime}
                                onChange={setNewTaskEstimatedTime}
                            />
                        </div>
                    </div>

                    {newTaskError ? (
                        <div className="mt-4">
                            <ErrorNotice
                                title={currentCopy.taskTitleRequired}
                                message={newTaskError}
                            />
                        </div>
                    ) : null}

                    <button
                        type="button"
                        onClick={handleAddCustomTask}
                        className="mt-5 rounded-2xl bg-emerald-400 px-6 py-4 font-bold text-slate-950 transition hover:bg-emerald-300"
                    >
                        {currentCopy.addTask}
                    </button>
                </section>

                <section className="space-y-5">
                    <div className="mb-6">
                        <p className="mb-2 text-sm font-bold text-cyan-300">
                            {currentCopy.projectTasks}
                        </p>
                        <h2 className="text-3xl font-black tracking-tight">
                            {currentCopy.activeTaskList}
                        </h2>
                    </div>

                    {repairedTasks.length === 0 ? (
                        <EmptyState
                            eyebrow={currentCopy.emptyTaskEyebrow}
                            title={currentCopy.emptyTaskTitle}
                            description={currentCopy.noActiveTasksDescription}
                            icon="✨"
                            actions={[
                                {
                                    label: currentCopy.backToProjects,
                                    href: "/projects",
                                },
                                {
                                    label: currentCopy.openToday,
                                    href: "/today",
                                    variant: "secondary",
                                },
                            ]}
                            tips={[...currentCopy.emptyTaskTips]}
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
