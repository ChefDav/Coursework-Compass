import type {
    GeneratedProjectPlan,
    PriorityLevel,
    RiskLevel,
    Task,
    TaskStatus,
} from "@/types/coursework";

const PROJECT_PLANS_STORAGE_KEY = "coursework-compass-project-plans";
const PROJECT_PLANS_UPDATED_EVENT = "coursework-compass-project-plans-updated";

function notifyProjectPlanUpdates() {
    window.dispatchEvent(new Event(PROJECT_PLANS_UPDATED_EVENT));
}

export function loadProjectPlans(): GeneratedProjectPlan[] {
    if (typeof window === "undefined") {
        return [];
    }

    const rawPlans = window.localStorage.getItem(PROJECT_PLANS_STORAGE_KEY);

    if (!rawPlans) {
        return [];
    }

    try {
        const parsedPlans = JSON.parse(rawPlans);

        if (!Array.isArray(parsedPlans)) {
            return [];
        }

        return parsedPlans;
    } catch {
        return [];
    }
}

export function saveProjectPlans(plans: GeneratedProjectPlan[]) {
    window.localStorage.setItem(
        PROJECT_PLANS_STORAGE_KEY,
        JSON.stringify(plans),
    );

    notifyProjectPlanUpdates();
}

export function saveProjectPlan(plan: GeneratedProjectPlan) {
    const existingPlans = loadProjectPlans();

    const updatedPlans = [
        ...existingPlans.filter(
            (existingPlan) => existingPlan.project.id !== plan.project.id,
        ),
        plan,
    ];

    saveProjectPlans(updatedPlans);

    return updatedPlans;
}

export function clearProjectPlans() {
    window.localStorage.removeItem(PROJECT_PLANS_STORAGE_KEY);
    notifyProjectPlanUpdates();
}

export function deleteProjectPlan(projectId: string) {
    const existingPlans = loadProjectPlans();

    const updatedPlans = existingPlans.filter(
        (plan) => plan.project.id !== projectId,
    );

    saveProjectPlans(updatedPlans);

    return updatedPlans;
}

export function listenForProjectPlanUpdates(callback: () => void) {
    function handleStorageEvent(event: StorageEvent) {
        if (event.key === PROJECT_PLANS_STORAGE_KEY) {
            callback();
        }
    }

    window.addEventListener(PROJECT_PLANS_UPDATED_EVENT, callback);
    window.addEventListener("storage", handleStorageEvent);

    return () => {
        window.removeEventListener(PROJECT_PLANS_UPDATED_EVENT, callback);
        window.removeEventListener("storage", handleStorageEvent);
    };
}

function parseProjectDeadline(deadline: string) {
    const normalisedDeadline = deadline.replaceAll("/", "-");
    const parsedDate = new Date(`${normalisedDeadline}T00:00:00`);

    if (Number.isNaN(parsedDate.getTime())) {
        return null;
    }

    return parsedDate;
}

function getStartOfDay(date: Date) {
    return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function getDaysLeftFromDeadline(deadline: string) {
    const parsedDeadline = parseProjectDeadline(deadline);

    if (!parsedDeadline) {
        return 0;
    }

    const today = getStartOfDay(new Date());
    const target = getStartOfDay(parsedDeadline);
    const millisecondsPerDay = 1000 * 60 * 60 * 24;

    return Math.max(
        Math.ceil((target.getTime() - today.getTime()) / millisecondsPerDay),
        0,
    );
}

function getRiskLevelFromDaysLeft(daysLeft: number): RiskLevel {
    if (daysLeft <= 7) {
        return "High";
    }

    if (daysLeft <= 21) {
        return "Medium";
    }

    return "Low";
}

export function updateProjectDetails(
    projectId: string,
    updates: {
        title: string;
        deadline: string;
    },
) {
    const existingPlans = loadProjectPlans();
    const trimmedTitle = updates.title.trim();

    if (!trimmedTitle) {
        return existingPlans;
    }

    const daysLeft = getDaysLeftFromDeadline(updates.deadline);
    const risk = getRiskLevelFromDaysLeft(daysLeft);

    const updatedPlans = existingPlans.map((plan) => {
        if (plan.project.id !== projectId) {
            return plan;
        }

        return {
            ...plan,
            project: {
                ...plan.project,
                title: trimmedTitle,
                deadline: updates.deadline,
                daysLeft,
                risk,
            },
            tasks: plan.tasks.map((task) => ({
                ...task,
                project: trimmedTitle,
            })),
            archivedTasks: plan.archivedTasks?.map((task) => ({
                ...task,
                project: trimmedTitle,
            })),
        } satisfies GeneratedProjectPlan;
    });

    saveProjectPlans(updatedPlans);

    return updatedPlans;
}

function slugifyTaskPart(value: string) {
    return value
        .toLowerCase()
        .trim()
        .replace(/&/g, "and")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)+/g, "");
}

function createCustomTaskId(projectId: string, title: string) {
    const safeTitle = slugifyTaskPart(title) || "custom-task";
    return `${projectId}-custom-${Date.now().toString(36)}-${safeTitle}`;
}

export function addCustomTask(
    projectId: string,
    taskInput: {
        title: string;
        priority: PriorityLevel;
        dueDate: string;
        time: string;
    },
) {
    const existingPlans = loadProjectPlans();
    const trimmedTitle = taskInput.title.trim();
    const trimmedTime = taskInput.time.trim() || "45 min";

    if (!trimmedTitle) {
        return existingPlans;
    }

    const updatedPlans = existingPlans.map((plan) => {
        if (plan.project.id !== projectId) {
            return plan;
        }

        const customTask: Task = {
            id: createCustomTaskId(projectId, trimmedTitle),
            title: trimmedTitle,
            project: plan.project.title,
            priority: taskInput.priority,
            time: trimmedTime,
            status: "Todo",
            dueDate: taskInput.dueDate,
        };

        const restoredArchivedTasks = plan.archivedTasks ?? [];
        const shouldRestoreArchivedTasks =
            Boolean(plan.tasksArchivedAt) && restoredArchivedTasks.length > 0;

        const nextTasks = shouldRestoreArchivedTasks
            ? [...restoredArchivedTasks, customTask]
            : [...plan.tasks, customTask];

        return {
            ...plan,
            tasks: nextTasks,
            archivedTasks: undefined,
            archivedTaskCount: 0,
            tasksArchivedAt: undefined,
            completedAt: undefined,
            completionPromptShown: false,
            project: {
                ...plan.project,
                status: "Active",
            },
        } satisfies GeneratedProjectPlan;
    });

    saveProjectPlans(updatedPlans);

    return updatedPlans;
}

export function updateTaskStatus(taskId: string, status: TaskStatus) {
    const existingPlans = loadProjectPlans();

    const updatedPlans = existingPlans.map((plan) => {
        let changedTaskBelongsToThisPlan = false;

        const updatedTasks = plan.tasks.map((task) => {
            if (task.id !== taskId) {
                return task;
            }

            changedTaskBelongsToThisPlan = true;

            return {
                ...task,
                status,
            };
        });

        if (!changedTaskBelongsToThisPlan) {
            return plan;
        }

        const allTasksDone =
            updatedTasks.length > 0 &&
            updatedTasks.every((task) => task.status === "Done");

        if (status === "Todo") {
            return {
                ...plan,
                tasks: updatedTasks,
                completedAt: undefined,
                completionPromptShown: false,
                project: {
                    ...plan.project,
                    status: "Active",
                },
            } satisfies GeneratedProjectPlan;
        }

        if (allTasksDone) {
            return {
                ...plan,
                tasks: updatedTasks,
            } satisfies GeneratedProjectPlan;
        }

        return {
            ...plan,
            tasks: updatedTasks,
        } satisfies GeneratedProjectPlan;
    });

    saveProjectPlans(updatedPlans);

    return updatedPlans;
}

export function findCompletedPlanWaitingForPrompt() {
    const existingPlans = loadProjectPlans();

    return (
        existingPlans.find((plan) => {
            const hasVisibleTasks = plan.tasks.length > 0;
            const allTasksDone =
                hasVisibleTasks && plan.tasks.every((task) => task.status === "Done");

            return (
                allTasksDone &&
                !plan.completionPromptShown &&
                !plan.tasksArchivedAt
            );
        }) ?? null
    );
}

export function keepCompletedProjectTasks(projectId: string) {
    const existingPlans = loadProjectPlans();

    const updatedPlans = existingPlans.map((plan) => {
        if (plan.project.id !== projectId) {
            return plan;
        }

        return {
            ...plan,
            completedAt: plan.completedAt ?? new Date().toISOString(),
            completionPromptShown: true,
            project: {
                ...plan.project,
                progress: 100,
                status: "Completed",
            },
        } satisfies GeneratedProjectPlan;
    });

    saveProjectPlans(updatedPlans);

    return updatedPlans;
}

export function archiveCompletedProjectTasks(projectId: string) {
    const existingPlans = loadProjectPlans();

    const updatedPlans = existingPlans.map((plan) => {
        if (plan.project.id !== projectId) {
            return plan;
        }

        const tasksToArchive =
            plan.tasks.length > 0 ? plan.tasks : plan.archivedTasks ?? [];

        return {
            ...plan,
            tasks: [],
            archivedTasks: tasksToArchive,
            archivedTaskCount: tasksToArchive.length,
            tasksArchivedAt: new Date().toISOString(),
            completedAt: plan.completedAt ?? new Date().toISOString(),
            completionPromptShown: true,
            project: {
                ...plan.project,
                progress: 100,
                status: "Completed",
            },
        } satisfies GeneratedProjectPlan;
    });

    saveProjectPlans(updatedPlans);

    return updatedPlans;
}