export type RiskLevel = "Low" | "Medium" | "High";

export type PriorityLevel = "Low" | "Medium" | "High";

export type ProjectStatus = "Active" | "Completed";

export type TaskStatus = "Todo" | "Done";

export type PlanningIntensity = "light" | "balanced" | "intense";

export type Project = {
    id: string;
    title: string;
    type: string;
    progress: number;
    daysLeft: number;
    risk: RiskLevel;
    deadline: string;
    status: ProjectStatus;
};

export type Task = {
    id: string;
    title: string;
    project: string;
    priority: PriorityLevel;
    time: string;
    status: TaskStatus;
    dueDate?: string;
};

export type ProjectTemplate = {
    id: string;
    name: string;
    description: string;
};

export type GeneratedProjectPlan = {
    project: Project;
    tasks: Task[];
    intensity: PlanningIntensity;
    createdAt: string;
    completedAt?: string;
    completionPromptShown?: boolean;
    tasksArchivedAt?: string;
    archivedTaskCount?: number;
    archivedTasks?: Task[];
};