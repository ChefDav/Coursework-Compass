import type {
    GeneratedProjectPlan,
    PlanningIntensity,
    PriorityLevel,
    Project,
    ProjectStatus,
    RiskLevel,
    Task,
    TaskStatus,
} from "@/types/coursework";

const PROJECT_PLANS_KEY = "coursework-compass-project-plans";
const PROJECT_PLANS_UPDATED_EVENT = "coursework-compass-project-plans-updated";

function notifyProjectPlansUpdated() {
    if (typeof window === "undefined") {
        return;
    }

    window.dispatchEvent(new Event(PROJECT_PLANS_UPDATED_EVENT));
}

export function listenForProjectPlanUpdates(callback: () => void) {
    if (typeof window === "undefined") {
        return () => {};
    }

    window.addEventListener(PROJECT_PLANS_UPDATED_EVENT, callback);
    window.addEventListener("storage", callback);

    return () => {
        window.removeEventListener(PROJECT_PLANS_UPDATED_EVENT, callback);
        window.removeEventListener("storage", callback);
    };
}

function isRecord(value: unknown): value is Record<string, unknown> {
    return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isRiskLevel(value: unknown): value is RiskLevel {
    return value === "Low" || value === "Medium" || value === "High";
}

function isPriorityLevel(value: unknown): value is PriorityLevel {
    return value === "Low" || value === "Medium" || value === "High";
}

function isProjectStatus(value: unknown): value is ProjectStatus {
    return value === "Active" || value === "Completed" || value === "Paused";
}

function isTaskStatus(value: unknown): value is TaskStatus {
    return value === "Todo" || value === "Done";
}

function isPlanningIntensity(value: unknown): value is PlanningIntensity {
    return value === "light" || value === "balanced" || value === "intense";
}

function getString(value: unknown, fallback = "") {
    return typeof value === "string" ? value : fallback;
}

function getNumber(value: unknown, fallback = 0) {
    return typeof value === "number" && Number.isFinite(value)
        ? value
        : fallback;
}

function clampProgress(value: number) {
    return Math.min(Math.max(Math.round(value), 0), 100);
}

function sanitizeProject(value: unknown): Project | null {
    if (!isRecord(value)) {
        return null;
    }

    const id = getString(value.id);
    const title = getString(value.title);
    const type = getString(value.type);

    if (!id || !title || !type) {
        return null;
    }

    return {
        id,
        title,
        type,
        progress: clampProgress(getNumber(value.progress, 0)),
        daysLeft: Math.max(Math.round(getNumber(value.daysLeft, 0)), 0),
        risk: isRiskLevel(value.risk) ? value.risk : "Low",
        deadline: getString(value.deadline),
        status: isProjectStatus(value.status) ? value.status : "Active",
    };
}

function sanitizeTask(value: unknown, fallbackProjectTitle: string): Task | null {
    if (!isRecord(value)) {
        return null;
    }

    const id = getString(value.id);
    const title = getString(value.title);

    if (!id || !title) {
        return null;
    }

    return {
        id,
        title,
        project: getString(value.project, fallbackProjectTitle),
        priority: isPriorityLevel(value.priority) ? value.priority : "Low",
        time: getString(value.time, "30 min"),
        status: isTaskStatus(value.status) ? value.status : "Todo",
        dueDate: getString(value.dueDate),
    };
}

function sanitizeProjectPlan(value: unknown): GeneratedProjectPlan | null {
    if (!isRecord(value)) {
        return null;
    }

    const project = sanitizeProject(value.project);

    if (!project) {
        return null;
    }

    const rawTasks = Array.isArray(value.tasks) ? value.tasks : [];
    const tasks = rawTasks
        .map((task) => sanitizeTask(task, project.title))
        .filter((task): task is Task => task !== null);

    const plan: GeneratedProjectPlan = {
        project,
        tasks,
        intensity: isPlanningIntensity(value.intensity)
            ? value.intensity
            : "balanced",
        createdAt: getString(value.createdAt, new Date().toISOString()),
    };

    const completedAt = getString(value.completedAt);
    const tasksArchivedAt = getString(value.tasksArchivedAt);
    const archivedTaskCount = getNumber(value.archivedTaskCount, 0);

    if (completedAt) {
        plan.completedAt = completedAt;
    }

    if (typeof value.completionPromptShown === "boolean") {
        plan.completionPromptShown = value.completionPromptShown;
    }

    if (tasksArchivedAt) {
        plan.tasksArchivedAt = tasksArchivedAt;
    }

    if (archivedTaskCount > 0) {
        plan.archivedTaskCount = Math.round(archivedTaskCount);
    }

    return plan;
}

function sanitizeProjectPlans(value: unknown): GeneratedProjectPlan[] {
    if (!Array.isArray(value)) {
        return [];
    }

    return value
        .map((plan) => sanitizeProjectPlan(plan))
        .filter((plan): plan is GeneratedProjectPlan => plan !== null);
}

export function loadProjectPlans(): GeneratedProjectPlan[] {
    if (typeof window === "undefined") {
        return [];
    }

    const rawPlans = window.localStorage.getItem(PROJECT_PLANS_KEY);

    if (!rawPlans) {
        return [];
    }

    try {
        const parsedPlans = JSON.parse(rawPlans);
        return sanitizeProjectPlans(parsedPlans);
    } catch {
        return [];
    }
}

export function saveProjectPlans(plans: GeneratedProjectPlan[]) {
    if (typeof window === "undefined") {
        return [];
    }

    const safePlans = sanitizeProjectPlans(plans);

    window.localStorage.setItem(PROJECT_PLANS_KEY, JSON.stringify(safePlans));
    notifyProjectPlansUpdated();

    return safePlans;
}

export function saveProjectPlan(plan: GeneratedProjectPlan) {
    const safePlan = sanitizeProjectPlan(plan);

    if (!safePlan) {
        return loadProjectPlans();
    }

    const existingPlans = loadProjectPlans();

    const plansWithoutDuplicate = existingPlans.filter(
        (existingPlan) => existingPlan.project.id !== safePlan.project.id,
    );

    const updatedPlans = [safePlan, ...plansWithoutDuplicate];

    saveProjectPlans(updatedPlans);

    return updatedPlans;
}

export function deleteProjectPlan(projectId: string) {
    const existingPlans = loadProjectPlans();

    const updatedPlans = existingPlans.filter(
        (plan) => plan.project.id !== projectId,
    );

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
            };
        }

        return {
            ...plan,
            tasks: updatedTasks,
        };
    });

    saveProjectPlans(updatedPlans);

    return updatedPlans;
}

export function findCompletedPlanWaitingForPrompt() {
    const existingPlans = loadProjectPlans();

    return existingPlans.find((plan) => {
        if (plan.completionPromptShown || plan.tasksArchivedAt) {
            return false;
        }

        if (plan.tasks.length === 0) {
            return false;
        }

        return plan.tasks.every((task) => task.status === "Done");
    });
}

export function keepCompletedProjectTasks(projectId: string) {
    const existingPlans = loadProjectPlans();
    const completedAt = new Date().toISOString();

    const updatedPlans = existingPlans.map((plan) => {
        if (plan.project.id !== projectId) {
            return plan;
        }

        return {
            ...plan,
            completedAt,
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
    const completedAt = new Date().toISOString();
    const archivedAt = new Date().toISOString();

    const updatedPlans = existingPlans.map((plan) => {
        if (plan.project.id !== projectId) {
            return plan;
        }

        return {
            ...plan,
            tasks: [],
            completedAt,
            completionPromptShown: true,
            tasksArchivedAt: archivedAt,
            archivedTaskCount: plan.tasks.length,
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

export function clearProjectPlans() {
    if (typeof window === "undefined") {
        return;
    }

    window.localStorage.removeItem(PROJECT_PLANS_KEY);
    notifyProjectPlansUpdated();
}