export type RiskLevel = "Low" | "Medium" | "High";

export type PriorityLevel = "Low" | "Medium" | "High";

export type ProjectStatus = "Active" | "Completed" | "Paused";

export type TaskStatus = "Todo" | "Done";

export type PlanningIntensity = "light" | "balanced" | "intense";

export type User = {
    id: string;
    name: string;
    email: string;
    createdAt: string;
};

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
    dueDate: string;
};

export type Milestone = {
    id: string;
    projectId: string;
    title: string;
    order: number;
    status: TaskStatus;
};

export type ProjectTemplate = {
    id: string;
    name: string;
    description: string;
};