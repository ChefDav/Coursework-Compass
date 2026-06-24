export type Language = "en" | "zh";

export type TranslationKey = keyof typeof translations.en;

export const LANGUAGE_STORAGE_KEY = "coursework-compass-language";
export const LANGUAGE_CHANGED_EVENT = "coursework-compass-language-changed";

export const languages: {
    code: Language;
    label: string;
    shortLabel: string;
}[] = [
    {
        code: "en",
        label: "English",
        shortLabel: "EN",
    },
    {
        code: "zh",
        label: "简体中文",
        shortLabel: "中文",
    },
];

export const translations = {
    en: {
        appName: "Coursework Compass",
        versionLabel: "v1.3 Multilingual Foundation",

        language: "Language",
        english: "English",
        simplifiedChinese: "Simplified Chinese",

        mainMenu: "Main menu",
        dashboard: "Dashboard",
        projects: "Projects",
        today: "Today",
        newProject: "New Project",
        updates: "Updates",
        resetData: "Reset data",

        startPlanning: "Start planning",
        joinStudentTest: "Join student test",
        viewReleaseNotes: "View release notes",
        backToHome: "Back to home",
        createProject: "Create project",
        createNewProject: "Create new project",
        backToProjects: "Back to projects",

        browserOnlyStorageTitle: "Browser-only beta storage",
        browserOnlyStorageShort:
            "Your projects are saved in this browser only. They may not appear on another device, another browser, private browsing, or after clearing browser data. Avoid sensitive personal information during testing.",
        browserOnlyStorageLong:
            "Your projects are saved in this browser's local storage, not in a cloud account. If you change device, browser, or clear browser data, your saved projects may not appear. Please avoid entering sensitive personal information during testing.",
        localOnly: "Local only",

        savedSuccessfully: "Saved successfully",
        savedLocallyMessage:
            "Your changes have been saved locally in this browser.",

        somethingNeedsAttention: "Something needs attention",
        taskTitleRequired: "Task title required",
        projectTitleRequired: "Project title required",
        enterTaskTitleBeforeSaving:
            "Please enter a task title before saving this change.",
        enterTaskTitleBeforeAdding:
            "Please enter a task title before adding it.",
        enterProjectTitleBeforeSaving:
            "Please enter a project title before saving.",

        edit: "Edit",
        delete: "Delete",
        cancel: "Cancel",
        close: "Close",
        saveChanges: "Save changes",
        confirmDelete: "Confirm delete",
        markDone: "Mark done",
        markAsTodo: "Mark as todo",
        addTask: "Add task",
        archiveCompletedTasks: "Archive completed tasks",

        deadline: "Deadline",
        dueDate: "Due date",
        estimatedTime: "Estimated time",
        priority: "Priority",
        status: "Status",
        progress: "Progress",
        notSet: "Not set",
        dueToday: "Due today",
        daysLeft: "days left",
        dayLeft: "day left",
        overdue: "overdue",

        low: "Low",
        medium: "Medium",
        high: "High",
        todo: "Todo",
        done: "Done",

        projectNotFound: "Project not found",
        projectNotSavedHere: "This project is not saved here.",
        projectNotSavedHereDescription:
            "This project could not be found in this browser. It may have been deleted, reset, or saved in another browser or device.",

        noProjectsYet: "No projects yet",
        noActiveTasks: "No active tasks",
        noActiveTasksTitle: "This project has no active tasks right now.",

        worldClock: "World clock",
        dragThisAreaToMove: "Drag this area to move",
        systemTime: "System time",
        beijingTime: "Beijing time",
        utcTime: "UTC time",
        uaeTime: "UAE time",
        open: "Open",
        minimise: "Min",
        showTime: "Show time",
    },

    zh: {
        appName: "Coursework Compass",
        versionLabel: "v1.3 双语基础版",

        language: "语言",
        english: "English",
        simplifiedChinese: "简体中文",

        mainMenu: "主菜单",
        dashboard: "仪表盘",
        projects: "项目",
        today: "今日任务",
        newProject: "新建项目",
        updates: "更新日志",
        resetData: "重置数据",

        startPlanning: "开始规划",
        joinStudentTest: "参加学生测试",
        viewReleaseNotes: "查看更新日志",
        backToHome: "返回首页",
        createProject: "创建项目",
        createNewProject: "创建新项目",
        backToProjects: "返回项目列表",

        browserOnlyStorageTitle: "浏览器本地测试存储",
        browserOnlyStorageShort:
            "你的项目只会保存在当前浏览器中。更换设备、浏览器、无痕模式或清除浏览器数据后，项目可能不会显示。测试时请避免输入敏感个人信息。",
        browserOnlyStorageLong:
            "当前 beta 版本会把项目数据保存在本浏览器的 localStorage 中，而不是云端账号中。如果你更换设备、浏览器，或清除浏览器数据，之前保存的项目可能不会显示。测试时请避免输入敏感个人信息。",
        localOnly: "仅本地保存",

        savedSuccessfully: "保存成功",
        savedLocallyMessage: "你的更改已保存在当前浏览器中。",

        somethingNeedsAttention: "这里需要检查一下",
        taskTitleRequired: "需要填写任务标题",
        projectTitleRequired: "需要填写项目标题",
        enterTaskTitleBeforeSaving: "请先输入任务标题，再保存这个更改。",
        enterTaskTitleBeforeAdding: "请先输入任务标题，再添加任务。",
        enterProjectTitleBeforeSaving: "请先输入项目标题，再保存。",

        edit: "编辑",
        delete: "删除",
        cancel: "取消",
        close: "关闭",
        saveChanges: "保存更改",
        confirmDelete: "确认删除",
        markDone: "标记完成",
        markAsTodo: "恢复待办",
        addTask: "添加任务",
        archiveCompletedTasks: "归档已完成任务",

        deadline: "截止日期",
        dueDate: "任务日期",
        estimatedTime: "预计用时",
        priority: "优先级",
        status: "状态",
        progress: "进度",
        notSet: "未设置",
        dueToday: "今天截止",
        daysLeft: "天剩余",
        dayLeft: "天剩余",
        overdue: "已逾期",

        low: "低",
        medium: "中",
        high: "高",
        todo: "待办",
        done: "已完成",

        projectNotFound: "未找到项目",
        projectNotSavedHere: "这个项目没有保存在当前浏览器中。",
        projectNotSavedHereDescription:
            "当前浏览器中找不到这个项目。它可能已被删除、重置，或保存在另一台设备 / 另一个浏览器中。",

        noProjectsYet: "还没有项目",
        noActiveTasks: "暂无待办任务",
        noActiveTasksTitle: "这个项目目前没有活跃任务。",

        worldClock: "世界时钟",
        dragThisAreaToMove: "拖动这里移动",
        systemTime: "系统时间",
        beijingTime: "北京时间",
        utcTime: "UTC 时间",
        uaeTime: "阿联酋时间",
        open: "展开",
        minimise: "收起",
        showTime: "显示时间",
    },
} as const;

export function isLanguage(value: string | null): value is Language {
    return value === "en" || value === "zh";
}

export function getStoredLanguage(): Language {
    if (typeof window === "undefined") {
        return "en";
    }

    const savedLanguage = window.localStorage.getItem(LANGUAGE_STORAGE_KEY);

    if (isLanguage(savedLanguage)) {
        return savedLanguage;
    }

    return "en";
}

export function saveStoredLanguage(language: Language) {
    if (typeof window === "undefined") {
        return;
    }

    window.localStorage.setItem(LANGUAGE_STORAGE_KEY, language);

    window.dispatchEvent(
        new CustomEvent(LANGUAGE_CHANGED_EVENT, {
            detail: {
                language,
            },
        }),
    );
}

export function translate(language: Language, key: TranslationKey) {
    return translations[language][key] || translations.en[key] || key;
}

export function createTranslator(language: Language) {
    return function t(key: TranslationKey) {
        return translate(language, key);
    };
}

export function listenForLanguageChange(callback: (language: Language) => void) {
    if (typeof window === "undefined") {
        return () => {};
    }

    function handleLanguageChange(event: Event) {
        const customEvent = event as CustomEvent<{ language?: Language }>;
        const nextLanguage = customEvent.detail?.language;

        if (nextLanguage) {
            callback(nextLanguage);
            return;
        }

        callback(getStoredLanguage());
    }

    window.addEventListener(LANGUAGE_CHANGED_EVENT, handleLanguageChange);

    return () => {
        window.removeEventListener(LANGUAGE_CHANGED_EVENT, handleLanguageChange);
    };
}