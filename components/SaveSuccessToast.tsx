"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useStoredLanguage } from "@/lib/clientStores";
import {
    createTranslator,
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
    "Project deleted": "项目已删除",
    "Completed tasks archived": "已完成任务已归档",
    "Archived tasks restored": "已归档任务已恢复",
    "Project details saved": "项目详情已保存",
    "Task changes saved": "任务更改已保存",
    "Task marked done": "任务已标记完成",
    "Task restored": "任务已恢复",
    "Completed tasks kept": "已完成任务已保留",
    "Local data reset": "本地数据已重置",

    "Your changes have been saved locally in this browser.":
        "你的更改已保存在当前浏览器中。",
    "Changes saved locally in this browser.":
        "更改已保存在当前浏览器中。",
    "Your coursework plan is saved in this browser. You can now view it in Dashboard, Projects, or Today.":
        "你的 coursework 计划已保存在当前浏览器中。现在可以在仪表盘、项目列表或今日任务中查看。",
    "Your new task has been added. Today, Dashboard, and this project have been updated.":
        "你的新任务已添加。今日任务、仪表盘和当前项目都已更新。",
    "Your task edits have been saved locally in this browser.":
        "你的任务编辑已保存在当前浏览器中。",
    "Nice work. Your progress has been saved and recalculated.":
        "做得好。你的进度已保存并重新计算。",
    "This task has been restored to todo and your progress has been updated.":
        "这个任务已恢复为待办，项目进度也已更新。",
    "The task has been removed and project progress has been recalculated.":
        "这个任务已删除，项目进度已重新计算。",
    "Completed tasks have been archived so the active workspace stays clean.":
        "已完成任务已归档，活跃工作区会保持清爽。",
    "Archived tasks have been restored to the active project because new work was added.":
        "因为添加了新工作，已归档任务已恢复到活跃项目中。",
    "Completed tasks will stay visible in this project. You can add new work later if the project changes.":
        "已完成任务会继续显示在这个项目中。如果项目之后有变化，你仍然可以添加新工作。",
    "Your project title, deadline, or settings have been updated.":
        "你的项目标题、截止日期或设置已更新。",
    "All local Coursework Compass projects have been removed from this browser.":
        "当前浏览器中的所有 Coursework Compass 本地项目都已删除。",

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
    const language = useStoredLanguage();
    const [toast, setToast] = useState<SaveSuccessEventDetail | null>(null);
    const hideTimerRef = useRef<number | null>(null);

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
        <section className="cc-panel-strong cc-toast-motion fixed bottom-4 left-3 right-3 z-[70] rounded-[1.5rem] border-emerald-400/30 p-4 backdrop-blur-md sm:bottom-6 sm:left-auto sm:right-6 sm:w-[28rem] sm:rounded-[1.75rem]">
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
                            <p className="cc-text-muted mt-1 text-sm leading-5 sm:leading-6">
                                {displayMessage}
                            </p>
                        </div>

                        <button
                            type="button"
                            onClick={() => setToast(null)}
                            className="cc-button-secondary shrink-0 rounded-xl px-3 py-2 text-xs"
                        >
                            {t("close")}
                        </button>
                    </div>

                    {toast.actionHref && displayActionLabel ? (
                        <Link
                            href={toast.actionHref}
                            className="cc-interactive-button mt-4 inline-block rounded-2xl bg-emerald-400 px-4 py-3 text-sm font-bold text-slate-950 transition hover:bg-emerald-300"
                        >
                            {displayActionLabel}
                        </Link>
                    ) : null}

                    <div className="cc-progress-track mt-4 h-1 overflow-hidden rounded-full">
                        <div className="cc-progress-fill h-full w-full origin-left animate-[saveToastBar_4.2s_linear_forwards] rounded-full bg-emerald-400" />
                    </div>
                </div>
            </div>
        </section>
    );
}
