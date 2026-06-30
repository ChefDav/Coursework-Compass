export type TaskStatus = "Todo" | "Done";

export type CourseworkTask = {
    id: string;
    title: string;
    description?: string;
    status: TaskStatus;
    priority?: string;
    dueDate?: string;
    estimatedTime?: string;
    completedAt?: string;
    archivedAt?: string;
  archived?: boolean;
};

type LegacyTaskInput = Partial<CourseworkTask> & {
    time?: string | number | null;
    duration?: string | number | null;
    estimate?: string | number | null;
    estimated?: string | number | null;
    timeEstimate?: string | number | null;
    estimated_time?: string | number | null;
    estimatedMinutes?: string | number | null;
    minutes?: string | number | null;
};

export type GeneratedProjectPlan = {
    id: string;
    slug?: string;
    projectId?: string;
    createdAt?: string;
    updatedAt?: string;
    completionPromptDismissed?: boolean;
    project: {
        id?: string;
        slug?: string;
        projectId?: string;
        title: string;
        deadline: string;
        status?: string;
        type?: string;
        courseworkType?: string;
        subject?: string;
    };
    tasks: CourseworkTask[];
    archivedTasks?: CourseworkTask[];
    archivedTaskCount?: number;
};

type SaveSuccessOptions = {
    title?: string;
    message: string;
    actionLabel?: string;
    actionHref?: string;
};

const PRIMARY_PROJECT_STORAGE_KEY = "coursework-compass-projects";

export const PROJECT_STORAGE_KEYS = [
    PRIMARY_PROJECT_STORAGE_KEY,
    "coursework-compass-plans",
    "coursework-compass-project-plans",
    "courseworkCompassProjects",
    "courseworkCompassProjectPlans",
    "generatedProjectPlans",
    "projectPlans",
];

const SAVE_SUCCESS_EVENT_NAME = "coursework-compass-save-success";
const PROJECT_PLAN_UPDATE_EVENT_NAME =
    "coursework-compass-project-plans-updated";

function isBrowser() {
    return typeof window !== "undefined";
}

function dispatchSaveSuccess(options: SaveSuccessOptions) {
    if (!isBrowser()) {
        return;
    }

    window.dispatchEvent(
        new CustomEvent(SAVE_SUCCESS_EVENT_NAME, {
            detail: options,
        }),
    );
}

function dispatchProjectPlanUpdate() {
    if (!isBrowser()) {
        return;
    }

    window.dispatchEvent(new CustomEvent(PROJECT_PLAN_UPDATE_EVENT_NAME));
}

function createId(prefix: string) {
    return `${prefix}-${Date.now().toString(36)}-${Math.random()
        .toString(36)
        .slice(2, 8)}`;
}

function slugifyTitle(title: string) {
    return title
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");
}

function stringifyTimeValue(value: string | number | null | undefined) {
    if (typeof value === "number") {
        return String(value);
    }

    if (typeof value === "string") {
        return value;
    }

    return "";
}

function removeTrailingZero(value: number) {
    if (Number.isInteger(value)) {
        return String(value);
    }

    return String(Number(value.toFixed(2)));
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

function normaliseEstimatedTimeValue(
    value: string | number | null | undefined,
    priority?: string,
    repairMissing = true,
) {
    const rawValue = stringifyTimeValue(value).trim();
    const lowerValue = rawValue.toLowerCase();

    if (!rawValue || lowerValue === "not set") {
        return repairMissing ? getDefaultEstimatedTime(priority) : "Not set";
    }

    const numberMatch = lowerValue.match(/[\d.]+/);
    const amount = numberMatch ? Number(numberMatch[0]) : NaN;

    if (!Number.isFinite(amount) || amount <= 0) {
        return repairMissing ? getDefaultEstimatedTime(priority) : "Not set";
    }

    const isDays =
        lowerValue.includes("day") ||
        lowerValue.includes("days") ||
        lowerValue.endsWith(" d");

    const isHours =
        lowerValue.includes("hour") ||
        lowerValue.includes("hours") ||
        lowerValue.includes("hr") ||
        lowerValue.includes("hrs") ||
        lowerValue.endsWith(" h");

    if (isDays) {
        return `${removeTrailingZero(amount)} ${amount === 1 ? "day" : "days"}`;
    }

    if (isHours) {
        if (amount >= 24) {
            const days = amount / 24;
            return `${removeTrailingZero(days)} ${days === 1 ? "day" : "days"}`;
        }

        return `${removeTrailingZero(amount)} ${amount === 1 ? "hour" : "hours"}`;
    }

    if (amount >= 1440) {
        const days = amount / 1440;
        return `${removeTrailingZero(days)} ${days === 1 ? "day" : "days"}`;
    }

    if (amount >= 60) {
        const hours = amount / 60;
        return `${removeTrailingZero(hours)} ${hours === 1 ? "hour" : "hours"}`;
    }

    return `${removeTrailingZero(amount)} min`;
}

function getLegacyEstimatedTime(rawTask: LegacyTaskInput) {
    if (rawTask.estimatedTime !== undefined && rawTask.estimatedTime !== null) {
        return rawTask.estimatedTime;
    }

    if (rawTask.time !== undefined && rawTask.time !== null) {
        return rawTask.time;
    }

    if (rawTask.duration !== undefined && rawTask.duration !== null) {
        return rawTask.duration;
    }

    if (rawTask.timeEstimate !== undefined && rawTask.timeEstimate !== null) {
        return rawTask.timeEstimate;
    }

    if (rawTask.estimate !== undefined && rawTask.estimate !== null) {
        return rawTask.estimate;
    }

    if (rawTask.estimated !== undefined && rawTask.estimated !== null) {
        return rawTask.estimated;
    }

    if (rawTask.estimated_time !== undefined && rawTask.estimated_time !== null) {
        return rawTask.estimated_time;
    }

    if (
        rawTask.estimatedMinutes !== undefined &&
        rawTask.estimatedMinutes !== null
    ) {
        return `${rawTask.estimatedMinutes} min`;
    }

    if (rawTask.minutes !== undefined && rawTask.minutes !== null) {
        return `${rawTask.minutes} min`;
    }

    return "";
}

function getRawProjectRouteId(plan: Partial<GeneratedProjectPlan>, index = 0) {
    const project =
        plan.project ??
        ({
            title: "",
            deadline: "",
        } as GeneratedProjectPlan["project"]);

    return (
        plan.id ||
        plan.slug ||
        plan.projectId ||
        project.id ||
        project.slug ||
        project.projectId ||
        slugifyTitle(project.title || "") ||
        `project-${index}`
    );
}

export function getProjectRouteId(plan: GeneratedProjectPlan, index = 0) {
    return getRawProjectRouteId(plan, index);
}

function normaliseTask(rawTask: LegacyTaskInput, index: number) {
    const priority = rawTask.priority || "Medium";
    const legacyEstimatedTime = getLegacyEstimatedTime(rawTask);

    return {
        id: rawTask.id || createId(`task-${index}`),
        title: rawTask.title || "Untitled task",
        description: rawTask.description,
        status:
            String(rawTask.status).toLowerCase() === "done" ? "Done" : "Todo",
        priority,
        dueDate: rawTask.dueDate || "",
        estimatedTime: normaliseEstimatedTimeValue(
            legacyEstimatedTime,
            priority,
            true,
        ),
        completedAt: rawTask.completedAt,
        archivedAt: rawTask.archivedAt,
    } satisfies CourseworkTask;
}

function normaliseProjectPlan(
    rawPlan: Partial<GeneratedProjectPlan>,
    index: number,
) {
    const rawProject =
        rawPlan.project ??
        ({
            title: "Untitled project",
            deadline: "",
        } as GeneratedProjectPlan["project"]);

    const projectTitle = rawProject.title || "Untitled project";
    const projectDeadline = rawProject.deadline || "";

    const routeId = getRawProjectRouteId(
        {
            ...rawPlan,
            project: {
                ...rawProject,
                title: projectTitle,
                deadline: projectDeadline,
            },
        },
        index,
    );

    const tasks = Array.isArray(rawPlan.tasks)
        ? rawPlan.tasks.map((task, taskIndex) =>
            normaliseTask(task as LegacyTaskInput, taskIndex),
        )
        : [];

    const archivedTasks = Array.isArray(rawPlan.archivedTasks)
        ? rawPlan.archivedTasks.map((task, taskIndex) =>
            normaliseTask(task as LegacyTaskInput, taskIndex),
        )
        : [];

    return {
        id: routeId,
        slug: rawPlan.slug,
        projectId: rawPlan.projectId,
        createdAt: rawPlan.createdAt || new Date().toISOString(),
        updatedAt: rawPlan.updatedAt || new Date().toISOString(),
        completionPromptDismissed: rawPlan.completionPromptDismissed || false,
        project: {
            id: rawProject.id,
            slug: rawProject.slug,
            projectId: rawProject.projectId,
            title: projectTitle,
            deadline: projectDeadline,
            status: rawProject.status || "Active",
            type:
                rawProject.type ||
                rawProject.courseworkType ||
                rawProject.subject ||
                "",
            courseworkType: rawProject.courseworkType,
            subject: rawProject.subject,
        },
        tasks,
        archivedTasks,
        archivedTaskCount:
            typeof rawPlan.archivedTaskCount === "number"
                ? rawPlan.archivedTaskCount
                : archivedTasks.length,
    } satisfies GeneratedProjectPlan;
}

function parseStorageValue(value: string | null) {
    if (!value) {
        return [];
    }

    try {
        const parsedValue = JSON.parse(value);

        if (Array.isArray(parsedValue)) {
            return parsedValue;
        }

        if (parsedValue && Array.isArray(parsedValue.projectPlans)) {
            return parsedValue.projectPlans;
        }

        if (parsedValue && Array.isArray(parsedValue.projects)) {
            return parsedValue.projects;
        }

        if (parsedValue && parsedValue.project && Array.isArray(parsedValue.tasks)) {
            return [parsedValue];
        }

        return [];
    } catch {
        return [];
    }
}

function removeLegacyProjectStorageKeys() {
    if (!isBrowser()) {
        return;
    }

    PROJECT_STORAGE_KEYS.forEach((key) => {
        if (key !== PRIMARY_PROJECT_STORAGE_KEY) {
            window.localStorage.removeItem(key);
        }
    });
}

function readRawProjectPlans() {
    if (!isBrowser()) {
        return [];
    }

    const rawPlans: unknown[] = [];

    PROJECT_STORAGE_KEYS.forEach((key) => {
        rawPlans.push(...parseStorageValue(window.localStorage.getItem(key)));
    });

    return rawPlans;
}

function safeSetPrimaryProjectStorage(serialisedPlans: string) {
    if (!isBrowser()) {
        return false;
    }

    removeLegacyProjectStorageKeys();

    try {
        window.localStorage.setItem(PRIMARY_PROJECT_STORAGE_KEY, serialisedPlans);
        return true;
    } catch {
        try {
            removeLegacyProjectStorageKeys();
            window.localStorage.removeItem(PRIMARY_PROJECT_STORAGE_KEY);
            window.localStorage.setItem(PRIMARY_PROJECT_STORAGE_KEY, serialisedPlans);
            return true;
        } catch {
            dispatchSaveSuccess({
                title: "Local storage is full",
                message:
                    "Your browser storage is full. Please use Reset data if this is only test data, then create a smaller test project.",
            });

            return false;
        }
    }
}

function persistProjectPlansSilently(
    projectPlans: GeneratedProjectPlan[],
    shouldDispatch = false,
) {
    if (!isBrowser()) {
        return;
    }

    const serialisedPlans = JSON.stringify(projectPlans);
    const didSave = safeSetPrimaryProjectStorage(serialisedPlans);

    if (didSave && shouldDispatch) {
        dispatchProjectPlanUpdate();
    }
}

function persistProjectPlans(
    projectPlans: GeneratedProjectPlan[],
    saveSuccessOptions?: SaveSuccessOptions,
) {
    const normalisedPlans = projectPlans.map((plan, index) => ({
        ...normaliseProjectPlan(plan, index),
        updatedAt: plan.updatedAt || new Date().toISOString(),
    }));

    const serialisedPlans = JSON.stringify(normalisedPlans);
    const didSave = safeSetPrimaryProjectStorage(serialisedPlans);

    if (didSave) {
        dispatchProjectPlanUpdate();

        if (saveSuccessOptions) {
            dispatchSaveSuccess(saveSuccessOptions);
        }
    }

    return normalisedPlans;
}

function findPlanIndexByProjectId(
    projectPlans: GeneratedProjectPlan[],
    projectId: string,
) {
    return projectPlans.findIndex((plan, index) => {
        const routeId = getProjectRouteId(plan, index);

        return (
            routeId === projectId ||
            plan.id === projectId ||
            plan.slug === projectId ||
            plan.projectId === projectId ||
            plan.project.id === projectId ||
            plan.project.slug === projectId ||
            plan.project.projectId === projectId ||
            slugifyTitle(plan.project.title) === projectId
        );
    });
}

function restoreArchivedTasksForNewWork(plan: GeneratedProjectPlan) {
    const archivedTasks = plan.archivedTasks ?? [];

    if (archivedTasks.length === 0) {
        return plan;
    }

    return {
        ...plan,
        tasks: [
            ...plan.tasks,
            ...archivedTasks.map((task) => ({
                ...task,
                archivedAt: undefined,
            })),
        ],
        archivedTasks: [],
        archivedTaskCount: 0,
        completionPromptDismissed: false,
        project: {
            ...plan.project,
            status: "Active",
        },
    } satisfies GeneratedProjectPlan;
}

export function loadProjectPlans() {
    const rawPlans = readRawProjectPlans();
    const planMap = new Map<string, GeneratedProjectPlan>();

    rawPlans.forEach((rawPlan, index) => {
        const normalisedPlan = normaliseProjectPlan(
            rawPlan as Partial<GeneratedProjectPlan>,
            index,
        );

        let routeId = getProjectRouteId(normalisedPlan, index);

        if (planMap.has(routeId)) {
            routeId = `${routeId}-${index}`;
            normalisedPlan.id = routeId;
        }

        planMap.set(routeId, normalisedPlan);
    });

    const normalisedPlans = Array.from(planMap.values());

    if (normalisedPlans.length > 0) {
        persistProjectPlansSilently(normalisedPlans, false);
    } else if (isBrowser()) {
        removeLegacyProjectStorageKeys();
    }

    return normalisedPlans;
}

export function saveProjectPlans(
    projectPlans: GeneratedProjectPlan[],
    message = "Changes saved locally in this browser.",
) {
    return persistProjectPlans(projectPlans, {
        title: "Saved successfully",
        message,
    });
}

export function saveProjectPlan(projectPlan: Partial<GeneratedProjectPlan>) {
    const existingPlans = loadProjectPlans();
    const normalisedPlan = normaliseProjectPlan(projectPlan, existingPlans.length);
    const projectIndex = findPlanIndexByProjectId(existingPlans, normalisedPlan.id);

    let nextPlans: GeneratedProjectPlan[];

    if (projectIndex >= 0) {
        nextPlans = existingPlans.map((plan, index) =>
            index === projectIndex
                ? {
                    ...normalisedPlan,
                    updatedAt: new Date().toISOString(),
                }
                : plan,
        );
    } else {
        nextPlans = [
            ...existingPlans,
            {
                ...normalisedPlan,
                updatedAt: new Date().toISOString(),
            },
        ];
    }

    return persistProjectPlans(nextPlans, {
        title: "Project saved locally",
        message:
            "Your coursework plan is saved in this browser. You can now view it in Dashboard, Projects, or Today.",
        actionLabel: "Open dashboard",
        actionHref: "/dashboard",
    });
}

export const saveGeneratedProjectPlan = saveProjectPlan;
export const addProjectPlan = saveProjectPlan;

export function findProjectPlan(projectId: string) {
    const projectPlans = loadProjectPlans();
    const projectIndex = findPlanIndexByProjectId(projectPlans, projectId);

    if (projectIndex < 0) {
        return null;
    }

    return projectPlans[projectIndex];
}

export function deleteProjectPlan(projectId: string) {
    const projectPlans = loadProjectPlans();
    const projectIndex = findPlanIndexByProjectId(projectPlans, projectId);

    if (projectIndex < 0) {
        return projectPlans;
    }

    const deletedProjectTitle = projectPlans[projectIndex].project.title;
    const nextPlans = projectPlans.filter((_, index) => index !== projectIndex);

    return persistProjectPlans(nextPlans, {
        title: "Project deleted",
        message: `"${deletedProjectTitle}" has been removed from this browser.`,
        actionLabel: "View projects",
        actionHref: "/projects",
    });
}

export function clearProjectPlans() {
    if (!isBrowser()) {
        return;
    }

    PROJECT_STORAGE_KEYS.forEach((key) => {
        window.localStorage.removeItem(key);
    });

    removeLegacyProjectStorageKeys();
    dispatchProjectPlanUpdate();

    dispatchSaveSuccess({
        title: "Local data reset",
        message:
            "All local Coursework Compass projects have been removed from this browser.",
    });
}

export function updateProjectDetails(
    projectId: string,
    updates: Partial<GeneratedProjectPlan["project"]>,
) {
    const projectPlans = loadProjectPlans();
    const projectIndex = findPlanIndexByProjectId(projectPlans, projectId);

    if (projectIndex < 0) {
        return projectPlans;
    }

    const nextPlans = projectPlans.map((plan, index) => {
        if (index !== projectIndex) {
            return plan;
        }

        return {
            ...plan,
            updatedAt: new Date().toISOString(),
            completionPromptDismissed: false,
            project: {
                ...plan.project,
                ...updates,
            },
        };
    });

    return persistProjectPlans(nextPlans, {
        title: "Project details saved",
        message: "Your project title, deadline, or settings have been updated.",
    });
}

export function addCustomTask(
    projectId: string,
    taskInput: Partial<CourseworkTask>,
) {
    const projectPlans = loadProjectPlans();
    const projectIndex = findPlanIndexByProjectId(projectPlans, projectId);

    if (projectIndex < 0) {
        return projectPlans;
    }

    const priority = taskInput.priority || "Medium";

    const nextPlans = projectPlans.map((plan, index) => {
        if (index !== projectIndex) {
            return plan;
        }

        const restoredPlan = restoreArchivedTasksForNewWork(plan);

        const newTask = normaliseTask(
            {
                id: taskInput.id || createId("custom-task"),
                title: taskInput.title || "Untitled custom task",
                status: taskInput.status || "Todo",
                priority,
                dueDate: taskInput.dueDate || "",
                estimatedTime: normaliseEstimatedTimeValue(
                    taskInput.estimatedTime,
                    priority,
                    true,
                ),
            },
            restoredPlan.tasks.length,
        );

        return {
            ...restoredPlan,
            updatedAt: new Date().toISOString(),
            completionPromptDismissed: false,
            project: {
                ...restoredPlan.project,
                status: "Active",
            },
            tasks: [...restoredPlan.tasks, newTask],
        };
    });

    return persistProjectPlans(nextPlans, {
        title: "Task saved locally",
        message:
            "Your new task has been added. Today, Dashboard, and this project have been updated.",
        actionLabel: "Open Today",
        actionHref: "/today",
    });
}

export function updateTaskDetails(
    projectIdOrTaskId: string,
    taskIdOrUpdates: string | Partial<CourseworkTask>,
    maybeUpdates?: Partial<CourseworkTask>,
) {
    const projectPlans = loadProjectPlans();

    const projectId =
        typeof taskIdOrUpdates === "string" ? projectIdOrTaskId : "";
    const taskId =
        typeof taskIdOrUpdates === "string" ? taskIdOrUpdates : projectIdOrTaskId;
    const updates =
        typeof taskIdOrUpdates === "string" ? maybeUpdates ?? {} : taskIdOrUpdates;

    const nextPlans = projectPlans.map((plan) => {
        if (projectId && findPlanIndexByProjectId([plan], projectId) < 0) {
            return plan;
        }

        const taskExists = plan.tasks.some((task) => task.id === taskId);

        if (!taskExists) {
            return plan;
        }

        return {
            ...plan,
            updatedAt: new Date().toISOString(),
            completionPromptDismissed: false,
            tasks: plan.tasks.map((task) => {
                if (task.id !== taskId) {
                    return task;
                }

                const nextPriority = updates.priority || task.priority || "Medium";

                return {
                    ...task,
                    ...updates,
                    id: task.id,
                    priority: nextPriority,
                    status: updates.status || task.status,
                    estimatedTime:
                        updates.estimatedTime !== undefined
                            ? normaliseEstimatedTimeValue(
                                updates.estimatedTime,
                                nextPriority,
                                false,
                            )
                            : task.estimatedTime,
                };
            }),
        };
    });

    return persistProjectPlans(nextPlans, {
        title: "Task changes saved",
        message: "Your task edits have been saved locally in this browser.",
    });
}

export function updateTaskStatus(
    projectIdOrTaskId: string,
    taskIdOrStatus: string | TaskStatus,
    maybeStatus?: TaskStatus,
) {
    const projectPlans = loadProjectPlans();

    const projectId = maybeStatus !== undefined ? projectIdOrTaskId : "";
    const taskId =
        maybeStatus !== undefined
            ? String(taskIdOrStatus)
            : String(projectIdOrTaskId);
    const nextStatus =
        maybeStatus !== undefined ? maybeStatus : (taskIdOrStatus as TaskStatus);

    const nextPlans = projectPlans.map((plan) => {
        if (projectId && findPlanIndexByProjectId([plan], projectId) < 0) {
            return plan;
        }

        const taskExists = plan.tasks.some((task) => task.id === taskId);

        if (!taskExists) {
            return plan;
        }

        return {
            ...plan,
            updatedAt: new Date().toISOString(),
            completionPromptDismissed: false,
            tasks: plan.tasks.map((task) => {
                if (task.id !== taskId) {
                    return task;
                }

                return {
                    ...task,
                    status: nextStatus,
                    completedAt:
                        nextStatus === "Done"
                            ? task.completedAt || new Date().toISOString()
                            : undefined,
                };
            }),
        };
    });

    return persistProjectPlans(nextPlans, {
        title: nextStatus === "Done" ? "Task marked done" : "Task restored",
        message:
            nextStatus === "Done"
                ? "Nice work. Your progress has been saved and recalculated."
                : "This task has been restored to todo and your progress has been updated.",
    });
}

export function deleteTask(projectIdOrTaskId: string, maybeTaskId?: string) {
    const projectPlans = loadProjectPlans();

    const projectId = maybeTaskId ? projectIdOrTaskId : "";
    const taskId = maybeTaskId || projectIdOrTaskId;

    const nextPlans = projectPlans.map((plan) => {
        if (projectId && findPlanIndexByProjectId([plan], projectId) < 0) {
            return plan;
        }

        const taskExists = plan.tasks.some((task) => task.id === taskId);

        if (!taskExists) {
            return plan;
        }

        return {
            ...plan,
            updatedAt: new Date().toISOString(),
            completionPromptDismissed: false,
            tasks: plan.tasks.filter((task) => task.id !== taskId),
        };
    });

    return persistProjectPlans(nextPlans, {
        title: "Task deleted",
        message:
            "The task has been removed and project progress has been recalculated.",
    });
}

export function archiveCompletedTasks(projectId: string) {
    const projectPlans = loadProjectPlans();
    const projectIndex = findPlanIndexByProjectId(projectPlans, projectId);

    if (projectIndex < 0) {
        return projectPlans;
    }

    const nextPlans = projectPlans.map((plan, index) => {
        if (index !== projectIndex) {
            return plan;
        }

        const completedTasks = plan.tasks.filter((task) => task.status === "Done");
        const activeTasks = plan.tasks.filter((task) => task.status !== "Done");

        if (completedTasks.length === 0) {
            return plan;
        }

        const archivedTasks = [
            ...(plan.archivedTasks ?? []),
            ...completedTasks.map((task) => ({
                ...task,
                archivedAt: new Date().toISOString(),
            })),
        ];

        return {
            ...plan,
            updatedAt: new Date().toISOString(),
            completionPromptDismissed: true,
            tasks: activeTasks,
            archivedTasks,
            archivedTaskCount: archivedTasks.length,
            project: {
                ...plan.project,
                status: activeTasks.length === 0 ? "Complete" : "Active",
            },
        };
    });

    return persistProjectPlans(nextPlans, {
        title: "Completed tasks archived",
        message:
            "Completed tasks have been archived so the active workspace stays clean.",
    });
}

export function restoreArchivedTasks(projectId: string) {
    const projectPlans = loadProjectPlans();
    const projectIndex = findPlanIndexByProjectId(projectPlans, projectId);

    if (projectIndex < 0) {
        return projectPlans;
    }

    const nextPlans = projectPlans.map((plan, index) => {
        if (index !== projectIndex) {
            return plan;
        }

        return restoreArchivedTasksForNewWork(plan);
    });

    return persistProjectPlans(nextPlans, {
        title: "Archived tasks restored",
        message:
            "Archived tasks have been restored to the active project because new work was added.",
    });
}

export function archiveCompletedProjectTasks(projectId: string) {
    return archiveCompletedTasks(projectId);
}

export function keepCompletedProjectTasks(projectId: string) {
    const projectPlans = loadProjectPlans();
    const projectIndex = findPlanIndexByProjectId(projectPlans, projectId);

    if (projectIndex < 0) {
        return projectPlans;
    }

    const nextPlans = projectPlans.map((plan, index) => {
        if (index !== projectIndex) {
            return plan;
        }

        return {
            ...plan,
            updatedAt: new Date().toISOString(),
            completionPromptDismissed: true,
            project: {
                ...plan.project,
                status: "Complete",
            },
        };
    });

    return persistProjectPlans(nextPlans, {
        title: "Completed tasks kept",
        message:
            "Completed tasks will stay visible in this project. You can add new work later if the project changes.",
    });
}

export function findCompletedPlanWaitingForPrompt() {
    const projectPlans = loadProjectPlans();

    return (
        projectPlans.find((plan) => {
            if (plan.completionPromptDismissed) {
                return false;
            }

            if (plan.project.status === "Complete") {
                return false;
            }

            if (plan.tasks.length === 0) {
                return false;
            }

            return plan.tasks.every((task) => task.status === "Done");
        }) || null
    );
}

export function listenForProjectPlanUpdates(callback: () => void) {
    if (!isBrowser()) {
        return () => {};
    }

    function handleUpdate() {
        callback();
    }

    function handleStorage(event: StorageEvent) {
        if (!event.key) {
            callback();
            return;
        }

        if (
            PROJECT_STORAGE_KEYS.includes(event.key) ||
            event.key.toLowerCase().includes("coursework-compass") ||
            event.key.toLowerCase().includes("courseworkcompass")
        ) {
            callback();
        }
    }

    window.addEventListener(PROJECT_PLAN_UPDATE_EVENT_NAME, handleUpdate);
    window.addEventListener("storage", handleStorage);

    return () => {
        window.removeEventListener(PROJECT_PLAN_UPDATE_EVENT_NAME, handleUpdate);
        window.removeEventListener("storage", handleStorage);
    };
}
