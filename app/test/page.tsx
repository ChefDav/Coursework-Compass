"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import FeedbackPanel from "@/components/FeedbackPanel";
import { useStoredLanguage } from "@/lib/clientStores";
import type { Language } from "@/lib/i18n";

type TutorialStep = 0 | 1 | 2 | 3 | 4;
type PriorityLevel = "Low" | "Medium" | "High";

type LocalisedText = {
    en: string;
    zh: string;
};

type DemoTask = {
    id: string;
    title: LocalisedText;
    priority: PriorityLevel;
    time: string;
    status: "Todo" | "Done";
};

const copy = {
    en: {
        headerEyebrow: "Coursework Compass Tutorial",
        headerTitle: "Guided student testing flow.",
        headerDescription:
            "This tutorial is separate from the real app. It uses simulated tasks, so students can learn the workflow without changing real project data.",
        mainSite: "Main site",
        progress: "Tutorial progress",
        version: "v1.3",
        step: "Step",
        stepLabels: [
            "Choose sample",
            "Try planner",
            "Review",
            "Feedback",
            "Complete",
        ],
        sampleStep: "Step 1",
        sampleTitle: "Choose a sample project.",
        sampleDescription:
            "Pick one sample project to use for the tutorial. This does not create a real project and does not save anything to the browser.",
        template: "Template",
        deadline: "Deadline",
        intensity: "Intensity",
        continuePlanner: "Continue to planner tutorial",
        reset: "Reset tutorial",
        plannerStep: "Step 2",
        plannerTitle: "Try the planner controls yourself.",
        plannerDescription:
            "This is a simulated project board. Use the cards and form yourself; it does not affect real saved data.",
        tutorialProject: "Tutorial project",
        actionsCompleted: "Tutorial actions completed",
        taskTitle: "Task title",
        priority: "Priority",
        estimatedTime: "Estimated time",
        addTask: "Add this task",
        edit: "Edit",
        save: "Save",
        cancel: "Cancel",
        delete: "Delete",
        confirmDelete: "Confirm delete",
        deletePrompt: "Delete this tutorial task?",
        markDone: "Mark done",
        markTodo: "Mark todo",
        done: "Done",
        todo: "Todo",
        newTaskPlaceholder: "e.g. Ask teacher for feedback",
        titleError: "Please type a task title first.",
        editError: "Please type a task title before saving.",
        checklistTitle: "Complete these four real interactions.",
        checklistItems: [
            "Mark a task as done",
            "Add your own task using the form",
            "Open Edit and save a change",
            "Delete a task with confirmation",
        ],
        continueReview: "Continue to review",
        unlockNote:
            "The continue button unlocks only after the student actually uses the tutorial controls.",
        reviewStep: "Step 3",
        reviewTitle: "Review what you tested.",
        reviewDescription:
            "You have now walked through the core planner ideas in a safe tutorial space. Before sending feedback, think about what felt useful, confusing, missing, or unrealistic.",
        completedActions: "Completed tutorial actions",
        feedbackIdeas: "Feedback ideas",
        feedbackPrompts: [
            "Was the workflow easy to understand?",
            "Did the edit form feel natural?",
            "Was adding a custom task clear?",
            "Was delete confirmation useful?",
            "Would you return to this website?",
        ],
        prepareFeedback: "Prepare feedback form",
        backPlanner: "Back to planner tutorial",
        preparingFeedback: "Preparing feedback",
        feedbackTitle: "Building your feedback portal.",
        loadingProgress: "Loading progress",
        finalStep: "Final step",
        sendFeedback: "Send your feedback.",
        sendFeedbackDescription:
            "Short feedback is enough. One clear sentence can help shape the next version of Coursework Compass.",
        finished: "I finished the test",
        completeBadge: "Tutorial complete",
        completeTitle: "Congrats, you completed the guided test.",
        completeDescription:
            "You have finished the tutorial route and helped test the core Coursework Compass workflow. Now you are ready to begin the real planning journey.",
        completeCards: [
            {
                title: "You explored planning",
                description:
                    "You saw how a large coursework project can become visible tasks.",
            },
            {
                title: "You tested controls",
                description:
                    "You tried task completion, adding, editing, and deleting.",
            },
            {
                title: "You shaped the product",
                description:
                    "Your feedback helps decide what Coursework Compass becomes next.",
            },
        ],
        returnHome: "Return to main menu",
        startReal: "Officially start the journey",
        tryAgain: "Try tutorial again",
        low: "Low",
        medium: "Medium",
        high: "High",
        loadingMessages: [
            "Sorting coursework chaos into small steps...",
            "Checking the deadline pressure...",
            "Sharpening the task list...",
            "Preparing the feedback portal...",
            "Polishing the student testing route...",
            "Almost there...",
        ],
    },
    zh: {
        headerEyebrow: "Coursework Compass 教程",
        headerTitle: "引导式学生测试流程。",
        headerDescription:
            "这个教程独立于真实应用，使用模拟任务，让学生在不改变真实项目数据的情况下学习工作流。",
        mainSite: "主站",
        progress: "教程进度",
        version: "v1.3",
        step: "步骤",
        stepLabels: [
            "选择示例",
            "试用规划器",
            "回顾",
            "反馈",
            "完成",
        ],
        sampleStep: "步骤 1",
        sampleTitle: "选择一个示例项目。",
        sampleDescription:
            "选择一个示例项目用于教程。这不会创建真实项目，也不会向浏览器保存数据。",
        template: "模板",
        deadline: "截止日期",
        intensity: "规划强度",
        continuePlanner: "继续进入规划器教程",
        reset: "重置教程",
        plannerStep: "步骤 2",
        plannerTitle: "自己试用规划器控件。",
        plannerDescription:
            "这是一个模拟项目面板。请自己操作卡片和表单；它不会影响真实保存的数据。",
        tutorialProject: "教程项目",
        actionsCompleted: "已完成教程动作",
        taskTitle: "任务标题",
        priority: "优先级",
        estimatedTime: "预计用时",
        addTask: "添加这个任务",
        edit: "编辑",
        save: "保存",
        cancel: "取消",
        delete: "删除",
        confirmDelete: "确认删除",
        deletePrompt: "要删除这个教程任务吗？",
        markDone: "标记完成",
        markTodo: "恢复待办",
        done: "已完成",
        todo: "待办",
        newTaskPlaceholder: "例如：请老师给反馈",
        titleError: "请先输入任务标题。",
        editError: "请先输入任务标题，再保存。",
        checklistTitle: "完成这四个真实交互。",
        checklistItems: [
            "把一个任务标记完成",
            "用表单添加自己的任务",
            "打开编辑并保存一次更改",
            "通过确认步骤删除一个任务",
        ],
        continueReview: "继续回顾",
        unlockNote:
            "只有当学生真的使用过教程控件后，继续按钮才会解锁。",
        reviewStep: "步骤 3",
        reviewTitle: "回顾你测试了什么。",
        reviewDescription:
            "你已经在安全的教程空间走过核心规划流程。发送反馈前，可以想想哪里有用、哪里困惑、哪里缺失或不够真实。",
        completedActions: "已完成的教程动作",
        feedbackIdeas: "反馈思路",
        feedbackPrompts: [
            "这个流程容易理解吗？",
            "编辑表单用起来自然吗？",
            "添加自定义任务是否清楚？",
            "删除确认是否有帮助？",
            "你会再次使用这个网站吗？",
        ],
        prepareFeedback: "准备反馈表单",
        backPlanner: "返回规划器教程",
        preparingFeedback: "正在准备反馈",
        feedbackTitle: "正在构建你的反馈入口。",
        loadingProgress: "加载进度",
        finalStep: "最后一步",
        sendFeedback: "发送你的反馈。",
        sendFeedbackDescription:
            "简短反馈就足够。一句清楚的话也能帮助塑造 Coursework Compass 的下一个版本。",
        finished: "我完成了测试",
        completeBadge: "教程完成",
        completeTitle: "恭喜，你完成了引导测试。",
        completeDescription:
            "你已经完成教程路线，并帮助测试了 Coursework Compass 的核心工作流。现在可以开始真实规划。",
        completeCards: [
            {
                title: "你体验了规划",
                description:
                    "你看到了大型 coursework 如何变成可见任务。",
            },
            {
                title: "你测试了控件",
                description:
                    "你尝试了完成、添加、编辑和删除任务。",
            },
            {
                title: "你影响了产品",
                description:
                    "你的反馈会帮助决定 Coursework Compass 下一步变成什么样。",
            },
        ],
        returnHome: "返回主菜单",
        startReal: "正式开始规划",
        tryAgain: "再试一次教程",
        low: "低",
        medium: "中",
        high: "高",
        loadingMessages: [
            "正在把 coursework 混乱拆成小步骤...",
            "正在检查截止日期压力...",
            "正在打磨任务清单...",
            "正在准备反馈入口...",
            "正在优化学生测试路线...",
            "马上就好...",
        ],
    },
} as const;

const sampleProjects = [
    {
        id: "biology-ia",
        name: { en: "Sample Biology IA", zh: "示例 Biology IA" },
        template: "Biology IA",
        deadline: {
            en: "3 to 4 weeks from today",
            zh: "从今天起 3 到 4 周",
        },
        intensity: { en: "Balanced", zh: "平衡" },
        description: {
            en: "Good for testing science coursework planning, data collection, analysis, and evaluation tasks.",
            zh: "适合测试科学 coursework 的规划、数据收集、分析和 evaluation 任务。",
        },
    },
    {
        id: "math-ia",
        name: { en: "Sample Math IA", zh: "示例 Math IA" },
        template: "Math IA",
        deadline: {
            en: "Around one month from today",
            zh: "大约从今天起一个月",
        },
        intensity: { en: "Balanced", zh: "平衡" },
        description: {
            en: "Good for testing research question planning, exploration structure, data, graphs, and reflection.",
            zh: "适合测试 research question、探究结构、数据、图表和 reflection。",
        },
    },
    {
        id: "extended-essay",
        name: { en: "Sample Extended Essay", zh: "示例 Extended Essay" },
        template: "Extended Essay",
        deadline: {
            en: "6 to 8 weeks from today",
            zh: "从今天起 6 到 8 周",
        },
        intensity: { en: "Light or Balanced", zh: "轻量或平衡" },
        description: {
            en: "Good for testing long-term planning, research stages, source tracking, drafting, and revision.",
            zh: "适合测试长期规划、研究阶段、资料追踪、起草和修改。",
        },
    },
];

const initialDemoTasks: DemoTask[] = [
    {
        id: "task-1",
        title: {
            en: "Refine the research question",
            zh: "优化 research question",
        },
        priority: "High",
        time: "45 min",
        status: "Todo",
    },
    {
        id: "task-2",
        title: {
            en: "Create a short evidence or data collection plan",
            zh: "创建简短证据或数据收集计划",
        },
        priority: "Medium",
        time: "1 hour",
        status: "Todo",
    },
    {
        id: "task-3",
        title: {
            en: "Draft the first analysis paragraph",
            zh: "起草第一段分析",
        },
        priority: "Medium",
        time: "1.5 hours",
        status: "Todo",
    },
];

const priorityOptions: PriorityLevel[] = ["Low", "Medium", "High"];

function localText(value: LocalisedText, language: Language) {
    return value[language];
}

function getPriorityClasses(priority: PriorityLevel) {
    if (priority === "High") {
        return "border-red-400/30 bg-red-400/10 text-red-300";
    }

    if (priority === "Medium") {
        return "border-amber-400/30 bg-amber-400/10 text-amber-300";
    }

    return "border-emerald-400/30 bg-emerald-400/10 text-emerald-300";
}

function getPriorityLabel(priority: PriorityLevel, language: Language) {
    if (priority === "High") {
        return copy[language].high;
    }

    if (priority === "Medium") {
        return copy[language].medium;
    }

    return copy[language].low;
}

function isPriorityLevel(value: string): value is PriorityLevel {
    return value === "Low" || value === "Medium" || value === "High";
}

export default function StudentTestingPage() {
    const language = useStoredLanguage();
    const currentCopy = copy[language];
    const [step, setStep] = useState<TutorialStep>(0);
    const [selectedProjectId, setSelectedProjectId] = useState(
        sampleProjects[0].id,
    );
    const [demoTasks, setDemoTasks] = useState<DemoTask[]>(initialDemoTasks);

    const [hasMarkedDone, setHasMarkedDone] = useState(false);
    const [hasAddedTask, setHasAddedTask] = useState(false);
    const [hasEditedTask, setHasEditedTask] = useState(false);
    const [hasDeletedTask, setHasDeletedTask] = useState(false);

    const [newTaskTitle, setNewTaskTitle] = useState("");
    const [newTaskPriority, setNewTaskPriority] =
        useState<PriorityLevel>("Medium");
    const [newTaskTime, setNewTaskTime] = useState("30 min");
    const [newTaskError, setNewTaskError] = useState("");

    const [editingTaskId, setEditingTaskId] = useState("");
    const [editTitle, setEditTitle] = useState("");
    const [editPriority, setEditPriority] = useState<PriorityLevel>("Medium");
    const [editTime, setEditTime] = useState("");
    const [editError, setEditError] = useState("");
    const [deleteCandidateId, setDeleteCandidateId] = useState("");

    const [loadingProgress, setLoadingProgress] = useState(0);
    const [loadingMessageIndex, setLoadingMessageIndex] = useState(0);
    const [showFeedback, setShowFeedback] = useState(false);

    const selectedProject = useMemo(() => {
        return (
            sampleProjects.find((project) => project.id === selectedProjectId) ??
            sampleProjects[0]
        );
    }, [selectedProjectId]);

    const completedActions = [
        hasMarkedDone,
        hasAddedTask,
        hasEditedTask,
        hasDeletedTask,
    ].filter(Boolean).length;

    const tutorialProgress = Math.round((completedActions / 4) * 100);

    useEffect(() => {
        if (step !== 3 || showFeedback) {
            return;
        }

        const progressTimer = window.setInterval(() => {
            setLoadingProgress((currentProgress) => {
                if (currentProgress >= 100) {
                    window.clearInterval(progressTimer);
                    return 100;
                }

                return Math.min(currentProgress + 4, 100);
            });
        }, 90);

        const messageTimer = window.setInterval(() => {
            setLoadingMessageIndex((currentIndex) => {
                return (currentIndex + 1) % currentCopy.loadingMessages.length;
            });
        }, 900);

        return () => {
            window.clearInterval(progressTimer);
            window.clearInterval(messageTimer);
        };
    }, [currentCopy.loadingMessages.length, showFeedback, step]);

    useEffect(() => {
        if (step !== 3 || loadingProgress < 100) {
            return;
        }

        const revealTimer = window.setTimeout(() => {
            setShowFeedback(true);
        }, 450);

        return () => {
            window.clearTimeout(revealTimer);
        };
    }, [loadingProgress, step]);

    function handleToggleTaskStatus(taskId: string) {
        setDemoTasks((currentTasks) =>
            currentTasks.map((task) => {
                if (task.id !== taskId) {
                    return task;
                }

                const nextStatus = task.status === "Done" ? "Todo" : "Done";

                if (nextStatus === "Done") {
                    setHasMarkedDone(true);
                }

                return {
                    ...task,
                    status: nextStatus,
                };
            }),
        );
    }

    function handleAddTask() {
        const trimmedTitle = newTaskTitle.trim();
        const trimmedTime = newTaskTime.trim() || "30 min";

        if (!trimmedTitle) {
            setNewTaskError(currentCopy.titleError);
            return;
        }

        setDemoTasks((currentTasks) => [
            ...currentTasks,
            {
                id: `custom-${Date.now().toString(36)}`,
                title: {
                    en: trimmedTitle,
                    zh: trimmedTitle,
                },
                priority: newTaskPriority,
                time: trimmedTime,
                status: "Todo",
            },
        ]);

        setNewTaskTitle("");
        setNewTaskPriority("Medium");
        setNewTaskTime("30 min");
        setNewTaskError("");
        setHasAddedTask(true);
    }

    function handleStartEdit(task: DemoTask) {
        setEditingTaskId(task.id);
        setEditTitle(localText(task.title, language));
        setEditPriority(task.priority);
        setEditTime(task.time);
        setEditError("");
        setDeleteCandidateId("");
    }

    function handleCancelEdit() {
        setEditingTaskId("");
        setEditTitle("");
        setEditPriority("Medium");
        setEditTime("");
        setEditError("");
    }

    function handleSaveEdit(taskId: string) {
        const trimmedTitle = editTitle.trim();
        const trimmedTime = editTime.trim() || "30 min";

        if (!trimmedTitle) {
            setEditError(currentCopy.editError);
            return;
        }

        setDemoTasks((currentTasks) =>
            currentTasks.map((task) => {
                if (task.id !== taskId) {
                    return task;
                }

                return {
                    ...task,
                    title: {
                        ...task.title,
                        [language]: trimmedTitle,
                    },
                    priority: editPriority,
                    time: trimmedTime,
                };
            }),
        );

        setHasEditedTask(true);
        handleCancelEdit();
    }

    function handleResetTutorial() {
        setStep(0);
        setSelectedProjectId(sampleProjects[0].id);
        setDemoTasks(initialDemoTasks);
        setHasMarkedDone(false);
        setHasAddedTask(false);
        setHasEditedTask(false);
        setHasDeletedTask(false);
        setNewTaskTitle("");
        setNewTaskPriority("Medium");
        setNewTaskTime("30 min");
        setNewTaskError("");
        handleCancelEdit();
        setDeleteCandidateId("");
        setLoadingProgress(0);
        setLoadingMessageIndex(0);
        setShowFeedback(false);
    }

    function handleStartFeedbackStep() {
        setLoadingProgress(0);
        setLoadingMessageIndex(0);
        setShowFeedback(false);
        setStep(3);
    }

    return (
        <main className="cc-page-gradient cc-ambient-drift cc-text-main overflow-hidden">
            <section className="mx-auto max-w-6xl px-4 py-6 sm:px-6 sm:py-8">
                <header className="cc-card cc-motion-fade-up mb-10 flex flex-col gap-5 rounded-[2rem] p-5 sm:p-6 md:flex-row md:items-center md:justify-between">
                    <div>
                        <p className="mb-2 text-sm font-bold text-cyan-300">
                            {currentCopy.headerEyebrow}
                        </p>
                        <h1 className="text-3xl font-black tracking-tight sm:text-4xl">
                            {currentCopy.headerTitle}
                        </h1>
                        <p className="cc-text-muted mt-2 max-w-2xl text-sm leading-6">
                            {currentCopy.headerDescription}
                        </p>
                    </div>

                    <Link
                        href="/"
                        className="cc-button-secondary w-fit rounded-2xl px-5 py-3 text-sm"
                    >
                        {currentCopy.mainSite}
                    </Link>
                </header>

                <section className="cc-motion-fade-up mb-8 rounded-[2rem] border border-cyan-400/30 bg-cyan-400/10 p-5 sm:p-6">
                    <div className="mb-5 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                        <div>
                            <p className="mb-2 text-sm font-bold text-cyan-300">
                                {currentCopy.progress}
                            </p>
                            <h2 className="text-2xl font-black sm:text-3xl">
                                {currentCopy.stepLabels[step]}
                            </h2>
                        </div>

                        <div className="rounded-full border border-cyan-400/30 bg-slate-950/70 px-4 py-2 text-xs font-black uppercase tracking-[0.2em] text-cyan-300">
                            {currentCopy.version}
                        </div>
                    </div>

                    <div className="grid gap-3 md:grid-cols-5">
                        {currentCopy.stepLabels.map((label, index) => {
                            const isActive = index === step;
                            const isComplete = index < step;

                            return (
                                <div
                                    key={label}
                                    className={`rounded-2xl border p-4 ${
                                        isActive
                                            ? "border-cyan-300 bg-cyan-400 text-slate-950"
                                            : isComplete
                                                ? "border-emerald-400/30 bg-emerald-400/10 text-emerald-300"
                                                : "border-slate-800 bg-slate-950/70 text-slate-400"
                                    }`}
                                >
                                    <p className="mb-1 text-xs font-black uppercase tracking-[0.2em]">
                                        {currentCopy.step} {index + 1}
                                    </p>
                                    <p className="text-sm font-bold">{label}</p>
                                </div>
                            );
                        })}
                    </div>
                </section>

                {step === 0 ? (
                    <section className="cc-card cc-motion-fade-up rounded-[2rem] p-5 sm:p-8">
                        <p className="mb-2 text-sm font-bold text-emerald-300">
                            {currentCopy.sampleStep}
                        </p>
                        <h2 className="text-3xl font-black tracking-tight sm:text-4xl">
                            {currentCopy.sampleTitle}
                        </h2>
                        <p className="cc-text-muted mt-3 max-w-3xl text-sm leading-6">
                            {currentCopy.sampleDescription}
                        </p>

                        <div className="mt-6 grid gap-4 md:grid-cols-3">
                            {sampleProjects.map((project) => {
                                const isSelected = selectedProjectId === project.id;

                                return (
                                    <button
                                        key={project.id}
                                        type="button"
                                        onClick={() => setSelectedProjectId(project.id)}
                                        className={`cc-interactive-card rounded-[2rem] border p-5 text-left transition ${
                                            isSelected
                                                ? "border-emerald-300 bg-emerald-400 text-slate-950"
                                                : "border-slate-800 bg-slate-950/70 text-slate-300 hover:border-emerald-400 hover:text-emerald-300"
                                        }`}
                                    >
                                        <h3 className="text-xl font-black">
                                            {localText(project.name, language)}
                                        </h3>
                                        <div className="mt-4 space-y-2 text-sm leading-6">
                                            <p>
                                                <span className="font-bold">
                                                    {currentCopy.template}:
                                                </span>{" "}
                                                {project.template}
                                            </p>
                                            <p>
                                                <span className="font-bold">
                                                    {currentCopy.deadline}:
                                                </span>{" "}
                                                {localText(project.deadline, language)}
                                            </p>
                                            <p>
                                                <span className="font-bold">
                                                    {currentCopy.intensity}:
                                                </span>{" "}
                                                {localText(project.intensity, language)}
                                            </p>
                                        </div>
                                        <p className="mt-4 text-sm leading-6">
                                            {localText(project.description, language)}
                                        </p>
                                    </button>
                                );
                            })}
                        </div>

                        <div className="mt-8 flex flex-col gap-4 sm:flex-row">
                            <button
                                type="button"
                                onClick={() => setStep(1)}
                                className="cc-interactive-button rounded-2xl bg-emerald-400 px-6 py-4 font-bold text-slate-950 transition hover:bg-emerald-300"
                            >
                                {currentCopy.continuePlanner}
                            </button>

                            <button
                                type="button"
                                onClick={handleResetTutorial}
                                className="cc-button-secondary rounded-2xl px-6 py-4"
                            >
                                {currentCopy.reset}
                            </button>
                        </div>
                    </section>
                ) : null}

                {step === 1 ? (
                    <section className="cc-motion-fade-up grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
                        <div className="cc-card rounded-[2rem] p-5 sm:p-6">
                            <p className="mb-2 text-sm font-bold text-cyan-300">
                                {currentCopy.plannerStep}
                            </p>
                            <h2 className="text-3xl font-black tracking-tight">
                                {currentCopy.plannerTitle}
                            </h2>
                            <p className="mt-3 text-sm leading-6 text-slate-300">
                                {currentCopy.plannerDescription}
                            </p>

                            <div className="mt-6 rounded-3xl border border-cyan-400/30 bg-cyan-400/10 p-4">
                                <div className="mb-3 flex items-center justify-between gap-3">
                                    <p className="font-bold text-white">
                                        {localText(selectedProject.name, language)}
                                    </p>
                                    <span className="rounded-full border border-cyan-400/30 bg-slate-950/70 px-3 py-1 text-xs font-bold text-cyan-300">
                                        {currentCopy.tutorialProject}
                                    </span>
                                </div>

                                <div className="cc-progress-track h-3 overflow-hidden rounded-full bg-slate-800">
                                    <div
                                        className="cc-progress-fill h-full rounded-full bg-cyan-400 transition-all"
                                        style={{ width: `${tutorialProgress}%` }}
                                    />
                                </div>

                                <p className="mt-2 text-xs font-bold text-cyan-200">
                                    {currentCopy.actionsCompleted}: {completedActions}/4
                                </p>
                            </div>

                            <div className="mt-5 space-y-4">
                                {demoTasks.map((task) => {
                                    const isEditing = editingTaskId === task.id;
                                    const isDeleting = deleteCandidateId === task.id;
                                    const isDone = task.status === "Done";

                                    return (
                                        <article
                                            key={task.id}
                                            className={`cc-motion-fade-up rounded-[1.5rem] border p-4 ${
                                                isDone
                                                    ? "border-emerald-400/30 bg-emerald-400/10"
                                                    : "border-slate-800 bg-slate-950/70"
                                            }`}
                                        >
                                            {isEditing ? (
                                                <div className="grid gap-3">
                                                    <input
                                                        value={editTitle}
                                                        onChange={(event) => {
                                                            setEditTitle(event.target.value);
                                                            setEditError("");
                                                        }}
                                                        className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm font-bold text-white outline-none transition focus:border-cyan-300"
                                                    />

                                                    <div className="grid gap-3 sm:grid-cols-2">
                                                        <select
                                                            value={editPriority}
                                                            onChange={(event) => {
                                                                if (isPriorityLevel(event.target.value)) {
                                                                    setEditPriority(event.target.value);
                                                                }
                                                            }}
                                                            className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm font-bold text-white outline-none transition focus:border-cyan-300"
                                                        >
                                                            {priorityOptions.map((priority) => (
                                                                <option key={priority} value={priority}>
                                                                    {getPriorityLabel(priority, language)}
                                                                </option>
                                                            ))}
                                                        </select>

                                                        <input
                                                            value={editTime}
                                                            onChange={(event) =>
                                                                setEditTime(event.target.value)
                                                            }
                                                            className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm font-bold text-white outline-none transition focus:border-cyan-300"
                                                        />
                                                    </div>

                                                    {editError ? (
                                                        <p className="rounded-2xl border border-red-400/30 bg-red-400/10 p-3 text-sm font-bold text-red-300">
                                                            {editError}
                                                        </p>
                                                    ) : null}

                                                    <div className="flex flex-col gap-3 sm:flex-row">
                                                        <button
                                                            type="button"
                                                            onClick={() => handleSaveEdit(task.id)}
                                                            className="cc-interactive-button rounded-2xl bg-cyan-400 px-5 py-3 text-sm font-bold text-slate-950 transition hover:bg-cyan-300"
                                                        >
                                                            {currentCopy.save}
                                                        </button>
                                                        <button
                                                            type="button"
                                                            onClick={handleCancelEdit}
                                                            className="cc-interactive-button rounded-2xl border border-slate-700 px-5 py-3 text-sm font-bold text-white transition hover:border-slate-400"
                                                        >
                                                            {currentCopy.cancel}
                                                        </button>
                                                    </div>
                                                </div>
                                            ) : (
                                                <div>
                                                    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                                                        <div>
                                                            <h3
                                                                className={`text-lg font-black ${
                                                                    isDone
                                                                        ? "text-emerald-200 line-through"
                                                                        : "text-white"
                                                                }`}
                                                            >
                                                                {localText(task.title, language)}
                                                            </h3>
                                                            <div className="mt-3 flex flex-wrap gap-2 text-xs font-bold">
                                                                <span
                                                                    className={`rounded-full border px-3 py-1 ${getPriorityClasses(
                                                                        task.priority,
                                                                    )}`}
                                                                >
                                                                    {getPriorityLabel(task.priority, language)}
                                                                </span>
                                                                <span className="rounded-full border border-slate-700 bg-slate-900 px-3 py-1 text-slate-300">
                                                                    {task.time}
                                                                </span>
                                                                <span className="rounded-full border border-slate-700 bg-slate-900 px-3 py-1 text-slate-300">
                                                                    {isDone ? currentCopy.done : currentCopy.todo}
                                                                </span>
                                                            </div>
                                                        </div>

                                                        <div className="flex flex-col gap-3 sm:flex-row">
                                                            <button
                                                                type="button"
                                                                onClick={() => handleToggleTaskStatus(task.id)}
                                                                className="cc-interactive-button rounded-2xl bg-emerald-400 px-4 py-3 text-sm font-bold text-slate-950 transition hover:bg-emerald-300"
                                                            >
                                                                {isDone
                                                                    ? currentCopy.markTodo
                                                                    : currentCopy.markDone}
                                                            </button>
                                                            <button
                                                                type="button"
                                                                onClick={() => handleStartEdit(task)}
                                                                className="cc-interactive-button rounded-2xl border border-slate-700 px-4 py-3 text-sm font-bold text-white transition hover:border-cyan-400 hover:text-cyan-300"
                                                            >
                                                                {currentCopy.edit}
                                                            </button>
                                                            <button
                                                                type="button"
                                                                onClick={() => {
                                                                    setDeleteCandidateId(task.id);
                                                                    setEditingTaskId("");
                                                                }}
                                                                className="cc-interactive-button rounded-2xl border border-red-400/30 bg-red-400/10 px-4 py-3 text-sm font-bold text-red-300 transition hover:bg-red-400/20"
                                                            >
                                                                {currentCopy.delete}
                                                            </button>
                                                        </div>
                                                    </div>

                                                    {isDeleting ? (
                                                        <div className="mt-4 rounded-2xl border border-red-400/30 bg-red-400/10 p-4">
                                                            <p className="text-sm font-bold text-red-300">
                                                                {currentCopy.deletePrompt}
                                                            </p>
                                                            <div className="mt-3 flex flex-col gap-3 sm:flex-row">
                                                                <button
                                                                    type="button"
                                                                    onClick={() => {
                                                                        setDemoTasks((currentTasks) =>
                                                                            currentTasks.filter(
                                                                                (item) => item.id !== task.id,
                                                                            ),
                                                                        );
                                                                        setDeleteCandidateId("");
                                                                        setHasDeletedTask(true);
                                                                    }}
                                                                    className="cc-interactive-button rounded-2xl bg-red-400 px-5 py-3 text-sm font-bold text-slate-950 transition hover:bg-red-300"
                                                                >
                                                                    {currentCopy.confirmDelete}
                                                                </button>
                                                                <button
                                                                    type="button"
                                                                    onClick={() => setDeleteCandidateId("")}
                                                                    className="cc-interactive-button rounded-2xl border border-slate-700 px-5 py-3 text-sm font-bold text-white transition hover:border-slate-400"
                                                                >
                                                                    {currentCopy.cancel}
                                                                </button>
                                                            </div>
                                                        </div>
                                                    ) : null}
                                                </div>
                                            )}
                                        </article>
                                    );
                                })}
                            </div>
                        </div>

                        <aside className="space-y-5">
                            <div className="cc-motion-fade-up rounded-[2rem] border border-emerald-400/30 bg-emerald-400/10 p-5 sm:p-6">
                                <p className="mb-2 text-sm font-bold text-emerald-300">
                                    {currentCopy.addTask}
                                </p>
                                <div className="grid gap-3">
                                    <input
                                        value={newTaskTitle}
                                        onChange={(event) => {
                                            setNewTaskTitle(event.target.value);
                                            setNewTaskError("");
                                        }}
                                        placeholder={currentCopy.newTaskPlaceholder}
                                        className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm font-bold text-white outline-none transition placeholder:text-slate-500 focus:border-emerald-300"
                                    />

                                    <div className="grid gap-3 sm:grid-cols-2">
                                        <select
                                            value={newTaskPriority}
                                            onChange={(event) => {
                                                if (isPriorityLevel(event.target.value)) {
                                                    setNewTaskPriority(event.target.value);
                                                }
                                            }}
                                            className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm font-bold text-white outline-none transition focus:border-emerald-300"
                                        >
                                            {priorityOptions.map((priority) => (
                                                <option key={priority} value={priority}>
                                                    {getPriorityLabel(priority, language)}
                                                </option>
                                            ))}
                                        </select>

                                        <input
                                            value={newTaskTime}
                                            onChange={(event) =>
                                                setNewTaskTime(event.target.value)
                                            }
                                            className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm font-bold text-white outline-none transition focus:border-emerald-300"
                                        />
                                    </div>

                                    {newTaskError ? (
                                        <p className="rounded-2xl border border-red-400/30 bg-red-400/10 p-3 text-sm font-bold text-red-300">
                                            {newTaskError}
                                        </p>
                                    ) : null}

                                    <button
                                        type="button"
                                        onClick={handleAddTask}
                                        className="cc-interactive-button rounded-2xl bg-emerald-400 px-6 py-4 font-bold text-slate-950 transition hover:bg-emerald-300"
                                    >
                                        {currentCopy.addTask}
                                    </button>
                                </div>
                            </div>

                            <div className="cc-motion-fade-up rounded-[2rem] border border-cyan-400/30 bg-cyan-400/10 p-5 sm:p-6">
                                <p className="mb-2 text-sm font-bold text-cyan-300">
                                    {currentCopy.progress}
                                </p>
                                <h2 className="text-2xl font-black">
                                    {currentCopy.checklistTitle}
                                </h2>

                                <div className="mt-5 space-y-3 text-sm font-bold">
                                    {currentCopy.checklistItems.map((item, index) => {
                                        const isComplete = [
                                            hasMarkedDone,
                                            hasAddedTask,
                                            hasEditedTask,
                                            hasDeletedTask,
                                        ][index];

                                        return (
                                            <div
                                                key={item}
                                                className={`rounded-2xl border p-3 ${
                                                    isComplete
                                                        ? "border-emerald-400/30 bg-emerald-400/10 text-emerald-300"
                                                        : "border-slate-800 bg-slate-950/70 text-slate-400"
                                                }`}
                                            >
                                                {isComplete ? "✓ " : ""}
                                                {item}
                                            </div>
                                        );
                                    })}
                                </div>

                                <button
                                    type="button"
                                    onClick={() => setStep(2)}
                                    disabled={completedActions < 4}
                                    className={`mt-6 w-full rounded-2xl px-6 py-4 font-bold transition ${
                                        completedActions >= 4
                                            ? "bg-cyan-400 text-slate-950 hover:bg-cyan-300"
                                            : "cursor-not-allowed bg-slate-800 text-slate-500"
                                    }`}
                                >
                                    {currentCopy.continueReview}
                                </button>

                                <p className="mt-3 text-xs leading-5 text-slate-400">
                                    {currentCopy.unlockNote}
                                </p>
                            </div>
                        </aside>
                    </section>
                ) : null}

                {step === 2 ? (
                    <section className="cc-motion-fade-up rounded-[2rem] border border-slate-800 bg-slate-900 p-5 sm:p-8">
                        <p className="mb-2 text-sm font-bold text-fuchsia-300">
                            {currentCopy.reviewStep}
                        </p>
                        <h2 className="text-3xl font-black tracking-tight sm:text-4xl">
                            {currentCopy.reviewTitle}
                        </h2>
                        <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-300">
                            {currentCopy.reviewDescription}
                        </p>

                        <div className="mt-6 grid gap-4 md:grid-cols-2">
                            <div className="rounded-3xl border border-slate-800 bg-slate-950/70 p-5">
                                <p className="mb-2 text-sm font-bold text-emerald-300">
                                    {currentCopy.completedActions}
                                </p>
                                <div className="space-y-2 text-sm leading-6 text-slate-300">
                                    {currentCopy.checklistItems.map((item) => (
                                        <p key={item}>- {item}</p>
                                    ))}
                                </div>
                            </div>

                            <div className="rounded-3xl border border-slate-800 bg-slate-950/70 p-5">
                                <p className="mb-2 text-sm font-bold text-fuchsia-300">
                                    {currentCopy.feedbackIdeas}
                                </p>
                                <div className="space-y-2 text-sm leading-6 text-slate-300">
                                    {currentCopy.feedbackPrompts.map((item) => (
                                        <p key={item}>- {item}</p>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="mt-8 flex flex-col gap-4 sm:flex-row">
                            <button
                                type="button"
                                onClick={handleStartFeedbackStep}
                                className="cc-interactive-button rounded-2xl bg-fuchsia-400 px-6 py-4 font-bold text-slate-950 transition hover:bg-fuchsia-300"
                            >
                                {currentCopy.prepareFeedback}
                            </button>

                            <button
                                type="button"
                                onClick={() => setStep(1)}
                                className="cc-interactive-button rounded-2xl border border-slate-700 px-6 py-4 font-bold text-white transition hover:border-slate-400"
                            >
                                {currentCopy.backPlanner}
                            </button>
                        </div>
                    </section>
                ) : null}

                {step === 3 ? (
                    <section className="cc-motion-fade-up rounded-[2rem] border border-fuchsia-400/30 bg-fuchsia-400/10 p-5 sm:p-8">
                        {!showFeedback ? (
                            <div>
                                <p className="mb-2 text-sm font-bold text-fuchsia-300">
                                    {currentCopy.preparingFeedback}
                                </p>
                                <h2 className="text-3xl font-black tracking-tight sm:text-4xl">
                                    {currentCopy.feedbackTitle}
                                </h2>
                                <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-300">
                                    {currentCopy.loadingMessages[loadingMessageIndex]}
                                </p>

                                <div className="mt-8">
                                    <div className="mb-3 flex items-center justify-between">
                                        <p className="text-sm font-bold text-slate-300">
                                            {currentCopy.loadingProgress}
                                        </p>
                                        <p className="text-sm font-black text-fuchsia-300">
                                            {loadingProgress}%
                                        </p>
                                    </div>

                                    <div className="cc-progress-track h-4 overflow-hidden rounded-full bg-slate-900">
                                        <div
                                            className="cc-progress-fill h-full rounded-full bg-fuchsia-400 transition-all duration-100"
                                            style={{ width: `${loadingProgress}%` }}
                                        />
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div>
                                <div className="mb-8">
                                    <p className="mb-2 text-sm font-bold text-fuchsia-300">
                                        {currentCopy.finalStep}
                                    </p>
                                    <h2 className="text-3xl font-black tracking-tight sm:text-4xl">
                                        {currentCopy.sendFeedback}
                                    </h2>
                                    <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-300">
                                        {currentCopy.sendFeedbackDescription}
                                    </p>
                                </div>

                                <FeedbackPanel />

                                <div className="mt-6 flex flex-col gap-4 sm:flex-row">
                                    <button
                                        type="button"
                                        onClick={() => setStep(4)}
                                        className="cc-interactive-button rounded-2xl bg-emerald-400 px-6 py-4 font-bold text-slate-950 transition hover:bg-emerald-300"
                                    >
                                        {currentCopy.finished}
                                    </button>

                                    <button
                                        type="button"
                                        onClick={handleResetTutorial}
                                        className="cc-interactive-button rounded-2xl border border-slate-700 px-6 py-4 font-bold text-white transition hover:border-slate-400"
                                    >
                                        {currentCopy.reset}
                                    </button>
                                </div>
                            </div>
                        )}
                    </section>
                ) : null}

                {step === 4 ? (
                    <section className="cc-modal-motion relative overflow-hidden rounded-[2rem] border border-emerald-400/30 bg-emerald-400/10 p-6 shadow-2xl shadow-emerald-950/30 sm:p-10">
                        <div className="absolute -left-16 -top-16 h-40 w-40 rounded-full bg-cyan-400/20 blur-3xl" />
                        <div className="absolute -bottom-16 -right-16 h-48 w-48 rounded-full bg-fuchsia-400/20 blur-3xl" />

                        <div className="relative z-10">
                            <div className="mb-6 inline-flex rounded-full border border-emerald-400/30 bg-slate-950/70 px-4 py-2 text-xs font-black uppercase tracking-[0.2em] text-emerald-300">
                                {currentCopy.completeBadge}
                            </div>

                            <h2 className="max-w-4xl text-5xl font-black tracking-tight sm:text-6xl">
                                {currentCopy.completeTitle}
                            </h2>

                            <p className="mt-6 max-w-3xl text-base leading-8 text-slate-300 sm:text-lg">
                                {currentCopy.completeDescription}
                            </p>

                            <div className="mt-8 grid gap-4 md:grid-cols-3">
                                {currentCopy.completeCards.map((card, index) => (
                                    <div
                                        key={card.title}
                                        className="rounded-3xl border border-slate-800 bg-slate-950/70 p-5"
                                    >
                                        <p className="mb-2 text-sm font-black text-emerald-300">
                                            {String(index + 1).padStart(2, "0")}
                                        </p>
                                        <h3 className="font-bold text-white">{card.title}</h3>
                                        <p className="mt-2 text-sm leading-6 text-slate-400">
                                            {card.description}
                                        </p>
                                    </div>
                                ))}
                            </div>

                            <div className="mt-8 flex flex-col gap-4 sm:flex-row">
                                <Link
                                    href="/"
                                    className="cc-interactive-button rounded-[1.75rem] bg-emerald-400 px-8 py-5 text-center text-lg font-black text-slate-950 shadow-2xl shadow-emerald-950/40 transition hover:bg-emerald-300"
                                >
                                    {currentCopy.returnHome}
                                </Link>

                                <Link
                                    href="/projects/new"
                                    className="cc-interactive-button rounded-[1.75rem] border border-slate-700 px-8 py-5 text-center text-lg font-black text-white transition hover:border-cyan-400 hover:text-cyan-300"
                                >
                                    {currentCopy.startReal}
                                </Link>

                                <button
                                    type="button"
                                    onClick={handleResetTutorial}
                                    className="cc-interactive-button rounded-[1.75rem] border border-slate-700 px-8 py-5 text-center text-lg font-black text-white transition hover:border-slate-400"
                                >
                                    {currentCopy.tryAgain}
                                </button>
                            </div>
                        </div>
                    </section>
                ) : null}
            </section>
        </main>
    );
}
