export type TaskStatus = "Todo" | "Done";

export type CourseworkTask = {
    id: string;
    title: string;
    status: TaskStatus;
    priority?: string;
    dueDate?: string;
    estimatedTime?: string;
    completedAt?: string;
    archivedAt?: string;
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

function getRawProjectRouteId(plan: Partial<GeneratedProjectPlan>, index = 0) {
    const project = plan.project ?? {
        title: "",
        deadline: "",
    };

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

function normaliseTask(rawTask: Partial<CourseworkTask>, index: number) {
    return {
        id: rawTask.id || createId(`task-${index}`),
        title: rawTask.title || "Untitled task",
        status: rawTask.status === "Done" ? "Done" : "Todo",
        priority: rawTask.priority || "Medium",
        dueDate: rawTask.dueDate || "",
        estimatedTime: rawTask.estimatedTime || "Not set",
        completedAt: rawTask.completedAt,
        archivedAt: rawTask.archivedAt,
    } satisfies CourseworkTask;
}

function normaliseProjectPlan(
    rawPlan: Partial<GeneratedProjectPlan>,
    index: number,
) {
    const rawProject = rawPlan.project ?? {
        title: "Untitled project",
        deadline: "",
    };

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
        ? rawPlan.tasks.map((task, taskIndex) => normaliseTask(task, taskIndex))
        : [];

    const archivedTasks = Array.isArray(rawPlan.archivedTasks)
        ? rawPlan.archivedTasks.map((task, taskIndex) =>
            normaliseTask(task, taskIndex),
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
            type: rawProject.type || "",
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

    Object.keys(window.localStorage).forEach((key) => {
        const normalisedKey = key.toLowerCase();

        const isCourseworkCompassProjectKey =
            normalisedKey.includes("courseworkcompassprojects") ||
            normalisedKey.includes("coursework-compass-plans") ||
            normalisedKey.includes("coursework-compass-project-plans") ||
            normalisedKey === "generatedprojectplans" ||
            normalisedKey === "projectplans";

        if (isCourseworkCompassProjectKey && key !== PRIMARY_PROJECT_STORAGE_KEY) {
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

function persistProjectPlansSilently(projectPlans: GeneratedProjectPlan[]) {
    if (!isBrowser()) {
        return;
    }

    const serialisedPlans = JSON.stringify(projectPlans);
    const didSave = safeSetPrimaryProjectStorage(serialisedPlans);

    if (didSave) {
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
        persistProjectPlansSilently(normalisedPlans);
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
                priority: taskInput.priority || "Medium",
                dueDate: taskInput.dueDate || "",
                estimatedTime: taskInput.estimatedTime || "Not set",
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
            tasks: plan.tasks.map((task) =>
                task.id === taskId
                    ? {
                        ...task,
                        ...updates,
                        id: task.id,
                        status: updates.status || task.status,
                    }
                    : task,
            ),
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

/**
 * Compatibility exports for CompletionWatcher.tsx.
 */

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