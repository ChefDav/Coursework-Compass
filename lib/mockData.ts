import type { Project, ProjectTemplate, Task } from "@/types/coursework";

export const projects: Project[] = [
    {
        id: "math-ia",
        title: "Math IA",
        type: "Internal Assessment",
        progress: 68,
        daysLeft: 23,
        risk: "Medium",
        deadline: "2026-07-10",
        status: "Active",
    },
    {
        id: "cs-ia",
        title: "Computer Science IA",
        type: "Coursework Project",
        progress: 42,
        daysLeft: 37,
        risk: "Low",
        deadline: "2026-07-24",
        status: "Active",
    },
    {
        id: "tok-essay",
        title: "TOK Essay",
        type: "Essay",
        progress: 21,
        daysLeft: 14,
        risk: "High",
        deadline: "2026-07-01",
        status: "Active",
    },
];

export const projectTemplates: ProjectTemplate[] = [
    {
        id: "math-ia-template",
        name: "Math IA",
        description:
            "Plan research question, data collection, mathematical exploration, analysis, and final write-up.",
    },
    {
        id: "cs-ia-template",
        name: "Computer Science IA",
        description:
            "Break down planning, success criteria, development, testing, and evaluation.",
    },
    {
        id: "extended-essay-template",
        name: "Extended Essay",
        description:
            "Structure research, outline, source review, drafting, feedback, and final polish.",
    },
    {
        id: "tok-essay-template",
        name: "TOK Essay",
        description:
            "Plan title analysis, examples, claims, counterclaims, and essay refinement.",
    },
    {
        id: "english-essay-template",
        name: "English Essay",
        description:
            "Organize thesis development, textual evidence, paragraph planning, and editing.",
    },
    {
        id: "economics-commentary-template",
        name: "Economics Commentary",
        description:
            "Manage article selection, diagram planning, analysis, evaluation, and final checks.",
    },
];

export const tasks: Task[] = [
    {
        id: "collect-data-sources",
        title: "Collect 3 data sources",
        project: "Math IA",
        priority: "High",
        time: "45 min",
        status: "Todo",
        dueDate: "2026-06-05",
    },
    {
        id: "draft-success-criteria",
        title: "Draft success criteria",
        project: "Computer Science IA",
        priority: "Medium",
        time: "30 min",
        status: "Todo",
        dueDate: "2026-06-06",
    },
    {
        id: "annotate-tok-example",
        title: "Annotate one TOK example",
        project: "TOK Essay",
        priority: "Medium",
        time: "25 min",
        status: "Todo",
        dueDate: "2026-06-07",
    },
    {
        id: "review-supervisor-feedback",
        title: "Review supervisor feedback",
        project: "Extended Essay",
        priority: "Low",
        time: "20 min",
        status: "Todo",
        dueDate: "2026-06-08",
    },
];