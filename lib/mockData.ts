import type { Project, ProjectTemplate, Task } from "@/types/coursework";

export const projects: Project[] = [
    {
        id: "demo-math-ia",
        title: "Math IA Progress",
        type: "Math IA",
        progress: 64,
        daysLeft: 23,
        risk: "Medium",
        deadline: "2026/07/10",
        status: "Active",
    },
    {
        id: "demo-tok-essay",
        title: "TOK Essay Draft",
        type: "TOK Essay",
        progress: 32,
        daysLeft: 12,
        risk: "High",
        deadline: "2026/06/25",
        status: "Active",
    },
    {
        id: "demo-cs-ia",
        title: "CS IA Prototype",
        type: "Computer Science IA",
        progress: 78,
        daysLeft: 31,
        risk: "Low",
        deadline: "2026/07/18",
        status: "Active",
    },
];

export const tasks: Task[] = [
    {
        id: "demo-task-1",
        title: "Refine research question",
        project: "Math IA Progress",
        priority: "High",
        time: "45 min",
        status: "Todo",
        dueDate: "2026/06/08",
    },
    {
        id: "demo-task-2",
        title: "Create data collection table",
        project: "Math IA Progress",
        priority: "Medium",
        time: "30 min",
        status: "Todo",
        dueDate: "2026/06/09",
    },
    {
        id: "demo-task-3",
        title: "Write first TOK argument paragraph",
        project: "TOK Essay Draft",
        priority: "High",
        time: "60 min",
        status: "Todo",
        dueDate: "2026/06/10",
    },
    {
        id: "demo-task-4",
        title: "Test one CS IA user flow",
        project: "CS IA Prototype",
        priority: "Low",
        time: "40 min",
        status: "Done",
        dueDate: "2026/06/07",
    },
];

export const projectTemplates: ProjectTemplate[] = [
    {
        id: "math-ia",
        name: "Math IA",
        description:
            "Plan a mathematical exploration with a research question, data, modelling, interpretation, and evaluation.",
    },
    {
        id: "cs-ia",
        name: "Computer Science IA",
        description:
            "Manage a client-based software project from success criteria to prototype, testing, and documentation.",
    },
    {
        id: "extended-essay",
        name: "Extended Essay",
        description:
            "Break a long independent research essay into question design, source work, drafting, and final refinement.",
    },
    {
        id: "tok-essay",
        name: "TOK Essay",
        description:
            "Structure a TOK essay around title interpretation, arguments, counterclaims, examples, and evaluation.",
    },
    {
        id: "english-essay",
        name: "English Essay",
        description:
            "Build a literary essay with thesis development, close analysis, evidence, and polished argument structure.",
    },
    {
        id: "economics-commentary",
        name: "Economics Commentary",
        description:
            "Prepare an economics commentary with article selection, diagrams, theory, analysis, and evaluation.",
    },
    {
        id: "biology-ia",
        name: "Biology IA",
        description:
            "Plan a biological investigation with variables, method, data collection, analysis, evaluation, and final report structure.",
    },
    {
        id: "chemistry-ia",
        name: "Chemistry IA",
        description:
            "Manage a chemistry investigation from research question and method design to data processing, uncertainty, and evaluation.",
    },
    {
        id: "physics-ia",
        name: "Physics IA",
        description:
            "Create a physics investigation plan covering variables, apparatus, data collection, graphs, modelling, and uncertainty analysis.",
    },
    {
        id: "business-ia",
        name: "Business IA",
        description:
            "Structure a business investigation with a research question, supporting documents, business tools, analysis, and recommendations.",
    },
    {
        id: "history-essay",
        name: "History Essay",
        description:
            "Organise a historical argument with research, source evaluation, historiography, evidence, and essay refinement.",
    },
    {
        id: "geography-ia",
        name: "Geography IA",
        description:
            "Plan a geography fieldwork investigation with data collection, presentation, analysis, evaluation, and final write-up.",
    },
    {
        id: "psychology-essay",
        name: "Psychology Essay",
        description:
            "Build a psychology essay using research studies, structured arguments, critical evaluation, and clear conclusions.",
    },
    {
        id: "english-io",
        name: "English IO",
        description:
            "Prepare an English Individual Oral with global issue selection, extract analysis, structure, timing, and rehearsal.",
    },
    {
        id: "epq",
        name: "EPQ",
        description:
            "Plan an Extended Project Qualification from proposal and research log to product, essay, evaluation, and presentation.",
    },
    {
        id: "university-personal-statement",
        name: "University Personal Statement",
        description:
            "Draft a strong university personal statement with course motivation, academic evidence, supercurricular reflection, and final editing.",
    },
];