"use client";

import { useEffect, useRef, useState } from "react";
import {
    createTranslator,
    getStoredLanguage,
    listenForLanguageChange,
    type Language,
    type TranslationKey,
} from "@/lib/i18n";

type SaveSuccessEventDetail = {
    title?: string;
    message?: string;
    actionLabel?: string;
    actionHref?: string;
    titleKey?: TranslationKey;
    messageKey?: TranslationKey;
    actionLabelKey?: TranslationKey;
};

const SAVE_SUCCESS_EVENT_NAME = "coursework-compass-save-success";

const zhKnownText: Record<string, string> = {
    "Saved successfully": "保存成功",
    "Project saved locally": "项目已保存在本地",
    "Project updated locally": "项目已在本地更新",
    "Task saved locally": "任务已保存在本地",
    "Task updated locally": "任务已在本地更新",
    "Task added locally": "任务已添加到本地",
    "Task deleted locally": "任务已从本地删除",
    "Project deleted locally": "项目已从本地删除",
    "Completed tasks archived": "已完成任务已归档",
    "Project details saved": "项目详情已保存",

    "Your changes have been saved locally in this browser.":
        "你的更改已保存在当前浏览器中。",
    "Your coursework plan is saved in this browser.":
        "你的 coursework 计划已保存在当前浏览器中。",
    "Your coursework plan is saved in this browser. You can now view it in Dashboard, Projects, or Today.":
        "你的 coursework 计划已保存在当前浏览器中。现在可以在仪表盘、项目列表或今日任务中查看。",
    "Your project has been saved locally in this browser.":
        "你的项目已保存在当前浏览器中。",
    "Your project has been updated locally in this browser.":
        "你的项目已在当前浏览器中更新。",
    "Your task has been updated locally in this browser.":
        "你的任务已在当前浏览器中更新。",
    "Your task has been added locally in this browser.":
        "你的任务已添加并保存在当前浏览器中。",
    "Your task has been deleted locally in this browser.":
        "你的任务已从当前浏览器中删除。",
    "Your project has been deleted locally in this browser.":
        "你的项目已从当前浏览器中删除。",
    "Completed tasks have been archived locally in this browser.":
        "已完成任务已在当前浏览器中归档。",
    "Project details have been saved locally in this browser.":
        "项目详情已保存在当前浏览器中。",

    "Open dashboard": "打开仪表盘",
    "Open Dashboard": "打开仪表盘",
    "Open project": "打开项目",
    "View project": "查看项目",
    "View projects": "查看项目列表",
    "View today": "查看今日任务",
    "Open Today": "打开今日任务",
};

function normaliseText(value: string | undefined) {
    return value?.replace(/\s+/g, " ").trim() || "";
}

function localiseText(value: string | undefined, language: Language) {
    const normalisedValue = normaliseText(value);

    if (!normalisedValue) {
        return "";
    }

    if (language === "zh") {
        if (zhKnownText[normalisedValue]) {
            return zhKnownText[normalisedValue];
        }

        const lowerValue = normalisedValue.toLowerCase();

        if (lowerValue.includes("coursework plan") && lowerValue.includes("saved")) {
            return "你的 coursework 计划已保存在当前浏览器中。现在可以在仪表盘、项目列表或今日任务中查看。";
        }

        if (lowerValue.includes("project") && lowerValue.includes("saved")) {
            return "你的项目已保存在当前浏览器中。";
        }

        if (lowerValue.includes("project") && lowerValue.includes("updated")) {
            return "你的项目已在当前浏览器中更新。";
        }

        if (lowerValue.includes("task") && lowerValue.includes("added")) {
            return "你的任务已添加并保存在当前浏览器中。";
        }

        if (lowerValue.includes("task") && lowerValue.includes("updated")) {
            return "你的任务已在当前浏览器中更新。";
        }

        if (lowerValue.includes("task") && lowerValue.includes("deleted")) {
            return "你的任务已从当前浏览器中删除。";
        }

        if (lowerValue.includes("dashboard")) {
            return "打开仪表盘";
        }

        if (lowerValue.includes("projects")) {
            return "查看项目列表";
        }

        if (lowerValue.includes("today")) {
            return "查看今日任务";
        }
    }

    return normalisedValue;
}

export default function SaveSuccessToast() {
    const [language, setLanguage] = useState<Language>("en");
    const [toast, setToast] = useState<SaveSuccessEventDetail | null>(null);
    const hideTimerRef = useRef<number | null>(null);

    useEffect(() => {
        setLanguage(getStoredLanguage());

        const unsubscribe = listenForLanguageChange((nextLanguage) => {
            setLanguage(nextLanguage);
        });

        return () => {
            unsubscribe();
        };
    }, []);

    useEffect(() => {
        function handleSaveSuccess(event: Event) {
            const customEvent = event as CustomEvent<SaveSuccessEventDetail>;
            const detail = customEvent.detail || {};

            if (hideTimerRef.current) {
                window.clearTimeout(hideTimerRef.current);
            }

            setToast({
                title: detail.title,
                message: detail.message,
                actionLabel: detail.actionLabel,
                actionHref: detail.actionHref,
                titleKey: detail.titleKey,
                messageKey: detail.messageKey,
                actionLabelKey: detail.actionLabelKey,
            });

            hideTimerRef.current = window.setTimeout(() => {
                setToast(null);
            }, 4200);
        }

        window.addEventListener(SAVE_SUCCESS_EVENT_NAME, handleSaveSuccess);

        return () => {
            window.removeEventListener(SAVE_SUCCESS_EVENT_NAME, handleSaveSuccess);

            if (hideTimerRef.current) {
                window.clearTimeout(hideTimerRef.current);
            }
        };
    }, []);

    if (!toast) {
        return null;
    }

    const t = createTranslator(language);

    const displayTitle = toast.titleKey
        ? t(toast.titleKey)
        : localiseText(toast.title, language) || t("savedSuccessfully");

    const displayMessage = toast.messageKey
        ? t(toast.messageKey)
        : localiseText(toast.message, language) || t("savedLocallyMessage");

    const displayActionLabel = toast.actionLabelKey
        ? t(toast.actionLabelKey)
        : localiseText(toast.actionLabel, language);

    return (
        <section className="fixed bottom-4 left-3 right-3 z-[70] rounded-[1.5rem] border border-emerald-400/30 bg-slate-950/95 p-4 text-white shadow-2xl shadow-emerald-950/40 backdrop-blur-md sm:bottom-6 sm:left-auto sm:right-6 sm:w-[28rem] sm:rounded-[1.75rem]">
            <div className="flex gap-3 sm:gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-emerald-400/30 bg-emerald-400/10 text-lg sm:h-12 sm:w-12 sm:text-xl">
                    ✓
                </div>

                <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                            <p className="text-sm font-black text-emerald-300">
                                {displayTitle}
                            </p>
                            <p className="mt-1 text-sm leading-5 text-slate-300 sm:leading-6">
                                {displayMessage}
                            </p>
                        </div>

                        <button
                            type="button"
                            onClick={() => setToast(null)}
                            className="shrink-0 rounded-xl border border-slate-700 px-3 py-2 text-xs font-bold text-slate-400 transition hover:border-slate-400 hover:text-white"
                        >
                            {t("close")}
                        </button>
                    </div>

                    {toast.actionHref && displayActionLabel ? (
                        <a
                            href={toast.actionHref}
                            className="mt-4 inline-block rounded-2xl bg-emerald-400 px-4 py-3 text-sm font-bold text-slate-950 transition hover:bg-emerald-300"
                        >
                            {displayActionLabel}
                        </a>
                    ) : null}

                    <div className="mt-4 h-1 overflow-hidden rounded-full bg-slate-800">
                        <div className="h-full w-full origin-left animate-[saveToastBar_4.2s_linear_forwards] rounded-full bg-emerald-400" />
                    </div>
                </div>
            </div>
        </section>
    );
}