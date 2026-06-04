import type { GeneratedProjectPlan, TaskStatus } from "@/types/coursework";

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

export function loadProjectPlans(): GeneratedProjectPlan[] {
    if (typeof window === "undefined") {
        return [];
    }

    const rawPlans = window.localStorage.getItem(PROJECT_PLANS_KEY);

    if (!rawPlans) {
        return [];
    }

    try {
        return JSON.parse(rawPlans) as GeneratedProjectPlan[];
    } catch {
        return [];
    }
}

export function saveProjectPlans(plans: GeneratedProjectPlan[]) {
    if (typeof window === "undefined") {
        return [];
    }

    window.localStorage.setItem(PROJECT_PLANS_KEY, JSON.stringify(plans));
    notifyProjectPlansUpdated();

    return plans;
}

export function saveProjectPlan(plan: GeneratedProjectPlan) {
    const existingPlans = loadProjectPlans();

    const plansWithoutDuplicate = existingPlans.filter(
        (existingPlan) => existingPlan.project.id !== plan.project.id,
    );

    const updatedPlans = [plan, ...plansWithoutDuplicate];

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
        const updatedTasks = plan.tasks.map((task) => {
            if (task.id !== taskId) {
                return task;
            }

            return {
                ...task,
                status,
            };
        });

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