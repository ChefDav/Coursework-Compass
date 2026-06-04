import type { PlanningIntensity, PriorityLevel, Task } from "@/types/coursework";

type GenerateTasksInput = {
    projectTitle: string;
    templateId: string;
    deadline: string;
    intensity: PlanningIntensity;
};

const taskTitlesByTemplate: Record<string, string[]> = {
    "math-ia-template": [
        "Define research question",
        "Collect initial data sources",
        "Choose mathematical methods",
        "Create data table",
        "Write methodology outline",
        "Complete mathematical analysis",
        "Draft conclusion",
        "Check formatting and citations",
    ],
    "cs-ia-template": [
        "Identify client problem",
        "Draft success criteria",
        "Design system structure",
        "Build first prototype",
        "Test core features",
        "Collect user feedback",
        "Write evaluation",
        "Polish final documentation",
    ],
    "extended-essay-template": [
        "Confirm research question",
        "Build source list",
        "Annotate key sources",
        "Create essay outline",
        "Write first draft section",
        "Review supervisor feedback",
        "Revise argument structure",
        "Final proofread",
    ],
    "tok-essay-template": [
        "Choose prescribed title",
        "Break down key concepts",
        "Select real-life examples",
        "Draft claim and counterclaim",
        "Write first body section",
        "Develop evaluation",
        "Draft conclusion",
        "Polish final essay",
    ],
    "english-essay-template": [
        "Choose essay question",
        "Collect textual evidence",
        "Create thesis statement",
        "Plan body paragraphs",
        "Write first draft",
        "Improve analysis",
        "Edit language and structure",
        "Final proofread",
    ],
    "economics-commentary-template": [
        "Choose suitable article",
        "Identify key economic concept",
        "Draw relevant diagram",
        "Write analysis paragraph",
        "Add evaluation",
        "Check terminology",
        "Review word count",
        "Final polish",
    ],
};

function slugify(value: string) {
    return value
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");
}

function getTaskLimit(intensity: PlanningIntensity) {
    if (intensity === "light") {
        return 4;
    }

    if (intensity === "intense") {
        return 8;
    }

    return 6;
}

function getPriority(index: number, totalTasks: number): PriorityLevel {
    if (index <= 1) {
        return "High";
    }

    if (index >= totalTasks - 2) {
        return "Medium";
    }

    return "Low";
}

function getTimeEstimate(priority: PriorityLevel) {
    if (priority === "High") {
        return "45 min";
    }

    if (priority === "Medium") {
        return "35 min";
    }

    return "25 min";
}

function addDays(date: Date, days: number) {
    const nextDate = new Date(date);
    nextDate.setDate(nextDate.getDate() + days);
    return nextDate;
}

function formatDate(date: Date) {
    return date.toISOString().slice(0, 10);
}

function calculateDueDate(index: number, totalTasks: number, deadline: string) {
    const today = new Date();
    const deadlineDate = new Date(`${deadline}T23:59:59`);

    const totalMilliseconds = deadlineDate.getTime() - today.getTime();
    const totalDays = Math.max(
        Math.ceil(totalMilliseconds / (1000 * 60 * 60 * 24)),
        1,
    );

    const spacing = Math.max(Math.floor(totalDays / totalTasks), 1);
    const dueDate = addDays(today, spacing * index);

    if (dueDate > deadlineDate) {
        return formatDate(deadlineDate);
    }

    return formatDate(dueDate);
}

export function generateTasksForProject({
                                            projectTitle,
                                            templateId,
                                            deadline,
                                            intensity,
                                        }: GenerateTasksInput): Task[] {
    const fallbackTasks = [
        "Define project goal",
        "Break down requirements",
        "Create first draft",
        "Review and improve work",
        "Prepare final version",
        "Submit project",
    ];

    const taskTitles = taskTitlesByTemplate[templateId] ?? fallbackTasks;
    const taskLimit = getTaskLimit(intensity);
    const selectedTaskTitles = taskTitles.slice(0, taskLimit);

    return selectedTaskTitles.map((title, index) => {
        const priority = getPriority(index, selectedTaskTitles.length);

        return {
            id: `${slugify(projectTitle)}-${slugify(title)}`,
            title,
            project: projectTitle,
            priority,
            time: getTimeEstimate(priority),
            status: "Todo",
            dueDate: calculateDueDate(index + 1, selectedTaskTitles.length, deadline),
        };
    });
}