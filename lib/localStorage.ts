import type { GeneratedProjectPlan, TaskStatus } from "@/types/coursework";

const PROJECT_PLANS_KEY = "coursework-compass-project-plans";

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