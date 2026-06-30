"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import CalendarDateField from "@/components/CalendarDateField";
import { useStoredLanguage } from "@/lib/clientStores";
import {
    getProjectRouteId,
    saveGeneratedProjectPlan,
    type CourseworkTask,
    type GeneratedProjectPlan,
} from "@/lib/localStorage";
import type { Language } from "@/lib/i18n";

type PlanningIntensity = "light" | "balanced" | "intensive";
type TaskPriority = "High" | "Medium" | "Low";

type LocalisedText = {
    en: string;
    zh: string;
};

type TemplateStep = {
    title: LocalisedText;
    description: LocalisedText;
    priority: TaskPriority;
    time: LocalisedText;
};

type ProjectTemplate = {
    id: string;
    icon: string;
    subject: string;
    accent: string;
    name: LocalisedText;
    shortName: LocalisedText;
    description: LocalisedText;
    steps: TemplateStep[];
};

const copy = {
    en: {
        pageEyebrow: "Project studio",
        pageTitle: "Build a coursework plan that actually feels usable.",
        pageSubtitle:
            "Choose a template, set a deadline, generate a realistic task timeline, then save it locally in this browser.",
        badgeOne: "Template first",
        badgeTwo: "Local beta",
        badgeThree: "Editable later",
        templateStep: "01",
        setupStep: "02",
        previewStep: "03",
        templateLabel: "Choose a template",
        setupTitle: "Project setup",
        setupDescription:
            "Give the planner enough information to create a useful first version. You can still edit tasks later.",
        previewTitle: "Plan preview",
        projectTitleLabel: "Project title",
        projectTitlePlaceholder: "e.g. Biology IA Enzyme Investigation",
        deadlineLabel: "Final deadline",
        intensityLabel: "Planning style",
        light: "Light",
        lightDescription: "Fewer tasks. Best for short deadlines or quick plans.",
        balanced: "Balanced",
        balancedDescription:
            "Recommended. Enough structure without making the plan feel heavy.",
        intensive: "Intensive",
        intensiveDescription:
            "More checkpoints for drafting, feedback, and final polish.",
        generatePlan: "Generate plan",
        regeneratePlan: "Regenerate plan",
        saveProject: "Save project locally",
        openProject: "Open saved project",
        savedTitle: "Project saved locally",
        savedDescription:
            "This plan is now stored in this browser. You can open it from Dashboard, Projects, or Today.",
        previewEmptyTitle: "No plan generated yet",
        previewEmptyDescription:
            "Choose a template, enter a title and deadline, then generate a plan. The task timeline will appear here.",
        previewReadyDescription:
            "Review the generated timeline before saving. This is a starting plan, so tasks can be edited later.",
        tasksGenerated: "tasks generated",
        timeline: "Timeline",
        due: "Due",
        estimatedTime: "Estimated time",
        selected: "Selected",
        browserNoteTitle: "Browser-only beta storage",
        browserNote:
            "Saved projects stay in this browser only. During testing, avoid entering sensitive personal information.",
        formErrorTitleRequired: "Please enter a project title.",
        formErrorDeadlineRequired: "Please choose a final deadline.",
        formErrorPastDeadline:
            "Please choose a future deadline so the planner can spread tasks properly.",
        today: "Today",
        daysAvailable: "days available",
        dayAvailable: "day available",
        high: "High",
        medium: "Medium",
        low: "Low",
    },
    zh: {
        pageEyebrow: "项目工作台",
        pageTitle: "创建一个真正能用的 coursework 计划。",
        pageSubtitle:
            "选择模板，设置截止日期，生成现实可执行的任务时间线，然后保存到当前浏览器。",
        badgeOne: "先选模板",
        badgeTwo: "本地测试版",
        badgeThree: "之后可编辑",
        templateStep: "01",
        setupStep: "02",
        previewStep: "03",
        templateLabel: "选择模板",
        setupTitle: "项目设置",
        setupDescription:
            "只需要提供最关键的信息，planner 就能生成第一版任务计划。保存后仍然可以继续编辑。",
        previewTitle: "计划预览",
        projectTitleLabel: "项目标题",
        projectTitlePlaceholder: "例如：Biology IA 酶实验研究",
        deadlineLabel: "最终截止日期",
        intensityLabel: "规划方式",
        light: "轻量",
        lightDescription: "任务更少，适合截止日期较近或快速规划。",
        balanced: "平衡",
        balancedDescription: "推荐使用。结构清晰，但不会让计划显得太重。",
        intensive: "强化",
        intensiveDescription: "更多检查点，适合认真打磨、老师反馈和最终润色。",
        generatePlan: "生成计划",
        regeneratePlan: "重新生成计划",
        saveProject: "保存到当前浏览器",
        openProject: "打开已保存项目",
        savedTitle: "项目已保存在本浏览器",
        savedDescription:
            "这个计划已经保存在当前浏览器中。之后可以从 Dashboard、Projects 或 Today 打开。",
        previewEmptyTitle: "还没有生成计划",
        previewEmptyDescription:
            "选择模板，输入标题和截止日期，然后生成计划。任务时间线会显示在这里。",
        previewReadyDescription:
            "保存前可以先检查生成的时间线。这只是初始计划，之后仍然可以编辑任务。",
        tasksGenerated: "个任务已生成",
        timeline: "时间线",
        due: "日期",
        estimatedTime: "预计用时",
        selected: "已选择",
        browserNoteTitle: "浏览器本地测试存储",
        browserNote:
            "保存的项目只会留在当前浏览器中。测试期间请避免输入敏感个人信息。",
        formErrorTitleRequired: "请先输入项目标题。",
        formErrorDeadlineRequired: "请先选择最终截止日期。",
        formErrorPastDeadline:
            "请选择未来的截止日期，这样 planner 才能合理分配任务。",
        today: "今天",
        daysAvailable: "天可用",
        dayAvailable: "天可用",
        high: "高",
        medium: "中",
        low: "低",
    },
} as const;

const intensityOptions = [
    {
        value: "light" as const,
        labelKey: "light" as const,
        descriptionKey: "lightDescription" as const,
    },
    {
        value: "balanced" as const,
        labelKey: "balanced" as const,
        descriptionKey: "balancedDescription" as const,
    },
    {
        value: "intensive" as const,
        labelKey: "intensive" as const,
        descriptionKey: "intensiveDescription" as const,
    },
];

function text(en: string, zh: string): LocalisedText {
    return { en, zh };
}

function step(
    titleEn: string,
    titleZh: string,
    descriptionEn: string,
    descriptionZh: string,
    priority: TaskPriority,
    timeEn: string,
    timeZh: string,
): TemplateStep {
    return {
        title: text(titleEn, titleZh),
        description: text(descriptionEn, descriptionZh),
        priority,
        time: text(timeEn, timeZh),
    };
}

const templates: ProjectTemplate[] = [
    {
        id: "biology-ia",
        icon: "🧬",
        subject: "Biology",
        accent: "from-emerald-400/20 to-cyan-400/10",
        name: text("Biology IA", "生物 IA Biology IA"),
        shortName: text("Bio IA", "生物 IA"),
        description: text(
            "Research question, variables, method, data, graphs, conclusion, and evaluation.",
            "覆盖 research question、变量、方法、数据、图表、结论和 evaluation。",
        ),
        steps: [
            step(
                "Define research question",
                "确定 research question",
                "Turn the topic into a focused, testable research question.",
                "把主题收窄成清晰、可测试的研究问题。",
                "High",
                "1 hour",
                "1 小时",
            ),
            step(
                "Plan variables and method",
                "规划变量和实验方法",
                "List variables, controls, equipment, and repeatable method steps.",
                "列出变量、控制因素、设备和可重复的实验步骤。",
                "High",
                "1.5 hours",
                "1.5 小时",
            ),
            step(
                "Collect and organise data",
                "收集并整理数据",
                "Record raw data clearly and prepare useful tables.",
                "清晰记录原始数据，并整理成可用表格。",
                "Medium",
                "2 hours",
                "2 小时",
            ),
            step(
                "Process data and create graphs",
                "处理数据并制作图表",
                "Calculate processed values and create appropriate graphs.",
                "计算处理后的数据，并制作合适图表。",
                "Medium",
                "2 hours",
                "2 小时",
            ),
            step(
                "Write conclusion and evaluation",
                "撰写 conclusion 和 evaluation",
                "Answer the research question and evaluate limitations.",
                "回答研究问题，并评价实验局限。",
                "High",
                "2 hours",
                "2 小时",
            ),
        ],
    },
    {
        id: "chemistry-ia",
        icon: "⚗️",
        subject: "Chemistry",
        accent: "from-lime-400/20 to-emerald-400/10",
        name: text("Chemistry IA", "化学 IA Chemistry IA"),
        shortName: text("Chem IA", "化学 IA"),
        description: text(
            "Variables, method, safety, data processing, graphs, conclusion, and evaluation.",
            "覆盖变量、实验方法、安全、数据处理、图表、结论和 evaluation。",
        ),
        steps: [
            step(
                "Choose chemical research question",
                "确定化学 research question",
                "Define a focused chemistry question with measurable variables.",
                "确定一个聚焦且变量可测量的化学研究问题。",
                "High",
                "1 hour",
                "1 小时",
            ),
            step(
                "Plan variables, apparatus, and safety",
                "规划变量、仪器和安全措施",
                "Prepare variables, apparatus, quantities, risks, and safety notes.",
                "准备变量、仪器、用量、风险和安全说明。",
                "High",
                "1.5 hours",
                "1.5 小时",
            ),
            step(
                "Collect raw data",
                "收集原始数据",
                "Record measurements clearly with units and repeated trials.",
                "清晰记录带单位的数据，并包含重复实验。",
                "Medium",
                "2 hours",
                "2 小时",
            ),
            step(
                "Process data and uncertainties",
                "处理数据和不确定性",
                "Calculate processed values, uncertainty, and relevant graphs.",
                "计算处理后的数据、不确定性，并制作相关图表。",
                "High",
                "2 hours",
                "2 小时",
            ),
            step(
                "Write conclusion and evaluation",
                "撰写 conclusion 和 evaluation",
                "Explain trends, answer the question, and evaluate limitations.",
                "解释趋势，回答研究问题，并评价实验局限。",
                "High",
                "2 hours",
                "2 小时",
            ),
        ],
    },
    {
        id: "physics-ia",
        icon: "🛰️",
        subject: "Physics",
        accent: "from-sky-400/20 to-cyan-400/10",
        name: text("Physics IA", "物理 IA Physics IA"),
        shortName: text("Physics IA", "物理 IA"),
        description: text(
            "Research question, apparatus, variables, measurements, uncertainty, graphs, and evaluation.",
            "覆盖 research question、仪器、变量、测量、不确定性、图表和 evaluation。",
        ),
        steps: [
            step(
                "Define physics research question",
                "确定物理 research question",
                "Choose a measurable physics relationship to investigate.",
                "选择一个可以测量和分析的物理关系。",
                "High",
                "1 hour",
                "1 小时",
            ),
            step(
                "Plan apparatus and variables",
                "规划仪器和变量",
                "Identify equipment, variables, and control conditions.",
                "确定实验设备、变量和控制条件。",
                "High",
                "1 hour",
                "1 小时",
            ),
            step(
                "Collect repeated measurements",
                "收集重复测量数据",
                "Record repeated measurements with units and instrument precision.",
                "记录带单位的重复测量数据，并注明仪器精度。",
                "Medium",
                "2 hours",
                "2 小时",
            ),
            step(
                "Calculate uncertainty and graph results",
                "计算不确定性并绘制图表",
                "Process data, calculate uncertainty, and plot a suitable graph.",
                "处理数据，计算不确定性，并绘制合适图表。",
                "High",
                "2 hours",
                "2 小时",
            ),
            step(
                "Write analysis and evaluation",
                "撰写 analysis 和 evaluation",
                "Explain the relationship, reliability, and possible improvements.",
                "解释物理关系、可靠性和可能的改进方向。",
                "High",
                "2 hours",
                "2 小时",
            ),
        ],
    },
    {
        id: "math-ia",
        icon: "📐",
        subject: "Mathematics",
        accent: "from-amber-400/20 to-violet-400/10",
        name: text("Mathematics IA", "数学 IA Mathematics IA"),
        shortName: text("Math IA", "数学 IA"),
        description: text(
            "Topic, personal engagement, modelling, analysis, reflection, and final polish.",
            "覆盖选题、personal engagement、数学建模、分析、reflection 和最终润色。",
        ),
        steps: [
            step(
                "Choose topic and aim",
                "确定选题和目标",
                "Choose a topic with enough mathematical depth and personal interest.",
                "选择一个既有数学深度，又有个人兴趣的主题。",
                "High",
                "1 hour",
                "1 小时",
            ),
            step(
                "Formulate research question",
                "形成 research question",
                "Turn the idea into a focused mathematical investigation.",
                "把想法转化为聚焦的数学探究问题。",
                "High",
                "1 hour",
                "1 小时",
            ),
            step(
                "Collect data or define model",
                "收集数据或建立模型",
                "Gather data, define assumptions, or choose the model.",
                "收集数据、定义假设，或选择合适模型。",
                "High",
                "2 hours",
                "2 小时",
            ),
            step(
                "Carry out mathematical process",
                "完成数学处理过程",
                "Show calculations, graphs, modelling, or proof clearly.",
                "清晰展示计算、图像、建模或证明过程。",
                "High",
                "3 hours",
                "3 小时",
            ),
            step(
                "Write reflection and final edit",
                "撰写 reflection 并最终修改",
                "Reflect on limitations, validity, and possible improvements.",
                "反思局限性、有效性和可能的改进方向。",
                "High",
                "2 hours",
                "2 小时",
            ),
        ],
    },
    {
        id: "computer-science-ia",
        icon: "💻",
        subject: "Computer Science",
        accent: "from-cyan-400/20 to-blue-400/10",
        name: text("Computer Science IA", "计算机科学 IA Computer Science IA"),
        shortName: text("CS IA", "CS IA"),
        description: text(
            "Client problem, success criteria, design, implementation, testing, and evaluation.",
            "覆盖 client problem、success criteria、设计、开发、测试和 evaluation。",
        ),
        steps: [
            step(
                "Define client problem",
                "定义 client problem",
                "Write a clear problem statement and explain why the product is needed.",
                "写清楚问题背景，并说明为什么需要这个产品。",
                "High",
                "1 hour",
                "1 小时",
            ),
            step(
                "Gather requirements and success criteria",
                "收集需求和 success criteria",
                "Create success criteria and functional requirements.",
                "整理 success criteria 和功能需求。",
                "High",
                "1.5 hours",
                "1.5 小时",
            ),
            step(
                "Design product structure",
                "设计产品结构",
                "Plan screens, data structures, algorithms, and user flow.",
                "规划界面、数据结构、算法和用户流程。",
                "High",
                "2 hours",
                "2 小时",
            ),
            step(
                "Build core features",
                "开发核心功能",
                "Implement the most important features before visual polish.",
                "先实现最重要的功能，再进行视觉优化。",
                "High",
                "3 hours",
                "3 小时",
            ),
            step(
                "Test and write evaluation",
                "测试并撰写 evaluation",
                "Check success criteria and evaluate strengths and limitations.",
                "检查 success criteria，并评价优点和局限。",
                "High",
                "2 hours",
                "2 小时",
            ),
        ],
    },
    {
        id: "extended-essay",
        icon: "📚",
        subject: "Extended Essay",
        accent: "from-violet-400/20 to-cyan-400/10",
        name: text("Extended Essay", "拓展论文 Extended Essay"),
        shortName: text("EE", "EE"),
        description: text(
            "Research question, sources, outline, first draft, revision, and reflection.",
            "覆盖 research question、资料、大纲、初稿、修改和 reflection。",
        ),
        steps: [
            step(
                "Choose topic and research question",
                "确定 topic 和 research question",
                "Narrow the topic into a researchable question.",
                "把大主题收窄成可以研究的问题。",
                "High",
                "1.5 hours",
                "1.5 小时",
            ),
            step(
                "Collect academic sources",
                "收集学术资料",
                "Find reliable books, articles, datasets, or primary sources.",
                "寻找可靠的书籍、文章、数据集或一手资料。",
                "High",
                "2 hours",
                "2 小时",
            ),
            step(
                "Create essay outline",
                "制作论文大纲",
                "Plan argument structure, sections, and evidence.",
                "规划论点结构、段落和证据。",
                "High",
                "1.5 hours",
                "1.5 小时",
            ),
            step(
                "Write first draft",
                "完成 first draft",
                "Write a complete rough draft before perfecting sentences.",
                "先完成完整草稿，不要一开始就追求完美。",
                "High",
                "3 hours",
                "3 小时",
            ),
            step(
                "Revise and prepare reflection",
                "修改并准备 reflection",
                "Improve structure, citations, clarity, and reflection notes.",
                "改进结构、引用、清晰度和 reflection 内容。",
                "Medium",
                "2 hours",
                "2 小时",
            ),
        ],
    },
    {
        id: "tok-essay",
        icon: "🧠",
        subject: "TOK",
        accent: "from-fuchsia-400/20 to-cyan-400/10",
        name: text("TOK Essay", "知识论论文 TOK Essay"),
        shortName: text("TOK", "TOK"),
        description: text(
            "Prescribed title, claims, counterclaims, examples, analysis, and final proofread.",
            "覆盖 prescribed title、claims、counterclaims、例子、分析和最终校对。",
        ),
        steps: [
            step(
                "Choose prescribed title",
                "选择 prescribed title",
                "Choose the title you can answer with the strongest examples.",
                "选择你最能用例子和论证回答的题目。",
                "High",
                "45 min",
                "45 分钟",
            ),
            step(
                "Plan claims and counterclaims",
                "规划 claims 和 counterclaims",
                "Build a balanced argument before writing the essay.",
                "在正式写作前搭建平衡的论证结构。",
                "High",
                "1.5 hours",
                "1.5 小时",
            ),
            step(
                "Select real-world examples",
                "选择 real-world examples",
                "Choose examples that directly support the argument.",
                "选择能直接支撑论点的现实例子。",
                "High",
                "1 hour",
                "1 小时",
            ),
            step(
                "Write first draft",
                "撰写 first draft",
                "Turn the outline into a complete draft.",
                "把大纲扩展成完整草稿。",
                "High",
                "2 hours",
                "2 小时",
            ),
            step(
                "Improve analysis and proofread",
                "加强分析并最终校对",
                "Connect examples back to knowledge questions and polish wording.",
                "确保例子回扣 knowledge questions，并润色表达。",
                "Medium",
                "1.5 hours",
                "1.5 小时",
            ),
        ],
    },
    {
        id: "english-io",
        icon: "🎙️",
        subject: "English",
        accent: "from-orange-400/20 to-rose-400/10",
        name: text("English Individual Oral", "英语 IO English Individual Oral"),
        shortName: text("English IO", "英语 IO"),
        description: text(
            "Global issue, extracts, annotation, comparison, rehearsal, and final notes.",
            "覆盖 global issue、文本片段、标注、比较、练习和最终提示卡。",
        ),
        steps: [
            step(
                "Choose global issue",
                "确定 global issue",
                "Choose a global issue that connects strongly to both works.",
                "选择一个能同时连接两部作品的 global issue。",
                "High",
                "1 hour",
                "1 小时",
            ),
            step(
                "Select extracts",
                "选择 extracts",
                "Choose extracts that clearly show the global issue.",
                "选择能清楚体现 global issue 的文本片段。",
                "High",
                "1 hour",
                "1 小时",
            ),
            step(
                "Annotate authorial choices",
                "标注 authorial choices",
                "Annotate language, structure, imagery, tone, and choices.",
                "标注语言、结构、意象、语气和作者手法。",
                "High",
                "1.5 hours",
                "1.5 小时",
            ),
            step(
                "Build 10-minute structure",
                "搭建 10 分钟口语结构",
                "Plan introduction, extract analysis, wider work analysis, and conclusion.",
                "规划开头、片段分析、整部作品分析和结尾。",
                "High",
                "1.5 hours",
                "1.5 小时",
            ),
            step(
                "Rehearse and prepare final notes",
                "练习并准备最终提示卡",
                "Practise timing and prepare concise bullet notes.",
                "练习时间控制，并准备简洁提示卡。",
                "Medium",
                "1 hour",
                "1 小时",
            ),
        ],
    },
    {
        id: "economics-commentary",
        icon: "📈",
        subject: "Economics",
        accent: "from-amber-400/20 to-cyan-400/10",
        name: text("Economics Commentary", "经济学 Commentary"),
        shortName: text("Econ", "经济"),
        description: text(
            "Article selection, key concepts, diagrams, analysis, evaluation, and citation.",
            "覆盖文章选择、核心概念、图表、分析、evaluation 和引用。",
        ),
        steps: [
            step(
                "Choose article",
                "选择文章",
                "Select a recent article with clear economic concepts.",
                "选择一篇近期、经济概念清晰的文章。",
                "High",
                "45 min",
                "45 分钟",
            ),
            step(
                "Identify key concepts",
                "识别核心经济概念",
                "Connect the article to syllabus concepts and theory.",
                "把文章和 syllabus concepts 以及理论连接起来。",
                "High",
                "1 hour",
                "1 小时",
            ),
            step(
                "Plan diagrams",
                "规划 diagrams",
                "Choose accurate diagrams and labels before drafting.",
                "在写作前确定准确的图表和标签。",
                "High",
                "1 hour",
                "1 小时",
            ),
            step(
                "Write analysis",
                "撰写 analysis",
                "Explain the theory and apply it directly to the article.",
                "解释理论，并直接应用到文章内容中。",
                "High",
                "1.5 hours",
                "1.5 小时",
            ),
            step(
                "Write evaluation and check citation",
                "撰写 evaluation 并检查引用",
                "Evaluate stakeholders, effects, limitations, word count, and citation.",
                "评价 stakeholders、影响、局限、字数和引用。",
                "High",
                "1.5 hours",
                "1.5 小时",
            ),
        ],
    },
    {
        id: "epq",
        icon: "🗂️",
        subject: "EPQ",
        accent: "from-teal-400/20 to-emerald-400/10",
        name: text("EPQ Project", "EPQ 项目 EPQ Project"),
        shortName: text("EPQ", "EPQ"),
        description: text(
            "Question, research, production log, project outcome, evaluation, and presentation.",
            "覆盖选题、research、production log、成果、evaluation 和 presentation。",
        ),
        steps: [
            step(
                "Define project question",
                "确定项目问题",
                "Turn the broad idea into a focused and manageable EPQ question.",
                "把大方向收窄成聚焦且可完成的 EPQ 问题。",
                "High",
                "1 hour",
                "1 小时",
            ),
            step(
                "Create initial project plan",
                "制定初始项目计划",
                "Plan research stages, milestones, and the final outcome.",
                "规划研究阶段、里程碑和最终成果形式。",
                "High",
                "1.5 hours",
                "1.5 小时",
            ),
            step(
                "Collect and evaluate sources",
                "收集并评价资料",
                "Find sources and record reliability, usefulness, and limitations.",
                "寻找资料，并记录可靠性、用途和局限。",
                "High",
                "2 hours",
                "2 小时",
            ),
            step(
                "Update production log",
                "更新 production log",
                "Record decisions, changes, progress, and supervisor feedback.",
                "记录决策、变化、研究进展和 supervisor 反馈。",
                "Medium",
                "1 hour",
                "1 小时",
            ),
            step(
                "Create outcome and presentation",
                "完成成果和展示",
                "Complete the final product and prepare a clear presentation.",
                "完成最终成果，并准备清晰的项目展示。",
                "High",
                "3 hours",
                "3 小时",
            ),
        ],
    },
    {
        id: "personal-statement",
        icon: "📝",
        subject: "University Application",
        accent: "from-rose-400/20 to-cyan-400/10",
        name: text(
            "University Personal Statement",
            "大学个人陈述 Personal Statement",
        ),
        shortName: text("Statement", "个人陈述"),
        description: text(
            "Evidence, main theme, first draft, structure, feedback, and final polish.",
            "覆盖素材、主线、初稿、结构、反馈和最终润色。",
        ),
        steps: [
            step(
                "Collect evidence and experiences",
                "收集经历和素材",
                "List academic interests, projects, reading, activities, and achievements.",
                "列出学术兴趣、项目、阅读、活动和成就。",
                "High",
                "1 hour",
                "1 小时",
            ),
            step(
                "Choose main theme",
                "确定主线主题",
                "Decide the central story or academic direction of the statement.",
                "确定个人陈述的核心故事或学术方向。",
                "High",
                "1 hour",
                "1 小时",
            ),
            step(
                "Write first draft",
                "完成 first draft",
                "Create a complete draft before refining style.",
                "先完成完整草稿，再进行语言润色。",
                "High",
                "2 hours",
                "2 小时",
            ),
            step(
                "Improve structure and evidence",
                "改进结构和证据",
                "Make each paragraph specific, relevant, and convincing.",
                "让每段都具体、相关、有说服力。",
                "Medium",
                "1.5 hours",
                "1.5 小时",
            ),
            step(
                "Get feedback and final edit",
                "获取反馈并最终润色",
                "Ask for feedback and polish clarity, tone, grammar, and limits.",
                "获取反馈，并检查清晰度、语气、语法和字数限制。",
                "High",
                "1.5 hours",
                "1.5 小时",
            ),
        ],
    },
];

function createId(prefix: string) {
    if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
        return `${prefix}-${crypto.randomUUID()}`;
    }

    return `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function getTodayInputValue() {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
}

function parseInputDate(value: string) {
    const [year, month, day] = value.split("-").map(Number);

    if (!year || !month || !day) {
        return null;
    }

    return new Date(year, month - 1, day);
}

function addDaysToToday(days: number) {
    const date = parseInputDate(getTodayInputValue()) || new Date();
    date.setDate(date.getDate() + days);

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
}

function getDaysBetweenToday(deadline: string) {
    const today = parseInputDate(getTodayInputValue());
    const target = parseInputDate(deadline);

    if (!today || !target) {
        return 0;
    }

    return Math.ceil((target.getTime() - today.getTime()) / 86_400_000);
}

function getTaskDueDate(index: number, totalTasks: number, deadline: string) {
    const totalDays = Math.max(1, getDaysBetweenToday(deadline));
    const progress = (index + 1) / totalTasks;
    const offset = Math.max(1, Math.floor(totalDays * progress));

    return addDaysToToday(Math.min(offset, totalDays));
}

function formatDate(value: string, language: Language) {
    const date = parseInputDate(value);

    if (!date) {
        return value;
    }

    return new Intl.DateTimeFormat(language === "zh" ? "zh-CN" : "en-GB", {
        year: "numeric",
        month: "short",
        day: "numeric",
    }).format(date);
}

function getPriorityLabel(priority: TaskPriority | string, language: Language) {
    if (language === "en") {
        return priority;
    }

    if (priority === "High") {
        return copy.zh.high;
    }

    if (priority === "Medium") {
        return copy.zh.medium;
    }

    return copy.zh.low;
}

function getPriorityTone(priority: TaskPriority | string) {
    if (priority === "High") {
        return "border-red-400/30 bg-red-400/10 text-red-300";
    }

    if (priority === "Medium") {
        return "border-amber-400/30 bg-amber-400/10 text-amber-300";
    }

    return "border-emerald-400/30 bg-emerald-400/10 text-emerald-300";
}

function getAdjustedSteps(template: ProjectTemplate, intensity: PlanningIntensity) {
    if (intensity === "light") {
        return template.steps.slice(0, 4);
    }

    if (intensity === "intensive") {
        return [
            ...template.steps,
            step(
                "Teacher feedback checkpoint",
                "老师反馈检查点",
                "Share progress with a teacher and record the most important feedback.",
                "向老师展示当前进度，并记录最重要的反馈。",
                "Medium",
                "45 min",
                "45 分钟",
            ),
            step(
                "Final quality check",
                "最终质量检查",
                "Check formatting, clarity, missing evidence, and final submission requirements.",
                "检查格式、清晰度、缺失证据和最终提交要求。",
                "High",
                "1 hour",
                "1 小时",
            ),
        ];
    }

    return template.steps;
}

function buildTasks(
    template: ProjectTemplate,
    language: Language,
    deadline: string,
    intensity: PlanningIntensity,
): CourseworkTask[] {
    const steps = getAdjustedSteps(template, intensity);
    const now = new Date().toISOString();

    return steps.map((item, index) => {
        const taskToSave = {
            id: createId("task"),
            title: item.title[language],
            description: item.description[language],
            status: "Todo",
            priority: item.priority,
            dueDate: getTaskDueDate(index, steps.length, deadline),
            estimatedTime: item.time[language],
            createdAt: now,
            updatedAt: now,
        };

        return taskToSave as unknown as CourseworkTask;
    });
}

function getTaskEstimatedTime(task: CourseworkTask) {
    const extendedTask = task as CourseworkTask & {
        estimatedTime?: string | null;
        time?: string | null;
        duration?: string | null;
        estimate?: string | null;
    };

    return (
        extendedTask.estimatedTime ||
        extendedTask.time ||
        extendedTask.duration ||
        extendedTask.estimate ||
        ""
    );
}

export default function NewProjectForm() {
    const language = useStoredLanguage();
    const [projectTitle, setProjectTitle] = useState("");
    const [selectedTemplateId, setSelectedTemplateId] = useState(templates[0].id);
    const [deadline, setDeadline] = useState("");
    const [planningIntensity, setPlanningIntensity] =
        useState<PlanningIntensity>("balanced");
    const [generatedPlan, setGeneratedPlan] =
        useState<GeneratedProjectPlan | null>(null);
    const [savedRouteId, setSavedRouteId] = useState("");
    const [error, setError] = useState("");

    const currentCopy = copy[language];

    const selectedTemplate = useMemo(() => {
        return (
            templates.find((template) => template.id === selectedTemplateId) ||
            templates[0]
        );
    }, [selectedTemplateId]);

    const selectedSteps = getAdjustedSteps(selectedTemplate, planningIntensity);
    const daysAvailable = deadline ? getDaysBetweenToday(deadline) : 0;

    function clearGeneratedState() {
        setGeneratedPlan(null);
        setSavedRouteId("");
    }

    function validateForm() {
        if (!projectTitle.trim()) {
            setError(currentCopy.formErrorTitleRequired);
            return false;
        }

        if (!deadline) {
            setError(currentCopy.formErrorDeadlineRequired);
            return false;
        }

        if (getDaysBetweenToday(deadline) <= 0) {
            setError(currentCopy.formErrorPastDeadline);
            return false;
        }

        setError("");
        return true;
    }

    function handleGeneratePlan() {
        if (!validateForm()) {
            return;
        }

        const now = new Date().toISOString();

        const plan = {
            id: createId("project"),
            project: {
                title: projectTitle.trim(),
                subject: selectedTemplate.subject,
                courseworkType: selectedTemplate.name.en,
                deadline,
                planningIntensity,
                createdAt: now,
                updatedAt: now,
                generatedAt: now,
            },
            tasks: buildTasks(
                selectedTemplate,
                language,
                deadline,
                planningIntensity,
            ),
            archivedTasks: [],
            archivedTaskCount: 0,
            createdAt: now,
            updatedAt: now,
            generatedAt: now,
        } as unknown as GeneratedProjectPlan;

        setGeneratedPlan(plan);
        setSavedRouteId("");
    }

    function handleSaveProject() {
        if (!generatedPlan) {
            return;
        }

        const now = new Date().toISOString();

        const planToSave = {
            ...generatedPlan,
            updatedAt: now,
            project: {
                ...generatedPlan.project,
                updatedAt: now,
            },
        } as unknown as GeneratedProjectPlan;

        saveGeneratedProjectPlan(planToSave);
        setSavedRouteId(getProjectRouteId(planToSave));
    }

    return (
        <section className="space-y-6">
            <header className="relative overflow-hidden rounded-[2.5rem] border border-slate-800 bg-slate-900 p-6 shadow-2xl shadow-cyan-950/30 sm:p-8 lg:p-10">
                <div className="pointer-events-none absolute -right-32 -top-32 h-96 w-96 rounded-full bg-cyan-400/10 blur-3xl" />
                <div className="pointer-events-none absolute -bottom-40 -left-40 h-96 w-96 rounded-full bg-emerald-400/10 blur-3xl" />

                <div className="relative z-10 grid gap-8 lg:grid-cols-[minmax(0,1.2fr)_minmax(18rem,0.8fr)] lg:items-end">
                    <div>
                        <p className="mb-4 text-sm font-black uppercase tracking-[0.2em] text-cyan-300">
                            {currentCopy.pageEyebrow}
                        </p>

                        <h1 className="max-w-5xl text-4xl font-black tracking-tight text-white sm:text-6xl">
                            {currentCopy.pageTitle}
                        </h1>

                        <p className="mt-5 max-w-4xl text-base leading-7 text-slate-300 sm:text-lg">
                            {currentCopy.pageSubtitle}
                        </p>
                    </div>

                    <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
                        {[
                            currentCopy.badgeOne,
                            currentCopy.badgeTwo,
                            currentCopy.badgeThree,
                        ].map((badge) => (
                            <div
                                key={badge}
                                className="rounded-2xl border border-slate-800 bg-slate-950/70 px-4 py-3 text-sm font-black text-slate-200"
                            >
                                {badge}
                            </div>
                        ))}
                    </div>
                </div>
            </header>

            <div className="grid gap-6 xl:grid-cols-[minmax(0,0.92fr)_minmax(0,1.08fr)]">
                <div className="space-y-6">
                    <section className="rounded-[2rem] border border-slate-800 bg-slate-900 p-5 shadow-2xl shadow-slate-950/30 sm:p-6">
                        <div className="mb-6">
                            <p className="mb-2 text-sm font-black uppercase tracking-[0.18em] text-cyan-300">
                                {currentCopy.templateStep}
                            </p>

                            <h2 className="text-2xl font-black text-white">
                                {currentCopy.templateLabel}
                            </h2>
                        </div>

                        <div className="grid gap-4 md:grid-cols-2">
                            {templates.map((template) => {
                                const isActive = template.id === selectedTemplateId;

                                return (
                                    <button
                                        key={template.id}
                                        type="button"
                                        onClick={() => {
                                            setSelectedTemplateId(template.id);
                                            clearGeneratedState();
                                        }}
                                        className={`group relative min-h-48 overflow-hidden rounded-[1.75rem] border p-5 text-left transition ${
                                            isActive
                                                ? "border-cyan-400 bg-cyan-400/10 shadow-xl shadow-cyan-950/30"
                                                : "border-slate-800 bg-slate-950/70 hover:border-cyan-400/50"
                                        }`}
                                    >
                                        <div
                                            className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${
                                                template.accent
                                            } transition ${
                                                isActive
                                                    ? "opacity-100"
                                                    : "opacity-0 group-hover:opacity-100"
                                            }`}
                                        />

                                        <div className="relative z-10 flex h-full flex-col">
                                            <div className="mb-5 flex items-center justify-between gap-3">
                                                <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-slate-700 bg-slate-950/70 text-2xl">
                                                    {template.icon}
                                                </div>

                                                {isActive ? (
                                                    <span className="rounded-full border border-cyan-400/30 bg-cyan-400/10 px-3 py-1 text-xs font-black text-cyan-300">
                            {currentCopy.selected}
                          </span>
                                                ) : null}
                                            </div>

                                            <h3 className="text-xl font-black text-white">
                                                {template.shortName[language]}
                                            </h3>

                                            <p className="mt-3 text-sm leading-6 text-slate-400">
                                                {template.description[language]}
                                            </p>
                                        </div>
                                    </button>
                                );
                            })}
                        </div>
                    </section>

                    <section className="rounded-[2rem] border border-slate-800 bg-slate-900 p-5 shadow-2xl shadow-slate-950/30 sm:p-6">
                        <div className="mb-6">
                            <p className="mb-2 text-sm font-black uppercase tracking-[0.18em] text-cyan-300">
                                {currentCopy.setupStep}
                            </p>

                            <h2 className="text-2xl font-black text-white">
                                {currentCopy.setupTitle}
                            </h2>

                            <p className="mt-2 text-sm leading-6 text-slate-400">
                                {currentCopy.setupDescription}
                            </p>
                        </div>

                        <div className="space-y-5">
                            <label className="block">
                <span className="mb-2 block text-sm font-black text-slate-300">
                  {currentCopy.projectTitleLabel}
                </span>

                                <input
                                    value={projectTitle}
                                    onChange={(event) => {
                                        setProjectTitle(event.target.value);
                                        clearGeneratedState();
                                    }}
                                    placeholder={currentCopy.projectTitlePlaceholder}
                                    className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-4 text-sm font-bold text-white outline-none transition placeholder:text-slate-600 focus:border-cyan-400"
                                />
                            </label>

                            <CalendarDateField
                                id="project-deadline"
                                label={currentCopy.deadlineLabel}
                                value={deadline}
                                min={getTodayInputValue()}
                                onChange={(nextDate) => {
                                    setDeadline(nextDate);
                                    clearGeneratedState();
                                }}
                            />

                            <div>
                                <p className="mb-3 text-sm font-black text-slate-300">
                                    {currentCopy.intensityLabel}
                                </p>

                                <div className="grid gap-3">
                                    {intensityOptions.map((option) => {
                                        const isActive = planningIntensity === option.value;

                                        return (
                                            <button
                                                key={option.value}
                                                type="button"
                                                onClick={() => {
                                                    setPlanningIntensity(option.value);
                                                    clearGeneratedState();
                                                }}
                                                className={`rounded-2xl border p-4 text-left transition ${
                                                    isActive
                                                        ? "border-emerald-400 bg-emerald-400/10"
                                                        : "border-slate-800 bg-slate-950/70 hover:border-emerald-400/50"
                                                }`}
                                            >
                                                <p
                                                    className={`text-sm font-black ${
                                                        isActive ? "text-emerald-300" : "text-white"
                                                    }`}
                                                >
                                                    {currentCopy[option.labelKey]}
                                                </p>

                                                <p className="mt-1 text-sm leading-6 text-slate-400">
                                                    {currentCopy[option.descriptionKey]}
                                                </p>
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>

                            {error ? (
                                <div className="rounded-2xl border border-red-400/30 bg-red-400/10 p-4 text-sm font-bold leading-6 text-red-200">
                                    {error}
                                </div>
                            ) : null}

                            <div className="grid gap-3 sm:grid-cols-2">
                                <button
                                    type="button"
                                    onClick={handleGeneratePlan}
                                    className="rounded-2xl bg-cyan-400 px-5 py-4 text-sm font-black text-slate-950 transition hover:bg-cyan-300"
                                >
                                    {generatedPlan
                                        ? currentCopy.regeneratePlan
                                        : currentCopy.generatePlan}
                                </button>

                                <button
                                    type="button"
                                    onClick={handleSaveProject}
                                    disabled={!generatedPlan}
                                    className={`rounded-2xl px-5 py-4 text-sm font-black transition ${
                                        generatedPlan
                                            ? "bg-emerald-400 text-slate-950 hover:bg-emerald-300"
                                            : "cursor-not-allowed border border-slate-800 bg-slate-950 text-slate-600"
                                    }`}
                                >
                                    {currentCopy.saveProject}
                                </button>
                            </div>

                            {savedRouteId ? (
                                <div className="rounded-[1.5rem] border border-emerald-400/30 bg-emerald-400/10 p-5">
                                    <p className="text-sm font-black text-emerald-300">
                                        {currentCopy.savedTitle}
                                    </p>

                                    <p className="mt-2 text-sm leading-6 text-slate-300">
                                        {currentCopy.savedDescription}
                                    </p>

                                    <Link
                                        href={`/projects/${savedRouteId}`}
                                        className="mt-4 inline-block rounded-2xl bg-emerald-400 px-5 py-3 text-sm font-black text-slate-950 transition hover:bg-emerald-300"
                                    >
                                        {currentCopy.openProject}
                                    </Link>
                                </div>
                            ) : null}
                        </div>
                    </section>
                </div>

                <aside className="xl:sticky xl:top-6 xl:self-start">
                    <section className="overflow-hidden rounded-[2rem] border border-slate-800 bg-slate-900 shadow-2xl shadow-cyan-950/30">
                        <div className="border-b border-slate-800 bg-slate-950/70 p-5 sm:p-6">
                            <p className="mb-2 text-sm font-black uppercase tracking-[0.18em] text-cyan-300">
                                {currentCopy.previewStep}
                            </p>

                            <h2 className="text-2xl font-black text-white">
                                {currentCopy.previewTitle}
                            </h2>

                            <p className="mt-2 text-sm leading-6 text-slate-400">
                                {generatedPlan
                                    ? currentCopy.previewReadyDescription
                                    : currentCopy.previewEmptyDescription}
                            </p>
                        </div>

                        <div className="grid gap-3 border-b border-slate-800 p-5 sm:grid-cols-3 sm:p-6">
                            <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-4">
                                <p className="text-xs font-black uppercase tracking-[0.14em] text-slate-500">
                                    {selectedTemplate.shortName[language]}
                                </p>

                                <p className="mt-2 text-2xl font-black text-white">
                                    {selectedTemplate.icon}
                                </p>
                            </div>

                            <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-4">
                                <p className="text-xs font-black uppercase tracking-[0.14em] text-slate-500">
                                    {currentCopy.timeline}
                                </p>

                                <p className="mt-2 text-2xl font-black text-cyan-300">
                                    {selectedSteps.length}
                                </p>
                            </div>

                            <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-4">
                                <p className="text-xs font-black uppercase tracking-[0.14em] text-slate-500">
                                    {currentCopy.deadlineLabel}
                                </p>

                                <p className="mt-2 text-sm font-black text-white">
                                    {deadline
                                        ? `${daysAvailable} ${
                                            language === "zh"
                                                ? currentCopy.daysAvailable
                                                : daysAvailable === 1
                                                    ? currentCopy.dayAvailable
                                                    : currentCopy.daysAvailable
                                        }`
                                        : currentCopy.today}
                                </p>
                            </div>
                        </div>

                        <div className="max-h-[46rem] overflow-y-auto p-5 sm:p-6">
                            {generatedPlan ? (
                                <div className="space-y-4">
                                    <div>
                                        <h3 className="text-xl font-black text-white">
                                            {generatedPlan.tasks.length}{" "}
                                            {currentCopy.tasksGenerated}
                                        </h3>

                                        <p className="mt-2 text-sm leading-6 text-slate-400">
                                            {generatedPlan.project.title}
                                        </p>
                                    </div>

                                    <div className="relative space-y-4">
                                        <div className="absolute bottom-4 left-[1.35rem] top-4 w-px bg-slate-800" />

                                        {generatedPlan.tasks.map((item, index) => (
                                            <article
                                                key={item.id || `${item.title}-${index}`}
                                                className="relative grid gap-4 rounded-[1.5rem] border border-slate-800 bg-slate-950/70 p-4 sm:grid-cols-[2.75rem_minmax(0,1fr)]"
                                            >
                                                <div className="relative z-10 flex h-11 w-11 items-center justify-center rounded-2xl border border-cyan-400/30 bg-cyan-400/10 text-sm font-black text-cyan-300">
                                                    {index + 1}
                                                </div>

                                                <div className="min-w-0">
                                                    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                                                        <div>
                                                            <h4 className="text-base font-black text-white">
                                                                {item.title}
                                                            </h4>

                                                            {item.description ? (
                                                                <p className="mt-2 text-sm leading-6 text-slate-400">
                                                                    {item.description}
                                                                </p>
                                                            ) : null}
                                                        </div>

                                                        <span
                                                            className={`w-fit rounded-full border px-3 py-1 text-xs font-black ${getPriorityTone(
                                                                String(item.priority || "Low"),
                                                            )}`}
                                                        >
                              {getPriorityLabel(
                                  String(item.priority || "Low"),
                                  language,
                              )}
                            </span>
                                                    </div>

                                                    <div className="mt-4 grid gap-3 sm:grid-cols-2">
                                                        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-3">
                                                            <p className="text-xs font-bold text-slate-500">
                                                                {currentCopy.due}
                                                            </p>

                                                            <p className="mt-1 text-sm font-black text-white">
                                                                {formatDate(String(item.dueDate || ""), language)}
                                                            </p>
                                                        </div>

                                                        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-3">
                                                            <p className="text-xs font-bold text-slate-500">
                                                                {currentCopy.estimatedTime}
                                                            </p>

                                                            <p className="mt-1 text-sm font-black text-white">
                                                                {getTaskEstimatedTime(item)}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </article>
                                        ))}
                                    </div>
                                </div>
                            ) : (
                                <div className="flex min-h-[26rem] items-center justify-center rounded-[1.5rem] border border-dashed border-slate-700 bg-slate-950/70 p-6 text-center">
                                    <div>
                                        <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-[1.75rem] border border-cyan-400/30 bg-cyan-400/10 text-4xl">
                                            🧩
                                        </div>

                                        <p className="text-xl font-black text-white">
                                            {currentCopy.previewEmptyTitle}
                                        </p>

                                        <p className="mt-3 max-w-md text-sm leading-6 text-slate-400">
                                            {currentCopy.previewEmptyDescription}
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="border-t border-slate-800 bg-slate-950/70 p-5 sm:p-6">
                            <div className="rounded-[1.5rem] border border-amber-400/30 bg-amber-400/10 p-4">
                                <p className="mb-2 text-sm font-black text-amber-300">
                                    {currentCopy.browserNoteTitle}
                                </p>

                                <p className="text-sm leading-6 text-slate-300">
                                    {currentCopy.browserNote}
                                </p>
                            </div>
                        </div>
                    </section>
                </aside>
            </div>
        </section>
    );
}
