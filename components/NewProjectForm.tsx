"use client";

import { useEffect, useMemo, useState } from "react";
import {
    getProjectRouteId,
    saveGeneratedProjectPlan,
    type CourseworkTask,
    type GeneratedProjectPlan,
} from "@/lib/localStorage";
import {
    getStoredLanguage,
    listenForLanguageChange,
    type Language,
} from "@/lib/i18n";

type PlanningIntensity = "light" | "balanced" | "intensive";
type TaskPriority = "High" | "Medium" | "Low";

type TemplateTask = {
    title: {
        en: string;
        zh: string;
    };
    description: {
        en: string;
        zh: string;
    };
    priority: TaskPriority;
    estimatedTime: string;
};

type ProjectTemplate = {
    id: string;
    icon: string;
    subject: string;
    accent: string;
    name: {
        en: string;
        zh: string;
    };
    shortName: {
        en: string;
        zh: string;
    };
    description: {
        en: string;
        zh: string;
    };
    tasks: TemplateTask[];
};

const copy = {
    en: {
        pageEyebrow: "Project studio",
        pageTitle: "Build a coursework plan that actually feels usable.",
        pageSubtitle:
            "Choose a template, define the deadline, generate a realistic task timeline, then save it locally to your browser.",
        badgeOne: "Template first",
        badgeTwo: "Local beta",
        badgeThree: "Editable later",

        setupTitle: "Project setup",
        setupDescription:
            "Give the planner just enough information to create a useful first version. You can edit tasks later.",
        projectTitleLabel: "Project title",
        projectTitlePlaceholder: "e.g. Biology IA Enzyme Investigation",
        deadlineLabel: "Final deadline",
        templateLabel: "Choose a template",
        intensityLabel: "Planning style",

        light: "Light",
        lightDescription: "Fewer tasks, useful for shorter deadlines.",
        balanced: "Balanced",
        balancedDescription: "Recommended. Enough structure without becoming heavy.",
        intensive: "Intensive",
        intensiveDescription: "More checkpoints for serious drafting and feedback.",

        generatePlan: "Generate plan",
        regeneratePlan: "Regenerate plan",
        saveProject: "Save project locally",
        openProject: "Open saved project",
        savedTitle: "Project saved locally",
        savedDescription:
            "This plan is now stored in this browser. You can open it from Projects or Dashboard.",

        previewTitle: "Plan preview",
        previewEmptyTitle: "No plan generated yet",
        previewEmptyDescription:
            "Choose a template, enter a title and deadline, then generate a plan. The task timeline will appear here.",
        previewReadyDescription:
            "Review the generated timeline before saving. This is only the starting plan, so tasks can be edited later.",
        tasksGenerated: "tasks generated",
        timeline: "Generated timeline",
        due: "Due",
        priority: "Priority",
        estimatedTime: "Estimated time",

        studioNoteTitle: "Browser-only beta storage",
        studioNote:
            "Saved projects stay in this browser only. During testing, avoid sensitive personal information.",

        formErrorTitleRequired: "Please enter a project title.",
        formErrorDeadlineRequired: "Please choose a final deadline.",
        formErrorPastDeadline:
            "Please choose a future deadline so the planner can spread tasks properly.",

        low: "Low",
        medium: "Medium",
        high: "High",
        today: "Today",
        daysAvailable: "days available",
        dayAvailable: "day available",
        selected: "Selected",
    },
    zh: {
        pageEyebrow: "项目工作台",
        pageTitle: "创建一个真正能用的 coursework 计划。",
        pageSubtitle:
            "选择模板，设置截止日期，生成现实可执行的任务时间线，然后保存到当前浏览器。",
        badgeOne: "先选模板",
        badgeTwo: "本地测试版",
        badgeThree: "之后可编辑",

        setupTitle: "项目设置",
        setupDescription:
            "只需要提供最关键的信息，planner 就能生成第一版任务计划。保存后仍然可以继续编辑。",
        projectTitleLabel: "项目标题",
        projectTitlePlaceholder: "例如：Biology IA 酶实验研究",
        deadlineLabel: "最终截止日期",
        templateLabel: "选择模板",
        intensityLabel: "规划方式",

        light: "轻量",
        lightDescription: "任务更少，适合时间较短的项目。",
        balanced: "平衡",
        balancedDescription: "推荐使用。结构清晰，但不会太重。",
        intensive: "强化",
        intensiveDescription: "更多检查点，适合认真打磨和多轮反馈。",

        generatePlan: "生成计划",
        regeneratePlan: "重新生成计划",
        saveProject: "保存到当前浏览器",
        openProject: "打开已保存项目",
        savedTitle: "项目已保存在本浏览器",
        savedDescription:
            "这个计划已经保存在当前浏览器中。之后可以从 Projects 或 Dashboard 打开。",

        previewTitle: "计划预览",
        previewEmptyTitle: "还没有生成计划",
        previewEmptyDescription:
            "选择模板，输入标题和截止日期，然后生成计划。任务时间线会显示在这里。",
        previewReadyDescription:
            "保存前可以先检查生成的时间线。这只是初始计划，之后仍然可以编辑任务。",
        tasksGenerated: "个任务已生成",
        timeline: "生成任务时间线",
        due: "日期",
        priority: "优先级",
        estimatedTime: "预计用时",

        studioNoteTitle: "浏览器本地测试存储",
        studioNote:
            "保存的项目只会留在当前浏览器中。测试期间请避免输入敏感个人信息。",

        formErrorTitleRequired: "请先输入项目标题。",
        formErrorDeadlineRequired: "请先选择最终截止日期。",
        formErrorPastDeadline:
            "请选择未来的截止日期，这样 planner 才能合理分配任务。",

        low: "低",
        medium: "中",
        high: "高",
        today: "今天",
        daysAvailable: "天可用",
        dayAvailable: "天可用",
        selected: "已选择",
    },
} as const;

const templates: ProjectTemplate[] = [
    {
        id: "biology-ia",
        icon: "🧬",
        subject: "Biology",
        accent: "from-emerald-400/20 to-cyan-400/10",
        name: {
            en: "Biology IA",
            zh: "生物 IA Biology IA",
        },
        shortName: {
            en: "Bio IA",
            zh: "生物 IA",
        },
        description: {
            en: "Research question, variables, method, data, graphs, conclusion, and evaluation.",
            zh: "覆盖 research question、变量、方法、数据、图表、结论和 evaluation。",
        },
        tasks: [
            {
                title: {
                    en: "Define research question",
                    zh: "确定 research question",
                },
                description: {
                    en: "Turn your topic into a focused, testable research question.",
                    zh: "把主题收窄成清晰、可测试的研究问题。",
                },
                priority: "High",
                estimatedTime: "1 hour",
            },
            {
                title: {
                    en: "Identify variables and controls",
                    zh: "识别变量和控制因素",
                },
                description: {
                    en: "List independent, dependent, and controlled variables before planning the method.",
                    zh: "在设计方法前，列出自变量、因变量和控制变量。",
                },
                priority: "High",
                estimatedTime: "45 min",
            },
            {
                title: {
                    en: "Write method and risk assessment",
                    zh: "撰写实验方法和风险评估",
                },
                description: {
                    en: "Draft a practical method with repeats, equipment, safety, and ethical considerations.",
                    zh: "写出包含重复实验、设备、安全和伦理考虑的实验方法。",
                },
                priority: "High",
                estimatedTime: "1.5 hours",
            },
            {
                title: {
                    en: "Collect and organise data",
                    zh: "收集并整理数据",
                },
                description: {
                    en: "Record raw data clearly and prepare tables for processing.",
                    zh: "清晰记录原始数据，并整理成方便处理的表格。",
                },
                priority: "Medium",
                estimatedTime: "2 hours",
            },
            {
                title: {
                    en: "Process data and create graphs",
                    zh: "处理数据并制作图表",
                },
                description: {
                    en: "Calculate averages, uncertainty, and create appropriate graphs.",
                    zh: "计算平均值、不确定性，并制作合适的图表。",
                },
                priority: "Medium",
                estimatedTime: "2 hours",
            },
            {
                title: {
                    en: "Write conclusion and evaluation",
                    zh: "撰写 conclusion 和 evaluation",
                },
                description: {
                    en: "Link results to the research question and evaluate limitations and improvements.",
                    zh: "把结果和研究问题联系起来，并评价局限性和改进方法。",
                },
                priority: "High",
                estimatedTime: "2 hours",
            },
        ],
    },
    {
        id: "chemistry-ia",
        icon: "⚗️",
        subject: "Chemistry",
        accent: "from-lime-400/20 to-emerald-400/10",
        name: {
            en: "Chemistry IA",
            zh: "化学 IA Chemistry IA",
        },
        shortName: {
            en: "Chem IA",
            zh: "化学 IA",
        },
        description: {
            en: "Variables, method, safety, data processing, graphs, conclusion, and evaluation.",
            zh: "覆盖变量、实验方法、安全、数据处理、图表、结论和 evaluation。",
        },
        tasks: [
            {
                title: {
                    en: "Choose chemical research question",
                    zh: "确定化学 research question",
                },
                description: {
                    en: "Define a focused chemistry question with measurable variables.",
                    zh: "确定一个聚焦且变量可测量的化学研究问题。",
                },
                priority: "High",
                estimatedTime: "1 hour",
            },
            {
                title: {
                    en: "Plan variables and apparatus",
                    zh: "规划变量和实验仪器",
                },
                description: {
                    en: "List independent, dependent, and controlled variables plus required apparatus.",
                    zh: "列出自变量、因变量、控制变量和所需实验仪器。",
                },
                priority: "High",
                estimatedTime: "1 hour",
            },
            {
                title: {
                    en: "Write method and safety notes",
                    zh: "撰写实验方法和安全说明",
                },
                description: {
                    en: "Draft a repeatable method with safety risks and control measures.",
                    zh: "写出可重复的实验方法，并加入风险和控制措施。",
                },
                priority: "High",
                estimatedTime: "1.5 hours",
            },
            {
                title: {
                    en: "Collect raw data",
                    zh: "收集原始数据",
                },
                description: {
                    en: "Record raw measurements clearly with units and repeated trials.",
                    zh: "清晰记录带单位的原始数据，并包含重复实验。",
                },
                priority: "Medium",
                estimatedTime: "2 hours",
            },
            {
                title: {
                    en: "Process data and uncertainties",
                    zh: "处理数据和不确定性",
                },
                description: {
                    en: "Calculate processed values, uncertainties, and relevant graphs.",
                    zh: "计算处理后的数据、不确定性，并制作相关图表。",
                },
                priority: "High",
                estimatedTime: "2 hours",
            },
            {
                title: {
                    en: "Write conclusion and evaluation",
                    zh: "撰写 conclusion 和 evaluation",
                },
                description: {
                    en: "Explain trends, answer the research question, and evaluate limitations.",
                    zh: "解释趋势，回答研究问题，并评价实验局限。",
                },
                priority: "High",
                estimatedTime: "2 hours",
            },
        ],
    },
    {
        id: "physics-ia",
        icon: "🛰️",
        subject: "Physics",
        accent: "from-sky-400/20 to-cyan-400/10",
        name: {
            en: "Physics IA",
            zh: "物理 IA Physics IA",
        },
        shortName: {
            en: "Physics IA",
            zh: "物理 IA",
        },
        description: {
            en: "Research question, apparatus, variables, measurements, uncertainty, graphs, and evaluation.",
            zh: "覆盖 research question、仪器、变量、测量、不确定性、图表和 evaluation。",
        },
        tasks: [
            {
                title: {
                    en: "Define physics research question",
                    zh: "确定物理 research question",
                },
                description: {
                    en: "Choose a measurable physics relationship to investigate.",
                    zh: "选择一个可以测量和分析的物理关系。",
                },
                priority: "High",
                estimatedTime: "1 hour",
            },
            {
                title: {
                    en: "Plan apparatus and variables",
                    zh: "规划仪器和变量",
                },
                description: {
                    en: "Identify equipment, independent variable, dependent variable, and controlled variables.",
                    zh: "确定实验设备、自变量、因变量和控制变量。",
                },
                priority: "High",
                estimatedTime: "1 hour",
            },
            {
                title: {
                    en: "Design measurement method",
                    zh: "设计测量方法",
                },
                description: {
                    en: "Write a method that reduces random and systematic errors.",
                    zh: "写出能减少随机误差和系统误差的测量方法。",
                },
                priority: "High",
                estimatedTime: "1.5 hours",
            },
            {
                title: {
                    en: "Collect repeated measurements",
                    zh: "收集重复测量数据",
                },
                description: {
                    en: "Record repeated measurements with units and instrument precision.",
                    zh: "记录带单位的重复测量数据，并注明仪器精度。",
                },
                priority: "Medium",
                estimatedTime: "2 hours",
            },
            {
                title: {
                    en: "Calculate uncertainty and graph results",
                    zh: "计算不确定性并绘制图表",
                },
                description: {
                    en: "Process data, calculate uncertainty, and plot an appropriate graph.",
                    zh: "处理数据，计算不确定性，并绘制合适图表。",
                },
                priority: "High",
                estimatedTime: "2 hours",
            },
            {
                title: {
                    en: "Write analysis and evaluation",
                    zh: "撰写 analysis 和 evaluation",
                },
                description: {
                    en: "Explain the relationship, evaluate reliability, and suggest improvements.",
                    zh: "解释物理关系，评价可靠性，并提出改进方法。",
                },
                priority: "High",
                estimatedTime: "2 hours",
            },
        ],
    },
    {
        id: "math-ia",
        icon: "📐",
        subject: "Mathematics",
        accent: "from-amber-400/20 to-violet-400/10",
        name: {
            en: "Mathematics IA",
            zh: "数学 IA Mathematics IA",
        },
        shortName: {
            en: "Math IA",
            zh: "数学 IA",
        },
        description: {
            en: "Topic, personal engagement, mathematical modelling, analysis, reflection, and final polish.",
            zh: "覆盖选题、personal engagement、数学建模、分析、reflection 和最终润色。",
        },
        tasks: [
            {
                title: {
                    en: "Choose topic and aim",
                    zh: "确定选题和目标",
                },
                description: {
                    en: "Choose a topic with enough mathematical depth and personal interest.",
                    zh: "选择一个既有数学深度，又有个人兴趣的主题。",
                },
                priority: "High",
                estimatedTime: "1 hour",
            },
            {
                title: {
                    en: "Formulate research question",
                    zh: "形成 research question",
                },
                description: {
                    en: "Turn the idea into a focused mathematical investigation question.",
                    zh: "把想法转化为聚焦的数学探究问题。",
                },
                priority: "High",
                estimatedTime: "1 hour",
            },
            {
                title: {
                    en: "Collect data or define model",
                    zh: "收集数据或建立模型",
                },
                description: {
                    en: "Gather data, define assumptions, or choose the mathematical model.",
                    zh: "收集数据、定义假设，或选择合适的数学模型。",
                },
                priority: "High",
                estimatedTime: "2 hours",
            },
            {
                title: {
                    en: "Carry out mathematical process",
                    zh: "完成数学处理过程",
                },
                description: {
                    en: "Show calculations, graphs, modelling, or proof clearly and logically.",
                    zh: "清晰展示计算、图像、建模或证明过程。",
                },
                priority: "High",
                estimatedTime: "3 hours",
            },
            {
                title: {
                    en: "Interpret results",
                    zh: "解释结果",
                },
                description: {
                    en: "Explain what the results mean in the context of the investigation.",
                    zh: "结合探究背景解释结果的意义。",
                },
                priority: "Medium",
                estimatedTime: "1.5 hours",
            },
            {
                title: {
                    en: "Write reflection and final edit",
                    zh: "撰写 reflection 并最终修改",
                },
                description: {
                    en: "Reflect on limitations, validity, and possible improvements.",
                    zh: "反思局限性、有效性和可能的改进方向。",
                },
                priority: "High",
                estimatedTime: "2 hours",
            },
        ],
    },
    {
        id: "computer-science-ia",
        icon: "💻",
        subject: "Computer Science",
        accent: "from-cyan-400/20 to-blue-400/10",
        name: {
            en: "Computer Science IA",
            zh: "计算机科学 IA Computer Science IA",
        },
        shortName: {
            en: "CS IA",
            zh: "CS IA",
        },
        description: {
            en: "Client problem, success criteria, design, implementation, testing, and evaluation.",
            zh: "覆盖 client problem、success criteria、设计、开发、测试和 evaluation。",
        },
        tasks: [
            {
                title: {
                    en: "Define client problem",
                    zh: "定义 client problem",
                },
                description: {
                    en: "Write a clear problem statement and explain why the product is needed.",
                    zh: "写清楚问题背景，并说明为什么需要这个产品。",
                },
                priority: "High",
                estimatedTime: "1 hour",
            },
            {
                title: {
                    en: "Gather requirements",
                    zh: "收集需求",
                },
                description: {
                    en: "Create success criteria and functional requirements from the client conversation.",
                    zh: "根据 client conversation 整理 success criteria 和功能需求。",
                },
                priority: "High",
                estimatedTime: "1.5 hours",
            },
            {
                title: {
                    en: "Design product structure",
                    zh: "设计产品结构",
                },
                description: {
                    en: "Plan screens, data structures, algorithms, and user flow.",
                    zh: "规划界面、数据结构、算法和用户流程。",
                },
                priority: "High",
                estimatedTime: "2 hours",
            },
            {
                title: {
                    en: "Build core features",
                    zh: "开发核心功能",
                },
                description: {
                    en: "Implement the most important features before adding polish.",
                    zh: "先实现最重要的功能，再进行视觉和体验优化。",
                },
                priority: "High",
                estimatedTime: "3 hours",
            },
            {
                title: {
                    en: "Test with success criteria",
                    zh: "根据 success criteria 测试",
                },
                description: {
                    en: "Check whether the product meets each success criterion.",
                    zh: "检查产品是否满足每一条 success criterion。",
                },
                priority: "Medium",
                estimatedTime: "1.5 hours",
            },
            {
                title: {
                    en: "Write evaluation",
                    zh: "撰写 evaluation",
                },
                description: {
                    en: "Evaluate strengths, limitations, client feedback, and future improvements.",
                    zh: "评价优点、局限、客户反馈和未来改进方向。",
                },
                priority: "High",
                estimatedTime: "2 hours",
            },
        ],
    },
    {
        id: "extended-essay",
        icon: "📚",
        subject: "Extended Essay",
        accent: "from-violet-400/20 to-cyan-400/10",
        name: {
            en: "Extended Essay",
            zh: "拓展论文 Extended Essay",
        },
        shortName: {
            en: "EE",
            zh: "EE",
        },
        description: {
            en: "Research question, sources, outline, first draft, revision, and reflection.",
            zh: "覆盖 research question、资料、大纲、初稿、修改和 reflection。",
        },
        tasks: [
            {
                title: {
                    en: "Choose topic and research question",
                    zh: "确定 topic 和 research question",
                },
                description: {
                    en: "Narrow the topic into a researchable question.",
                    zh: "把大主题收窄成可以研究的问题。",
                },
                priority: "High",
                estimatedTime: "1.5 hours",
            },
            {
                title: {
                    en: "Collect academic sources",
                    zh: "收集学术资料",
                },
                description: {
                    en: "Find reliable books, articles, datasets, or primary sources.",
                    zh: "寻找可靠的书籍、文章、数据集或一手资料。",
                },
                priority: "High",
                estimatedTime: "2 hours",
            },
            {
                title: {
                    en: "Create essay outline",
                    zh: "制作论文大纲",
                },
                description: {
                    en: "Plan argument structure, sections, and evidence before drafting.",
                    zh: "在写作前规划论点结构、段落和证据。",
                },
                priority: "High",
                estimatedTime: "1.5 hours",
            },
            {
                title: {
                    en: "Write first draft",
                    zh: "完成 first draft",
                },
                description: {
                    en: "Write a complete rough draft without trying to perfect every sentence.",
                    zh: "先完成完整草稿，不要一开始就追求每句话完美。",
                },
                priority: "High",
                estimatedTime: "3 hours",
            },
            {
                title: {
                    en: "Revise argument and evidence",
                    zh: "修改论点和证据",
                },
                description: {
                    en: "Improve analysis, structure, citation use, and clarity.",
                    zh: "改进分析、结构、引用和表达清晰度。",
                },
                priority: "Medium",
                estimatedTime: "2 hours",
            },
            {
                title: {
                    en: "Final edit and reflection",
                    zh: "最终修改和 reflection",
                },
                description: {
                    en: "Proofread, check formatting, and prepare reflection notes.",
                    zh: "校对全文、检查格式，并准备 reflection 内容。",
                },
                priority: "Medium",
                estimatedTime: "1.5 hours",
            },
        ],
    },
    {
        id: "tok-essay",
        icon: "🧠",
        subject: "TOK",
        accent: "from-fuchsia-400/20 to-cyan-400/10",
        name: {
            en: "TOK Essay",
            zh: "知识论论文 TOK Essay",
        },
        shortName: {
            en: "TOK",
            zh: "TOK",
        },
        description: {
            en: "Prescribed title, claims, counterclaims, examples, analysis, and final proofread.",
            zh: "覆盖 prescribed title、claims、counterclaims、例子、分析和最终校对。",
        },
        tasks: [
            {
                title: {
                    en: "Choose prescribed title",
                    zh: "选择 prescribed title",
                },
                description: {
                    en: "Choose the title you can answer with the strongest examples and argument.",
                    zh: "选择你最能用例子和论证回答的题目。",
                },
                priority: "High",
                estimatedTime: "45 min",
            },
            {
                title: {
                    en: "Plan claims and counterclaims",
                    zh: "规划 claims 和 counterclaims",
                },
                description: {
                    en: "Build a balanced argument before writing the full essay.",
                    zh: "在正式写作前搭建平衡的论证结构。",
                },
                priority: "High",
                estimatedTime: "1.5 hours",
            },
            {
                title: {
                    en: "Select real-world examples",
                    zh: "选择 real-world examples",
                },
                description: {
                    en: "Choose examples that directly support your argument.",
                    zh: "选择能直接支撑论点的现实例子。",
                },
                priority: "High",
                estimatedTime: "1 hour",
            },
            {
                title: {
                    en: "Write first draft",
                    zh: "撰写 first draft",
                },
                description: {
                    en: "Turn your outline into a complete draft.",
                    zh: "把大纲扩展成完整草稿。",
                },
                priority: "High",
                estimatedTime: "2 hours",
            },
            {
                title: {
                    en: "Improve analysis",
                    zh: "加强分析",
                },
                description: {
                    en: "Make sure every example connects back to knowledge questions.",
                    zh: "确保每个例子都能回扣 knowledge questions。",
                },
                priority: "Medium",
                estimatedTime: "1.5 hours",
            },
            {
                title: {
                    en: "Final proofread",
                    zh: "最终校对",
                },
                description: {
                    en: "Check clarity, word count, structure, and formal tone.",
                    zh: "检查清晰度、字数、结构和正式语气。",
                },
                priority: "Medium",
                estimatedTime: "1 hour",
            },
        ],
    },
    {
        id: "english-io",
        icon: "🎙️",
        subject: "English",
        accent: "from-orange-400/20 to-rose-400/10",
        name: {
            en: "English Individual Oral",
            zh: "英语 IO English Individual Oral",
        },
        shortName: {
            en: "English IO",
            zh: "英语 IO",
        },
        description: {
            en: "Global issue, extract annotation, comparison, 10-minute structure, rehearsal, and final notes.",
            zh: "覆盖 global issue、文本标注、比较、10分钟结构、练习和最终提示卡。",
        },
        tasks: [
            {
                title: {
                    en: "Choose global issue",
                    zh: "确定 global issue",
                },
                description: {
                    en: "Choose a global issue that connects strongly to both works.",
                    zh: "选择一个能同时连接两部作品的 global issue。",
                },
                priority: "High",
                estimatedTime: "1 hour",
            },
            {
                title: {
                    en: "Select extracts",
                    zh: "选择 extracts",
                },
                description: {
                    en: "Choose extracts that clearly show the global issue and authorial choices.",
                    zh: "选择能清楚体现 global issue 和作者手法的文本片段。",
                },
                priority: "High",
                estimatedTime: "1 hour",
            },
            {
                title: {
                    en: "Annotate authorial choices",
                    zh: "标注 authorial choices",
                },
                description: {
                    en: "Annotate language, structure, imagery, tone, and other authorial choices.",
                    zh: "标注语言、结构、意象、语气和其他作者手法。",
                },
                priority: "High",
                estimatedTime: "1.5 hours",
            },
            {
                title: {
                    en: "Build 10-minute structure",
                    zh: "搭建 10 分钟口语结构",
                },
                description: {
                    en: "Plan introduction, extract analysis, wider work analysis, and conclusion.",
                    zh: "规划开头、片段分析、整部作品分析和结尾。",
                },
                priority: "High",
                estimatedTime: "1.5 hours",
            },
            {
                title: {
                    en: "Rehearse timing",
                    zh: "练习时间控制",
                },
                description: {
                    en: "Practise delivery and adjust pacing to fit the time limit.",
                    zh: "练习表达，并调整语速以符合时间限制。",
                },
                priority: "Medium",
                estimatedTime: "1 hour",
            },
            {
                title: {
                    en: "Prepare final bullet notes",
                    zh: "准备最终 bullet notes",
                },
                description: {
                    en: "Create concise notes that support delivery without becoming a script.",
                    zh: "准备简洁提示，不要写成完整逐字稿。",
                },
                priority: "Medium",
                estimatedTime: "45 min",
            },
        ],
    },
    {
        id: "economics-commentary",
        icon: "📈",
        subject: "Economics",
        accent: "from-amber-400/20 to-cyan-400/10",
        name: {
            en: "Economics Commentary",
            zh: "经济学 Commentary",
        },
        shortName: {
            en: "Econ",
            zh: "经济",
        },
        description: {
            en: "Article selection, key concepts, diagrams, analysis, evaluation, and citation.",
            zh: "覆盖文章选择、核心概念、图表、分析、evaluation 和引用。",
        },
        tasks: [
            {
                title: {
                    en: "Choose article",
                    zh: "选择文章",
                },
                description: {
                    en: "Select a recent article with clear economic concepts.",
                    zh: "选择一篇近期、经济概念清晰的文章。",
                },
                priority: "High",
                estimatedTime: "45 min",
            },
            {
                title: {
                    en: "Identify key concepts",
                    zh: "识别核心经济概念",
                },
                description: {
                    en: "Connect the article to syllabus concepts and theory.",
                    zh: "把文章和 syllabus concepts 以及理论连接起来。",
                },
                priority: "High",
                estimatedTime: "1 hour",
            },
            {
                title: {
                    en: "Plan diagrams",
                    zh: "规划 diagrams",
                },
                description: {
                    en: "Choose accurate diagrams and labels before drafting.",
                    zh: "在写作前确定准确的图表和标签。",
                },
                priority: "High",
                estimatedTime: "1 hour",
            },
            {
                title: {
                    en: "Write analysis",
                    zh: "撰写 analysis",
                },
                description: {
                    en: "Explain the theory and apply it directly to the article.",
                    zh: "解释理论，并直接应用到文章内容中。",
                },
                priority: "High",
                estimatedTime: "1.5 hours",
            },
            {
                title: {
                    en: "Write evaluation",
                    zh: "撰写 evaluation",
                },
                description: {
                    en: "Evaluate stakeholders, short-run and long-run effects, and limitations.",
                    zh: "评价 stakeholders、短期长期影响和局限性。",
                },
                priority: "High",
                estimatedTime: "1.5 hours",
            },
            {
                title: {
                    en: "Check word count and citation",
                    zh: "检查字数和引用",
                },
                description: {
                    en: "Make sure the commentary follows word count and citation requirements.",
                    zh: "确保 commentary 符合字数和引用要求。",
                },
                priority: "Medium",
                estimatedTime: "45 min",
            },
        ],
    },
    {
        id: "epq",
        icon: "🗂️",
        subject: "EPQ",
        accent: "from-teal-400/20 to-emerald-400/10",
        name: {
            en: "EPQ Project",
            zh: "EPQ 项目 EPQ Project",
        },
        shortName: {
            en: "EPQ",
            zh: "EPQ",
        },
        description: {
            en: "Question, research, production log, planning, project outcome, evaluation, and presentation.",
            zh: "覆盖选题、research、production log、项目规划、成果、evaluation 和 presentation。",
        },
        tasks: [
            {
                title: {
                    en: "Define project question",
                    zh: "确定项目问题",
                },
                description: {
                    en: "Turn your broad idea into a focused and manageable EPQ question.",
                    zh: "把大方向收窄成聚焦且可完成的 EPQ 问题。",
                },
                priority: "High",
                estimatedTime: "1 hour",
            },
            {
                title: {
                    en: "Create initial project plan",
                    zh: "制定初始项目计划",
                },
                description: {
                    en: "Plan research stages, milestones, and the final outcome.",
                    zh: "规划研究阶段、里程碑和最终成果形式。",
                },
                priority: "High",
                estimatedTime: "1.5 hours",
            },
            {
                title: {
                    en: "Collect and evaluate sources",
                    zh: "收集并评价资料",
                },
                description: {
                    en: "Find sources and record their reliability, usefulness, and limitations.",
                    zh: "寻找资料，并记录可靠性、用途和局限。",
                },
                priority: "High",
                estimatedTime: "2 hours",
            },
            {
                title: {
                    en: "Update production log",
                    zh: "更新 production log",
                },
                description: {
                    en: "Record decisions, changes, research progress, and supervisor feedback.",
                    zh: "记录决策、变化、研究进展和 supervisor 反馈。",
                },
                priority: "Medium",
                estimatedTime: "1 hour",
            },
            {
                title: {
                    en: "Create project outcome",
                    zh: "完成项目成果",
                },
                description: {
                    en: "Write the report, build the artefact, or complete the chosen final product.",
                    zh: "撰写报告、制作 artefact，或完成选定的最终成果。",
                },
                priority: "High",
                estimatedTime: "3 hours",
            },
            {
                title: {
                    en: "Prepare evaluation and presentation",
                    zh: "准备 evaluation 和 presentation",
                },
                description: {
                    en: "Evaluate the process and prepare a clear presentation of your project.",
                    zh: "评价项目过程，并准备清晰的项目展示。",
                },
                priority: "High",
                estimatedTime: "2 hours",
            },
        ],
    },
    {
        id: "personal-statement",
        icon: "📝",
        subject: "University Application",
        accent: "from-rose-400/20 to-cyan-400/10",
        name: {
            en: "University Personal Statement",
            zh: "大学个人陈述 Personal Statement",
        },
        shortName: {
            en: "Statement",
            zh: "个人陈述",
        },
        description: {
            en: "Evidence, main theme, first draft, structure, feedback, and final polish.",
            zh: "覆盖素材、主线、初稿、结构、反馈和最终润色。",
        },
        tasks: [
            {
                title: {
                    en: "Collect evidence and experiences",
                    zh: "收集经历和素材",
                },
                description: {
                    en: "List academic interests, projects, reading, activities, and achievements.",
                    zh: "列出学术兴趣、项目、阅读、活动和成就。",
                },
                priority: "High",
                estimatedTime: "1 hour",
            },
            {
                title: {
                    en: "Choose main theme",
                    zh: "确定主线主题",
                },
                description: {
                    en: "Decide the central story or academic direction of the statement.",
                    zh: "确定个人陈述的核心故事或学术方向。",
                },
                priority: "High",
                estimatedTime: "1 hour",
            },
            {
                title: {
                    en: "Write first draft",
                    zh: "完成 first draft",
                },
                description: {
                    en: "Create a complete draft before refining style.",
                    zh: "先完成完整草稿，再进行语言润色。",
                },
                priority: "High",
                estimatedTime: "2 hours",
            },
            {
                title: {
                    en: "Improve structure and evidence",
                    zh: "改进结构和证据",
                },
                description: {
                    en: "Make each paragraph specific, relevant, and convincing.",
                    zh: "让每段都具体、相关、有说服力。",
                },
                priority: "Medium",
                estimatedTime: "1.5 hours",
            },
            {
                title: {
                    en: "Get feedback",
                    zh: "获取反馈",
                },
                description: {
                    en: "Ask a teacher or mentor for comments and improvement suggestions.",
                    zh: "请老师或 mentor 提供修改意见。",
                },
                priority: "Medium",
                estimatedTime: "1 hour",
            },
            {
                title: {
                    en: "Final edit",
                    zh: "最终润色",
                },
                description: {
                    en: "Check clarity, tone, grammar, and character or word limits.",
                    zh: "检查清晰度、语气、语法和字数限制。",
                },
                priority: "High",
                estimatedTime: "1 hour",
            },
        ],
    },
];

const intensityOptions: {
    value: PlanningIntensity;
    labelKey: "light" | "balanced" | "intensive";
    descriptionKey:
        | "lightDescription"
        | "balancedDescription"
        | "intensiveDescription";
}[] = [
    {
        value: "light",
        labelKey: "light",
        descriptionKey: "lightDescription",
    },
    {
        value: "balanced",
        labelKey: "balanced",
        descriptionKey: "balancedDescription",
    },
    {
        value: "intensive",
        labelKey: "intensive",
        descriptionKey: "intensiveDescription",
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

function addDaysToToday(days: number) {
    const date = new Date(getTodayInputValue());
    date.setDate(date.getDate() + days);

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
}

function getDaysBetweenToday(deadline: string) {
    const today = new Date(getTodayInputValue());
    const target = new Date(deadline);

    if (Number.isNaN(target.getTime())) {
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
    if (!value) {
        return "";
    }

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
        return value;
    }

    return new Intl.DateTimeFormat(language === "zh" ? "zh-CN" : "en-GB", {
        year: "numeric",
        month: "short",
        day: "numeric",
    }).format(date);
}

function getPriorityLabel(priority: TaskPriority, language: Language) {
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

function getPriorityTone(priority: TaskPriority) {
    if (priority === "High") {
        return "border-red-400/30 bg-red-400/10 text-red-300";
    }

    if (priority === "Medium") {
        return "border-amber-400/30 bg-amber-400/10 text-amber-300";
    }

    return "border-emerald-400/30 bg-emerald-400/10 text-emerald-300";
}

function getAdjustedTemplateTasks(
    template: ProjectTemplate,
    intensity: PlanningIntensity,
) {
    const extraTasks: TemplateTask[] =
        intensity === "intensive"
            ? [
                {
                    title: {
                        en: "Teacher feedback checkpoint",
                        zh: "老师反馈检查点",
                    },
                    description: {
                        en: "Share progress with a teacher and record the most important feedback.",
                        zh: "向老师展示当前进度，并记录最重要的反馈。",
                    },
                    priority: "Medium",
                    estimatedTime: "45 min",
                },
                {
                    title: {
                        en: "Final quality check",
                        zh: "最终质量检查",
                    },
                    description: {
                        en: "Check formatting, clarity, missing evidence, and final submission requirements.",
                        zh: "检查格式、清晰度、缺失证据和最终提交要求。",
                    },
                    priority: "High",
                    estimatedTime: "1 hour",
                },
            ]
            : [];

    if (intensity === "light") {
        return template.tasks.slice(0, 5);
    }

    return [...template.tasks, ...extraTasks];
}

function buildTasks(
    template: ProjectTemplate,
    language: Language,
    deadline: string,
    intensity: PlanningIntensity,
): CourseworkTask[] {
    const selectedTasks = getAdjustedTemplateTasks(template, intensity);

    return selectedTasks.map((task, index) => ({
        id: createId("task"),
        title: task.title[language],
        description: task.description[language],
        status: "Todo" as CourseworkTask["status"],
        priority: task.priority as CourseworkTask["priority"],
        dueDate: getTaskDueDate(index, selectedTasks.length, deadline),
        estimatedTime: task.estimatedTime,
        archived: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    }));
}

export default function NewProjectForm() {
    const [language, setLanguage] = useState<Language>("en");
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

    useEffect(() => {
        setLanguage(getStoredLanguage());

        const unsubscribe = listenForLanguageChange((nextLanguage) => {
            setLanguage(nextLanguage);
        });

        return () => {
            unsubscribe();
        };
    }, []);

    const selectedTemplate = useMemo(() => {
        return (
            templates.find((template) => template.id === selectedTemplateId) ||
            templates[0]
        );
    }, [selectedTemplateId]);

    const selectedTemplateTaskCount = getAdjustedTemplateTasks(
        selectedTemplate,
        planningIntensity,
    ).length;

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

        const plan: GeneratedProjectPlan = {
            id: createId("project"),
            project: {
                title: projectTitle.trim(),
                type: selectedTemplate.name.en,
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
        };

        setGeneratedPlan(plan);
        setSavedRouteId("");
    }

    function handleSaveProject() {
        if (!generatedPlan) {
            return;
        }

        const now = new Date().toISOString();

        const planToSave: GeneratedProjectPlan = {
            ...generatedPlan,
            updatedAt: now,
            project: {
                ...generatedPlan.project,
                updatedAt: now,
            },
        };

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
                                01
                            </p>
                            <h2 className="text-2xl font-black text-white">
                                {currentCopy.templateLabel}
                            </h2>
                        </div>

                        <div className="grid gap-3 md:grid-cols-2">
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
                                        className={`group relative overflow-hidden rounded-[1.5rem] border p-4 text-left transition ${
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

                                        <div className="relative z-10">
                                            <div className="mb-4 flex items-center justify-between gap-3">
                                                <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-slate-700 bg-slate-950/70 text-2xl">
                                                    {template.icon}
                                                </div>

                                                {isActive ? (
                                                    <span className="rounded-full border border-cyan-400/30 bg-cyan-400/10 px-3 py-1 text-xs font-black text-cyan-300">
                            {currentCopy.selected}
                          </span>
                                                ) : null}
                                            </div>

                                            <h3 className="text-lg font-black text-white">
                                                {template.shortName[language]}
                                            </h3>

                                            <p className="mt-2 text-sm leading-6 text-slate-400">
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
                                02
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

                            <label className="block">
                <span className="mb-2 block text-sm font-black text-slate-300">
                  {currentCopy.deadlineLabel}
                </span>

                                <input
                                    type="date"
                                    value={deadline}
                                    min={getTodayInputValue()}
                                    onChange={(event) => {
                                        setDeadline(event.target.value);
                                        clearGeneratedState();
                                    }}
                                    className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-4 text-sm font-bold text-white outline-none transition focus:border-cyan-400"
                                />
                            </label>

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

                                    <a
                                        href={`/projects/${savedRouteId}`}
                                        className="mt-4 inline-block rounded-2xl bg-emerald-400 px-5 py-3 text-sm font-black text-slate-950 transition hover:bg-emerald-300"
                                    >
                                        {currentCopy.openProject}
                                    </a>
                                </div>
                            ) : null}
                        </div>
                    </section>
                </div>

                <aside className="xl:sticky xl:top-6 xl:self-start">
                    <section className="overflow-hidden rounded-[2rem] border border-slate-800 bg-slate-900 shadow-2xl shadow-cyan-950/30">
                        <div className="border-b border-slate-800 bg-slate-950/70 p-5 sm:p-6">
                            <p className="mb-2 text-sm font-black uppercase tracking-[0.18em] text-cyan-300">
                                03
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
                                    {selectedTemplateTaskCount}
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
                                            {generatedPlan.tasks.length} {currentCopy.tasksGenerated}
                                        </h3>
                                        <p className="mt-2 text-sm leading-6 text-slate-400">
                                            {generatedPlan.project.title}
                                        </p>
                                    </div>

                                    <div className="relative space-y-4">
                                        <div className="absolute bottom-4 left-[1.35rem] top-4 w-px bg-slate-800" />

                                        {generatedPlan.tasks.map((task, index) => (
                                            <article
                                                key={task.id}
                                                className="relative grid gap-4 rounded-[1.5rem] border border-slate-800 bg-slate-950/70 p-4 sm:grid-cols-[2.75rem_minmax(0,1fr)]"
                                            >
                                                <div className="relative z-10 flex h-11 w-11 items-center justify-center rounded-2xl border border-cyan-400/30 bg-cyan-400/10 text-sm font-black text-cyan-300">
                                                    {index + 1}
                                                </div>

                                                <div className="min-w-0">
                                                    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                                                        <div>
                                                            <h4 className="text-base font-black text-white">
                                                                {task.title}
                                                            </h4>
                                                            {task.description ? (
                                                                <p className="mt-2 text-sm leading-6 text-slate-400">
                                                                    {task.description}
                                                                </p>
                                                            ) : null}
                                                        </div>

                                                        <span
                                                            className={`w-fit rounded-full border px-3 py-1 text-xs font-black ${getPriorityTone(
                                                                task.priority as TaskPriority,
                                                            )}`}
                                                        >
                              {getPriorityLabel(
                                  task.priority as TaskPriority,
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
                                                                {formatDate(task.dueDate || "", language)}
                                                            </p>
                                                        </div>

                                                        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-3">
                                                            <p className="text-xs font-bold text-slate-500">
                                                                {currentCopy.estimatedTime}
                                                            </p>
                                                            <p className="mt-1 text-sm font-black text-white">
                                                                {task.estimatedTime}
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
                                    {currentCopy.studioNoteTitle}
                                </p>
                                <p className="text-sm leading-6 text-slate-300">
                                    {currentCopy.studioNote}
                                </p>
                            </div>
                        </div>
                    </section>
                </aside>
            </div>
        </section>
    );
}