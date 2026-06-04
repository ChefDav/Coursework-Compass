import type { GeneratedProjectPlan, Project, Task } from "@/types/coursework";

export function calculateTaskProgress(tasks: Task[]) {
    if (tasks.length === 0) {
        return 0;
    }

    const doneTaskCount = tasks.filter((task) => task.status === "Done").length;

    return Math.round((doneTaskCount / tasks.length) * 100);
}

export function applyProgressToProject(plan: GeneratedProjectPlan): Project {
    if (plan.project.status === "Completed" || plan.tasksArchivedAt) {
        return {
            ...plan.project,
            progress: 100,
            status: "Completed",
        };
    }

    return {
        ...plan.project,
        progress: calculateTaskProgress(plan.tasks),
    };
}

export function countDoneTasks(tasks: Task[]) {
    return tasks.filter((task) => task.status === "Done").length;
}