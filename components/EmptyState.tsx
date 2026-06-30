"use client";

import Link from "next/link";
import { useStoredLanguage } from "@/lib/clientStores";
import {
    createTranslator,
    type Language,
    type TranslationKey,
} from "@/lib/i18n";

type EmptyStateAction = {
    label: string;
    href: string;
    variant?: "primary" | "secondary";
    labelKey?: TranslationKey;
};

type EmptyStateProps = {
    eyebrow: string;
    title: string;
    description: string;
    icon?: string;
    actions?: EmptyStateAction[];
    tips?: string[];
    eyebrowKey?: TranslationKey;
    titleKey?: TranslationKey;
    descriptionKey?: TranslationKey;
    tipKeys?: TranslationKey[];
};

const zhKnownText: Record<string, string> = {
    dashboard: "仪表盘",
    projects: "项目",
    today: "今日任务",

    "dashboard is empty": "仪表盘还是空的",
    "your dashboard is waiting for a project": "你的仪表盘正在等待第一个项目",
    "no coursework projects yet": "还没有 coursework 项目",
    "no projects yet": "还没有项目",
    "no saved projects yet": "还没有保存的项目",

    "your dashboard will become useful once you create your first coursework project start with a template choose a deadline and coursework compass will turn the project into a task plan":
        "创建第一个 coursework 项目后，你的仪表盘才会开始发挥作用。你可以先选择模板、设置截止日期，然后让 Coursework Compass 把项目拆成清晰的任务计划。",

    "once you create a coursework project your progress and active work will appear here":
        "创建 coursework 项目后，项目进度和当前任务会显示在这里。",

    "your saved coursework projects will appear here after you create your first project":
        "创建第一个项目后，你保存的 coursework 项目会显示在这里。",

    "create your first coursework plan to start tracking tasks deadlines and progress":
        "创建第一个 coursework 计划后，就可以开始跟踪任务、截止日期和进度。",

    "projects library is empty": "项目库还是空的",
    "project library is empty": "项目库还是空的",
    "your coursework library is waiting for its first project":
        "你的 coursework 项目库正在等待第一个项目。",
    "once you create a project it will appear here as part of your coursework library you can return to it later edit tasks check progress and keep the project moving":
        "创建项目后，它会作为 coursework 项目库的一部分显示在这里。你之后可以随时回来编辑任务、查看进度，并继续推进项目。",

    "saved projects": "已保存项目",
    "project library": "项目库",
    "your project library is empty": "你的项目库还是空的",
    "your saved project library is empty": "你的项目库还是空的",

    "your saved projects will appear here after you create your first coursework plan":
        "创建第一个 coursework 计划后，你保存的项目会显示在这里。",

    "create a sample project first so you can test dashboard today and project detail pages":
        "建议先创建一个示例项目，这样可以测试仪表盘、今日任务和项目详情页。",

    "saved projects stay in this browser only during the beta":
        "测试版期间，保存的项目只会留在当前浏览器中。",

    "you can delete local projects from this page if you want to reset your workspace":
        "你可以在这个页面删除本地项目，重置自己的工作区。",

    "use projects as your long term coursework shelf":
        "你可以把 Projects 当作长期 coursework 项目书架。",
    "each saved plan can be opened again from this page":
        "每个保存的计划之后都可以从这个页面重新打开。",
    "start with one project first rather than creating too many at once":
        "建议先从一个项目开始，不要一次创建太多。",
    "templates are designed for ia ee tok essays epq and more":
        "模板目前覆盖 IA、EE、TOK、论文、EPQ 等项目类型。",

    "nothing due today": "今天没有截止任务",
    "nothing to do today": "今天没有待办任务",
    "no tasks due today": "今天没有截止任务",
    "no active tasks": "暂无待办任务",
    "this project has no active tasks right now": "这个项目目前没有活跃任务",

    "today is clear": "今天很干净",
    "your today list is clear": "你的今日任务列表是空的",
    "your today page is clear": "你的今日页面是空的",

    "today has nothing to show because no project exists yet":
        "Today 还没有内容，因为目前还没有项目。",
    "create your first coursework project and today will start showing the next useful tasks to work on":
        "创建第一个 coursework 项目后，Today 会开始显示接下来最值得处理的任务。",

    "active tasks from saved projects will appear here when they are due or need attention":
        "保存项目中的活跃任务会在到期或需要注意时显示在这里。",

    "you do not have any active tasks due today create a project or check your project pages to plan future work":
        "你今天没有需要处理的活跃任务。你可以创建项目，或打开项目页面规划后续工作。",

    "you do not have any tasks due today create a project or check your project pages to plan future work":
        "你今天没有今天截止的任务。你可以创建项目，或打开项目页面规划后续工作。",

    "create one project first to activate your today page":
        "先创建一个项目，Today 页面才会开始显示内容。",
    "the tutorial lets you practise without saving real data":
        "引导测试可以让你先练习流程，不会保存真实项目数据。",
    "today will become your daily action list once tasks exist":
        "有任务后，Today 会变成你的每日行动清单。",
    "your saved data stays in this browser during the beta":
        "测试版期间，你保存的数据只会留在当前浏览器中。",

    "tasks you mark as done will update project progress automatically":
        "你标记为完成的任务会自动更新项目进度。",
    "if a project has no tasks open its project detail page and add custom tasks":
        "如果项目没有任务，可以打开项目详情页添加自定义任务。",
    "deadline labels help you spot urgent or overdue work":
        "截止日期标签可以帮助你发现紧急或逾期任务。",
    "create more projects to compare progress across coursework":
        "创建更多项目后，你可以对比不同 coursework 的进度。",

    "project not found": "未找到项目",
    "this project is not saved here": "这个项目没有保存在当前浏览器中",
    "this project could not be found in this browser it may have been deleted reset or saved in another browser or device":
        "当前浏览器中找不到这个项目。它可能已被删除、重置，或保存在另一台设备 / 另一个浏览器中。",

    "the current beta stores project data locally in this browser":
        "当前 beta 版本会把项目数据保存在本浏览器中。",
    "if you reset local data old project links will no longer open":
        "如果你重置本地数据，旧的项目链接将无法打开。",
    "create a new project to start a fresh saved plan":
        "创建一个新项目，开始新的保存计划。",
    "cloud sync is planned for a later version":
        "云端同步会在后续版本中规划。",

    "archived completed tasks stay out of the active workspace":
        "归档后的已完成任务不会继续占用当前工作区。",
    "adding new work can restore archived context when needed":
        "添加新任务时，可以根据需要恢复相关项目上下文。",
    "use custom tasks for teacher feedback corrections or extra drafting":
        "你可以用自定义任务记录老师反馈、修改工作或额外草稿。",
    "today will show active todo tasks from this project":
        "今日任务页面会显示这个项目中的活跃待办任务。",

    "create first project": "创建第一个项目",
    "create a project": "创建项目",
    "create project": "创建项目",
    "create new project": "创建新项目",
    "try guided tutorial": "尝试引导测试",
    "open guided tutorial": "打开引导测试",
    "open tutorial": "打开引导测试",
    "join student test": "参加学生测试",
    "start planning": "开始规划",
    "back to home": "返回首页",
    "back to dashboard": "返回仪表盘",
    "back to projects": "返回项目列表",
    "open projects": "打开项目列表",
    "open today": "打开今日任务",
    "go to today": "前往今日任务",

    "best starting point create one sample project first":
        "建议先创建一个示例项目作为起点。",
    "your project data is stored locally in this browser during the beta":
        "测试版期间，你的项目数据只会保存在当前浏览器中。",
    "dashboard will show progress risk and active projects after you save a plan":
        "保存计划后，仪表盘会显示进度、风险和活跃项目。",
    "student testers can use the tutorial before creating real project data":
        "学生测试者可以先完成引导测试，再创建真实项目数据。",

    "projects are saved only in this browser during the beta":
        "测试版期间，项目只会保存在当前浏览器中。",
    "use reset data only if you want to remove local projects from this browser":
        "只有在你想删除当前浏览器中的本地项目时，才使用重置数据。",
    "try the guided test first if you are not sure how the planner works":
        "如果你还不熟悉这个 planner，可以先完成引导测试。",
    "avoid sensitive personal information during testing":
        "测试期间请避免输入敏感个人信息。",

    "browser only storage": "浏览器本地存储",
    "browser only beta storage": "浏览器本地测试存储",
    "local beta storage": "本地测试存储",
    "testing tips": "测试提示",
};

const zhFallbackRules: {
    includes: string;
    result: string;
}[] = [
    {
        includes: "coursework library is waiting",
        result: "你的 coursework 项目库正在等待第一个项目。",
    },
    {
        includes: "once you create a project it will appear here",
        result:
            "创建项目后，它会作为 coursework 项目库的一部分显示在这里。你之后可以随时回来编辑任务、查看进度，并继续推进项目。",
    },
    {
        includes: "today has nothing to show",
        result: "Today 还没有内容，因为目前还没有项目。",
    },
    {
        includes: "today will start showing",
        result:
            "创建第一个 coursework 项目后，Today 会开始显示接下来最值得处理的任务。",
    },
    {
        includes: "use projects as your long term coursework shelf",
        result: "你可以把 Projects 当作长期 coursework 项目书架。",
    },
    {
        includes: "each saved plan can be opened again",
        result: "每个保存的计划之后都可以从这个页面重新打开。",
    },
    {
        includes: "start with one project first",
        result: "建议先从一个项目开始，不要一次创建太多。",
    },
    {
        includes: "templates are designed",
        result: "模板目前覆盖 IA、EE、TOK、论文、EPQ 等项目类型。",
    },
    {
        includes: "create one project first to activate",
        result: "先创建一个项目，Today 页面才会开始显示内容。",
    },
    {
        includes: "tutorial lets you practise",
        result: "引导测试可以让你先练习流程，不会保存真实项目数据。",
    },
    {
        includes: "daily action list",
        result: "有任务后，Today 会变成你的每日行动清单。",
    },
    {
        includes: "saved data stays in this browser",
        result: "测试版期间，你保存的数据只会留在当前浏览器中。",
    },
];

function normaliseText(value: string) {
    return value
        .trim()
        .replace(/[’']/g, "")
        .replace(/[/]/g, " ")
        .replace(/[-]/g, " ")
        .replace(/[。.!！?？,:;，：；]+/g, " ")
        .replace(/\s+/g, " ")
        .trim()
        .toLowerCase();
}

function localiseText(value: string, language: Language) {
    if (language !== "zh") {
        return value;
    }

    const exactKey = normaliseText(value);

    if (zhKnownText[exactKey]) {
        return zhKnownText[exactKey];
    }

    const fallbackMatch = zhFallbackRules.find((rule) =>
        exactKey.includes(rule.includes),
    );

    if (fallbackMatch) {
        return fallbackMatch.result;
    }

    return value;
}

function getActionClasses(variant: "primary" | "secondary" | undefined) {
    if (variant === "secondary") {
        return "rounded-2xl border border-slate-700 px-5 py-3 text-center text-sm font-bold text-white transition hover:border-cyan-400 hover:text-cyan-300";
    }

    return "rounded-2xl bg-cyan-400 px-5 py-3 text-center text-sm font-bold text-slate-950 transition hover:bg-cyan-300";
}

export default function EmptyState({
                                       eyebrow,
                                       title,
                                       description,
                                       icon = "🧭",
                                       actions = [],
                                       tips = [],
                                       eyebrowKey,
                                       titleKey,
                                       descriptionKey,
                                       tipKeys,
                                   }: EmptyStateProps) {
    const language = useStoredLanguage();
    const t = createTranslator(language);

    const displayEyebrow = eyebrowKey
        ? t(eyebrowKey)
        : localiseText(eyebrow, language);

    const displayTitle = titleKey ? t(titleKey) : localiseText(title, language);

    const displayDescription = descriptionKey
        ? t(descriptionKey)
        : localiseText(description, language);

    const displayTips =
        tipKeys && tipKeys.length > 0
            ? tipKeys.map((tipKey) => t(tipKey))
            : tips.map((tip) => localiseText(tip, language));

    return (
        <section className="overflow-hidden rounded-[2rem] border border-slate-800 bg-slate-900 p-5 shadow-2xl shadow-cyan-950/20 sm:p-8">
            <div className="relative">
                <div className="absolute -right-24 -top-24 h-56 w-56 rounded-full bg-cyan-400/10 blur-3xl" />
                <div className="absolute -bottom-28 -left-28 h-56 w-56 rounded-full bg-emerald-400/10 blur-3xl" />

                <div className="relative z-10">
                    <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-[1.5rem] border border-cyan-400/30 bg-cyan-400/10 text-3xl">
                        {icon}
                    </div>

                    <p className="mb-2 text-sm font-black uppercase tracking-[0.18em] text-cyan-300">
                        {displayEyebrow}
                    </p>

                    <h2 className="max-w-3xl text-3xl font-black tracking-tight text-white sm:text-4xl">
                        {displayTitle}
                    </h2>

                    <p className="mt-4 max-w-3xl text-sm leading-6 text-slate-300 sm:text-base sm:leading-7">
                        {displayDescription}
                    </p>

                    {actions.length > 0 ? (
                        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                            {actions.map((action) => {
                                const displayLabel = action.labelKey
                                    ? t(action.labelKey)
                                    : localiseText(action.label, language);

                                return (
                                    <Link
                                        key={`${action.href}-${action.label}`}
                                        href={action.href}
                                        className={getActionClasses(action.variant)}
                                    >
                                        {displayLabel}
                                    </Link>
                                );
                            })}
                        </div>
                    ) : null}

                    {displayTips.length > 0 ? (
                        <div className="mt-7 rounded-[1.5rem] border border-slate-800 bg-slate-950/70 p-4 sm:rounded-[2rem] sm:p-5">
                            <p className="mb-3 text-xs font-black uppercase tracking-[0.18em] text-slate-500">
                                {language === "zh" ? "测试提示" : "Testing tips"}
                            </p>

                            <div className="grid gap-3 md:grid-cols-2">
                                {displayTips.map((tip) => (
                                    <div
                                        key={tip}
                                        className="rounded-2xl border border-slate-800 bg-slate-900/80 p-4"
                                    >
                                        <p className="text-sm leading-6 text-slate-300">{tip}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ) : null}
                </div>
            </div>
        </section>
    );
}
