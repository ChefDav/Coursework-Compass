import type { GeneratedProjectPlan } from "@/types/coursework";

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

export function saveProjectPlan(plan: GeneratedProjectPlan) {
    const existingPlans = loadProjectPlans();

    const plansWithoutDuplicate = existingPlans.filter(
        (existingPlan) => existingPlan.project.id !== plan.project.id,
    );

    const updatedPlans = [plan, ...plansWithoutDuplicate];

    window.localStorage.setItem(PROJECT_PLANS_KEY, JSON.stringify(updatedPlans));

    return updatedPlans;
}