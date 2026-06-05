import { projectTemplates } from "@/lib/mockData";
import type {
    GeneratedProjectPlan,
    PlanningIntensity,
    PriorityLevel,
    Project,
    RiskLevel,
    Task,
} from "@/types/coursework";

type TaskBlueprint = {
    title: string;
    priority: PriorityLevel;
    time: string;
};

type GenerateProjectPlanInput = {
    projectName?: string;
    name?: string;
    title?: string;
    templateId?: string;
    selectedTemplateId?: string;
    projectType?: string;
    deadline: string;
    intensity: PlanningIntensity;
};

const taskBlueprintsByTemplateId: Record<string, TaskBlueprint[]> = {
    "math-ia": [
        {
            title: "Refine research question",
            priority: "High",
            time: "45 min",
        },
        {
            title: "Define variables, method, and data needs",
            priority: "High",
            time: "60 min",
        },
        {
            title: "Collect or organise raw data",
            priority: "High",
            time: "90 min",
        },
        {
            title: "Create graphs and mathematical model",
            priority: "Medium",
            time: "75 min",
        },
        {
            title: "Write mathematical analysis and interpretation",
            priority: "High",
            time: "90 min",
        },
        {
            title: "Evaluate limitations and improvements",
            priority: "Medium",
            time: "60 min",
        },
        {
            title: "Format equations, citations, and diagrams",
            priority: "Medium",
            time: "45 min",
        },
        {
            title: "Complete final proofreading checklist",
            priority: "Low",
            time: "45 min",
        },
    ],

    "cs-ia": [
        {
            title: "Clarify client problem and success criteria",
            priority: "High",
            time: "60 min",
        },
        {
            title: "Create system design and data model",
            priority: "High",
            time: "75 min",
        },
        {
            title: "Build core prototype screen",
            priority: "High",
            time: "90 min",
        },
        {
            title: "Implement main feature logic",
            priority: "High",
            time: "120 min",
        },
        {
            title: "Test with sample users or sample data",
            priority: "Medium",
            time: "75 min",
        },
        {
            title: "Fix bugs and improve interface clarity",
            priority: "Medium",
            time: "75 min",
        },
        {
            title: "Write development and testing documentation",
            priority: "High",
            time: "90 min",
        },
        {
            title: "Prepare final submission evidence",
            priority: "Low",
            time: "45 min",
        },
    ],

    "extended-essay": [
        {
            title: "Refine research question and scope",
            priority: "High",
            time: "60 min",
        },
        {
            title: "Build source list and research notes",
            priority: "High",
            time: "90 min",
        },
        {
            title: "Create essay structure and argument map",
            priority: "High",
            time: "75 min",
        },
        {
            title: "Draft introduction and first body section",
            priority: "Medium",
            time: "90 min",
        },
        {
            title: "Draft remaining body sections",
            priority: "High",
            time: "120 min",
        },
        {
            title: "Add analysis, citations, and academic framing",
            priority: "High",
            time: "90 min",
        },
        {
            title: "Write conclusion and reflection notes",
            priority: "Medium",
            time: "60 min",
        },
        {
            title: "Final edit for word count, formatting, and references",
            priority: "Low",
            time: "75 min",
        },
    ],

    "tok-essay": [
        {
            title: "Interpret the prescribed title",
            priority: "High",
            time: "45 min",
        },
        {
            title: "Choose areas of knowledge and examples",
            priority: "High",
            time: "60 min",
        },
        {
            title: "Plan first argument and counterclaim",
            priority: "High",
            time: "60 min",
        },
        {
            title: "Plan second argument and counterclaim",
            priority: "Medium",
            time: "60 min",
        },
        {
            title: "Draft introduction and first body section",
            priority: "High",
            time: "90 min",
        },
        {
            title: "Draft remaining body sections",
            priority: "High",
            time: "90 min",
        },
        {
            title: "Strengthen evaluation and TOK terminology",
            priority: "Medium",
            time: "60 min",
        },
        {
            title: "Final edit for clarity and word count",
            priority: "Low",
            time: "45 min",
        },
    ],

    "english-essay": [
        {
            title: "Choose essay question and thesis direction",
            priority: "High",
            time: "45 min",
        },
        {
            title: "Select key quotations and literary evidence",
            priority: "High",
            time: "60 min",
        },
        {
            title: "Plan body paragraph structure",
            priority: "Medium",
            time: "45 min",
        },
        {
            title: "Draft introduction and first analytical paragraph",
            priority: "High",
            time: "75 min",
        },
        {
            title: "Draft remaining analytical paragraphs",
            priority: "High",
            time: "90 min",
        },
        {
            title: "Refine close analysis and authorial choices",
            priority: "Medium",
            time: "60 min",
        },
        {
            title: "Write conclusion and polish transitions",
            priority: "Medium",
            time: "45 min",
        },
        {
            title: "Final proofread for expression and citations",
            priority: "Low",
            time: "45 min",
        },
    ],

    "economics-commentary": [
        {
            title: "Choose article and identify syllabus concepts",
            priority: "High",
            time: "45 min",
        },
        {
            title: "Annotate article with key economic ideas",
            priority: "High",
            time: "45 min",
        },
        {
            title: "Create relevant economic diagram",
            priority: "High",
            time: "60 min",
        },
        {
            title: "Write explanation of theory and diagram",
            priority: "Medium",
            time: "75 min",
        },
        {
            title: "Apply theory to the real article context",
            priority: "High",
            time: "75 min",
        },
        {
            title: "Add evaluation with stakeholders and limitations",
            priority: "High",
            time: "60 min",
        },
        {
            title: "Check word count and article references",
            priority: "Medium",
            time: "45 min",
        },
        {
            title: "Final edit for clarity and structure",
            priority: "Low",
            time: "45 min",
        },
    ],

    "biology-ia": [
        {
            title: "Choose investigation focus and research question",
            priority: "High",
            time: "45 min",
        },
        {
            title: "Define variables, controls, and hypothesis",
            priority: "High",
            time: "60 min",
        },
        {
            title: "Design method and safety considerations",
            priority: "High",
            time: "75 min",
        },
        {
            title: "Collect or organise biological data",
            priority: "High",
            time: "90 min",
        },
        {
            title: "Process data with tables, graphs, and uncertainties",
            priority: "Medium",
            time: "75 min",
        },
        {
            title: "Analyse trends and biological significance",
            priority: "High",
            time: "75 min",
        },
        {
            title: "Evaluate limitations and improvements",
            priority: "Medium",
            time: "60 min",
        },
        {
            title: "Format final report and references",
            priority: "Low",
            time: "45 min",
        },
    ],

    "chemistry-ia": [
        {
            title: "Define chemistry research question",
            priority: "High",
            time: "45 min",
        },
        {
            title: "Plan variables, reagents, apparatus, and safety",
            priority: "High",
            time: "75 min",
        },
        {
            title: "Create method and data collection table",
            priority: "High",
            time: "60 min",
        },
        {
            title: "Collect or organise experimental results",
            priority: "High",
            time: "90 min",
        },
        {
            title: "Process data with calculations and uncertainties",
            priority: "High",
            time: "90 min",
        },
        {
            title: "Analyse chemical trends and explain results",
            priority: "High",
            time: "75 min",
        },
        {
            title: "Evaluate errors, limitations, and improvements",
            priority: "Medium",
            time: "60 min",
        },
        {
            title: "Check formatting, units, citations, and appendix",
            priority: "Low",
            time: "45 min",
        },
    ],

    "physics-ia": [
        {
            title: "Define physics research question and relationship",
            priority: "High",
            time: "45 min",
        },
        {
            title: "Identify variables, apparatus, and measurement method",
            priority: "High",
            time: "75 min",
        },
        {
            title: "Plan uncertainty handling and data table",
            priority: "High",
            time: "60 min",
        },
        {
            title: "Collect or organise experimental data",
            priority: "High",
            time: "90 min",
        },
        {
            title: "Create graphs and calculate gradients or models",
            priority: "High",
            time: "90 min",
        },
        {
            title: "Analyse physical meaning and compare with theory",
            priority: "High",
            time: "75 min",
        },
        {
            title: "Evaluate uncertainty, errors, and method improvements",
            priority: "Medium",
            time: "60 min",
        },
        {
            title: "Final check for units, significant figures, and structure",
            priority: "Low",
            time: "45 min",
        },
    ],

    "business-ia": [
        {
            title: "Choose business, issue, and research question",
            priority: "High",
            time: "60 min",
        },
        {
            title: "Collect supporting documents and business context",
            priority: "High",
            time: "75 min",
        },
        {
            title: "Select business tools for analysis",
            priority: "High",
            time: "45 min",
        },
        {
            title: "Apply first business tool to evidence",
            priority: "High",
            time: "75 min",
        },
        {
            title: "Apply second business tool to evidence",
            priority: "Medium",
            time: "75 min",
        },
        {
            title: "Evaluate options and stakeholder impact",
            priority: "High",
            time: "75 min",
        },
        {
            title: "Write recommendations and conclusion",
            priority: "Medium",
            time: "60 min",
        },
        {
            title: "Check appendices, citations, and final formatting",
            priority: "Low",
            time: "45 min",
        },
    ],

    "history-essay": [
        {
            title: "Refine historical question and time period",
            priority: "High",
            time: "45 min",
        },
        {
            title: "Gather primary and secondary source notes",
            priority: "High",
            time: "90 min",
        },
        {
            title: "Identify key interpretations and historiography",
            priority: "High",
            time: "75 min",
        },
        {
            title: "Create argument structure and paragraph plan",
            priority: "High",
            time: "60 min",
        },
        {
            title: "Draft first analytical section",
            priority: "High",
            time: "90 min",
        },
        {
            title: "Draft remaining analytical sections",
            priority: "High",
            time: "90 min",
        },
        {
            title: "Evaluate source value, limitations, and perspectives",
            priority: "Medium",
            time: "60 min",
        },
        {
            title: "Final edit for citations, chronology, and clarity",
            priority: "Low",
            time: "45 min",
        },
    ],

    "geography-ia": [
        {
            title: "Define fieldwork question and geographic focus",
            priority: "High",
            time: "45 min",
        },
        {
            title: "Plan data collection method and sampling strategy",
            priority: "High",
            time: "75 min",
        },
        {
            title: "Prepare risk, ethics, and equipment checklist",
            priority: "Medium",
            time: "45 min",
        },
        {
            title: "Collect or organise fieldwork data",
            priority: "High",
            time: "90 min",
        },
        {
            title: "Present data with maps, graphs, or tables",
            priority: "High",
            time: "90 min",
        },
        {
            title: "Analyse spatial patterns and geographic causes",
            priority: "High",
            time: "75 min",
        },
        {
            title: "Evaluate data quality and method limitations",
            priority: "Medium",
            time: "60 min",
        },
        {
            title: "Final report formatting and bibliography check",
            priority: "Low",
            time: "45 min",
        },
    ],

    "psychology-essay": [
        {
            title: "Define essay question and command term",
            priority: "High",
            time: "45 min",
        },
        {
            title: "Select key studies and theories",
            priority: "High",
            time: "60 min",
        },
        {
            title: "Create argument plan and evaluation points",
            priority: "High",
            time: "60 min",
        },
        {
            title: "Draft introduction and first study paragraph",
            priority: "Medium",
            time: "75 min",
        },
        {
            title: "Draft remaining study and theory paragraphs",
            priority: "High",
            time: "90 min",
        },
        {
            title: "Add critical evaluation and methodological limitations",
            priority: "High",
            time: "75 min",
        },
        {
            title: "Write conclusion linked to the question",
            priority: "Medium",
            time: "45 min",
        },
        {
            title: "Final check for terminology, citations, and clarity",
            priority: "Low",
            time: "45 min",
        },
    ],

    "english-io": [
        {
            title: "Choose global issue and paired texts",
            priority: "High",
            time: "60 min",
        },
        {
            title: "Select extracts and wider work references",
            priority: "High",
            time: "60 min",
        },
        {
            title: "Analyse authorial choices in first extract",
            priority: "High",
            time: "75 min",
        },
        {
            title: "Analyse authorial choices in second extract",
            priority: "High",
            time: "75 min",
        },
        {
            title: "Create 10-point oral outline",
            priority: "High",
            time: "60 min",
        },
        {
            title: "Rehearse timing and transitions",
            priority: "Medium",
            time: "45 min",
        },
        {
            title: "Refine comparison and global issue links",
            priority: "Medium",
            time: "45 min",
        },
        {
            title: "Final timed practice and speaking notes check",
            priority: "Low",
            time: "45 min",
        },
    ],

    epq: [
        {
            title: "Finalise EPQ title and project aim",
            priority: "High",
            time: "45 min",
        },
        {
            title: "Complete proposal and initial planning notes",
            priority: "High",
            time: "60 min",
        },
        {
            title: "Build research log and source list",
            priority: "High",
            time: "90 min",
        },
        {
            title: "Create project timeline and milestone plan",
            priority: "Medium",
            time: "60 min",
        },
        {
            title: "Draft essay or develop product evidence",
            priority: "High",
            time: "120 min",
        },
        {
            title: "Write evaluation of research and process",
            priority: "High",
            time: "75 min",
        },
        {
            title: "Prepare presentation structure and speaker notes",
            priority: "Medium",
            time: "60 min",
        },
        {
            title: "Final check of log, references, and submission files",
            priority: "Low",
            time: "45 min",
        },
    ],

    "university-personal-statement": [
        {
            title: "Research course expectations and key skills",
            priority: "High",
            time: "45 min",
        },
        {
            title: "List academic interests, achievements, and evidence",
            priority: "High",
            time: "60 min",
        },
        {
            title: "Plan opening paragraph and central motivation",
            priority: "High",
            time: "45 min",
        },
        {
            title: "Draft academic evidence section",
            priority: "High",
            time: "75 min",
        },
        {
            title: "Draft supercurricular reflection section",
            priority: "High",
            time: "75 min",
        },
        {
            title: "Connect experiences to course suitability",
            priority: "Medium",
            time: "60 min",
        },
        {
            title: "Edit for voice, clarity, and word count",
            priority: "High",
            time: "75 min",
        },
        {
            title: "Final proofread and teacher feedback checklist",
            priority: "Low",
            time: "45 min",
        },
    ],
};

const genericTaskBlueprints: TaskBlueprint[] = [
    {
        title: "Define project goal and success criteria",
        priority: "High",
        time: "45 min",
    },
    {
        title: "Collect key resources and requirements",
        priority: "High",
        time: "60 min",
    },
    {
        title: "Create project structure and milestone plan",
        priority: "High",
        time: "60 min",
    },
    {
        title: "Complete first major work block",
        priority: "High",
        time: "90 min",
    },
    {
        title: "Review progress and fill missing evidence",
        priority: "Medium",
        time: "60 min",
    },
    {
        title: "Improve quality using feedback or self-review",
        priority: "Medium",
        time: "60 min",
    },
    {
        title: "Prepare final version and supporting materials",
        priority: "High",
        time: "75 min",
    },
    {
        title: "Complete final submission checklist",
        priority: "Low",
        time: "45 min",
    },
];

function slugify(value: string) {
    return value
        .toLowerCase()
        .trim()
        .replace(/&/g, "and")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)+/g, "");
}

function getProjectName(input: GenerateProjectPlanInput) {
    return (
        input.projectName?.trim() ||
        input.name?.trim() ||
        input.title?.trim() ||
        "Untitled Coursework Project"
    );
}

function getTemplateId(input: GenerateProjectPlanInput) {
    const rawTemplateValue =
        input.templateId || input.selectedTemplateId || input.projectType || "";

    const templateById = projectTemplates.find(
        (template) => template.id === rawTemplateValue,
    );

    if (templateById) {
        return templateById.id;
    }

    const templateByName = projectTemplates.find(
        (template) =>
            template.name.toLowerCase() === rawTemplateValue.toLowerCase(),
    );

    return templateByName?.id || "generic";
}

function getTemplateName(templateId: string) {
    return (
        projectTemplates.find((template) => template.id === templateId)?.name ||
        "Coursework Project"
    );
}

function getTaskCountForIntensity(intensity: PlanningIntensity) {
    if (intensity === "light") {
        return 4;
    }

    if (intensity === "intense") {
        return 8;
    }

    return 6;
}

function parseDeadlineDate(deadline: string) {
    const normalisedDeadline = deadline.replaceAll("/", "-");
    const parsedDate = new Date(`${normalisedDeadline}T00:00:00`);

    if (Number.isNaN(parsedDate.getTime())) {
        const fallbackDate = new Date();
        fallbackDate.setDate(fallbackDate.getDate() + 30);
        return fallbackDate;
    }

    return parsedDate;
}

function getStartOfDay(date: Date) {
    return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function getDaysLeft(deadlineDate: Date) {
    const today = getStartOfDay(new Date());
    const target = getStartOfDay(deadlineDate);
    const millisecondsPerDay = 1000 * 60 * 60 * 24;

    return Math.ceil((target.getTime() - today.getTime()) / millisecondsPerDay);
}

function getRiskLevel(daysLeft: number): RiskLevel {
    if (daysLeft <= 7) {
        return "High";
    }

    if (daysLeft <= 21) {
        return "Medium";
    }

    return "Low";
}

function formatDateForTask(date: Date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}/${month}/${day}`;
}

function getDueDateForTask(
    taskIndex: number,
    taskCount: number,
    deadlineDate: Date,
) {
    const today = getStartOfDay(new Date());
    const target = getStartOfDay(deadlineDate);
    const daysUntilDeadline = Math.max(getDaysLeft(target), taskCount);
    const progressRatio = (taskIndex + 1) / taskCount;
    const dayOffset = Math.max(1, Math.round(daysUntilDeadline * progressRatio));

    const dueDate = new Date(today);
    dueDate.setDate(today.getDate() + dayOffset);

    if (dueDate.getTime() > target.getTime()) {
        return formatDateForTask(target);
    }

    return formatDateForTask(dueDate);
}

function getSelectedBlueprints(
    templateId: string,
    intensity: PlanningIntensity,
) {
    const allBlueprints =
        taskBlueprintsByTemplateId[templateId] || genericTaskBlueprints;
    const taskCount = getTaskCountForIntensity(intensity);

    return allBlueprints.slice(0, taskCount);
}

export function generateProjectPlan(
    input: GenerateProjectPlanInput,
): GeneratedProjectPlan {
    const projectName = getProjectName(input);
    const templateId = getTemplateId(input);
    const templateName = getTemplateName(templateId);
    const deadlineDate = parseDeadlineDate(input.deadline);
    const daysLeft = Math.max(getDaysLeft(deadlineDate), 0);
    const projectId = `${slugify(projectName)}-${Date.now().toString(36)}`;
    const selectedBlueprints = getSelectedBlueprints(templateId, input.intensity);

    const project: Project = {
        id: projectId,
        title: projectName,
        type: templateName,
        progress: 0,
        daysLeft,
        risk: getRiskLevel(daysLeft),
        deadline: input.deadline,
        status: "Active",
    };

    const tasks: Task[] = selectedBlueprints.map((blueprint, index) => ({
        id: `${projectId}-${index + 1}-${slugify(blueprint.title)}`,
        title: blueprint.title,
        project: projectName,
        priority: blueprint.priority,
        time: blueprint.time,
        status: "Todo",
        dueDate: getDueDateForTask(index, selectedBlueprints.length, deadlineDate),
    }));

    return {
        project,
        tasks,
        intensity: input.intensity,
        createdAt: new Date().toISOString(),
    };
}

export function generateTasksForProject(input: GenerateProjectPlanInput) {
    return generateProjectPlan(input).tasks;
}

export const generateCourseworkPlan = generateProjectPlan;