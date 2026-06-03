export type RiskLevel = "Low" | "Medium" | "High";
export type PriorityLevel = "Low" | "Medium" | "High";

export const projects = [
    {
        title: "Math IA",
        type: "Internal Assessment",
        progress: 68,
        daysLeft: 23,
        risk: "Medium" as RiskLevel,
    },
    {
        title: "Computer Science IA",
        type: "Coursework Project",
        progress: 42,
        daysLeft: 37,
        risk: "Low" as RiskLevel,
    },
    {
        title: "TOK Essay",
        type: "Essay",
        progress: 21,
        daysLeft: 14,
        risk: "High" as RiskLevel,
    },
];

export const projectTemplates = [
    "Math IA",
    "Computer Science IA",
    "Extended Essay",
    "TOK Essay",
    "English Essay",
    "Economics Commentary",
];

export const tasks = [
    {
        title: "Collect 3 data sources",
        project: "Math IA",
        priority: "High" as PriorityLevel,
        time: "45 min",
    },
    {
        title: "Draft success criteria",
        project: "Computer Science IA",
        priority: "Medium" as PriorityLevel,
        time: "30 min",
    },
    {
        title: "Annotate one TOK example",
        project: "TOK Essay",
        priority: "Medium" as PriorityLevel,
        time: "25 min",
    },
    {
        title: "Review supervisor feedback",
        project: "Extended Essay",
        priority: "Low" as PriorityLevel,
        time: "20 min",
    },
];