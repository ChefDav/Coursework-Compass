"use client";

import { useEffect, useState } from "react";
import type { ReactNode } from "react";
import BackgroundSwitcher from "@/components/BackgroundSwitcher";
import ThemeSwitcher from "@/components/ThemeSwitcher";
import {
    getStoredLanguage,
    listenForLanguageChange,
    type Language,
} from "@/lib/i18n";

const copy = {
    en: {
        eyebrow: "Workspace preferences",
        title: "Personalise your study space",
        description:
            "Choose how Coursework Compass looks in this browser. Theme and background preferences are saved locally.",
        themeTitle: "Theme",
        themeHelper:
            "Switch between the focused dark workspace and the clean daylight workspace.",
        backgroundTitle: "Background",
        backgroundHelper:
            "Choose a subtle background atmosphere for your planner.",
        motionTitle: "Motion",
        motionHelper:
            "Subtle motion is used for feedback and polish. Your system reduced-motion preference is respected.",
        motionStatus: "Reduced motion follows your system setting.",
        storageTitle: "Saved in this browser",
        storageNote:
            "These preferences are stored locally on this device and do not affect other browsers.",
        localBadge: "Local preference",
    },
    zh: {
        eyebrow: "工作区偏好",
        title: "个性化你的学习空间",
        description:
            "选择 Coursework Compass 在当前浏览器中的显示方式。主题和背景偏好会保存在本地。",
        themeTitle: "主题",
        themeHelper: "在专注的深色工作区和干净的白昼工作区之间切换。",
        backgroundTitle: "背景",
        backgroundHelper: "为你的 planner 选择一个克制的背景氛围。",
        motionTitle: "动态效果",
        motionHelper:
            "界面会使用轻量动效提供反馈和质感，并尊重系统的减少动态效果设置。",
        motionStatus: "减少动态效果会跟随你的系统设置。",
        storageTitle: "保存在当前浏览器",
        storageNote:
            "这些偏好只会保存在当前设备的浏览器中，不会同步到其他浏览器。",
        localBadge: "本地偏好",
    },
} as const;

function PreferenceSection({
    title,
    helper,
    children,
}: {
    title: string;
    helper: string;
    children: ReactNode;
}) {
    return (
        <section className="cc-surface-muted rounded-[1.5rem] p-4 sm:p-5">
            <div className="mb-4">
                <h3 className="cc-text-main text-lg font-black leading-tight">
                    {title}
                </h3>
                <p className="cc-text-subtle mt-2 text-sm leading-6">
                    {helper}
                </p>
            </div>

            {children}
        </section>
    );
}

export default function PersonalisationPanel() {
    const [language, setLanguage] = useState<Language>("en");

    useEffect(() => {
        setLanguage(getStoredLanguage());

        return listenForLanguageChange((nextLanguage) => {
            setLanguage(nextLanguage);
        });
    }, []);

    const currentCopy = copy[language];

    return (
        <section className="cc-section cc-motion-fade-up mb-8 overflow-hidden rounded-[2rem] p-5 sm:p-6">
            <div className="grid gap-6 xl:grid-cols-[minmax(0,0.9fr)_minmax(0,1.6fr)] xl:items-start">
                <div>
                    <div className="mb-4 flex flex-wrap items-center gap-3">
                        <p className="cc-kicker">{currentCopy.eyebrow}</p>

                        <span className="cc-badge-accent">
                            {currentCopy.localBadge}
                        </span>
                    </div>

                    <h2 className="cc-section-title max-w-xl">
                        {currentCopy.title}
                    </h2>

                    <p className="cc-text-muted mt-4 max-w-2xl text-sm leading-6 sm:text-base sm:leading-7">
                        {currentCopy.description}
                    </p>

                    <div className="cc-surface-inset mt-5 rounded-[1.5rem] p-4">
                        <h3 className="cc-text-main text-base font-black">
                            {currentCopy.storageTitle}
                        </h3>
                        <p className="cc-text-subtle mt-2 text-sm leading-6">
                            {currentCopy.storageNote}
                        </p>
                    </div>
                </div>

                <div className="grid gap-4 lg:grid-cols-2">
                    <PreferenceSection
                        title={currentCopy.themeTitle}
                        helper={currentCopy.themeHelper}
                    >
                        <ThemeSwitcher compact />
                    </PreferenceSection>

                    <PreferenceSection
                        title={currentCopy.motionTitle}
                        helper={currentCopy.motionHelper}
                    >
                        <div className="cc-surface-inset rounded-2xl p-4">
                            <div className="flex items-center gap-3">
                                <span
                                    aria-hidden="true"
                                    className="cc-icon-tile h-11 w-11 shrink-0 rounded-2xl text-lg font-black"
                                >
                                    ~
                                </span>
                                <p className="cc-text-subtle text-sm font-bold leading-6">
                                    {currentCopy.motionStatus}
                                </p>
                            </div>
                        </div>
                    </PreferenceSection>

                    <div className="lg:col-span-2">
                        <PreferenceSection
                            title={currentCopy.backgroundTitle}
                            helper={currentCopy.backgroundHelper}
                        >
                            <BackgroundSwitcher />
                        </PreferenceSection>
                    </div>
                </div>
            </div>
        </section>
    );
}
