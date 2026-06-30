"use client";

import { useMemo, useState } from "react";
import { useHasMounted, useStoredLanguage } from "@/lib/clientStores";

type FeedbackType = {
    value: string;
    en: string;
    zh: string;
};

const feedbackTypes: FeedbackType[] = [
    { value: "Bug report", en: "Bug report", zh: "问题反馈" },
    { value: "Feature request", en: "Feature request", zh: "功能建议" },
    {
        value: "Confusing experience",
        en: "Confusing experience",
        zh: "体验困惑",
    },
    {
        value: "Template suggestion",
        en: "Template suggestion",
        zh: "模板建议",
    },
    { value: "General feedback", en: "General feedback", zh: "一般反馈" },
];

const copy = {
    en: {
        eyebrow: "v1.4 student testing feedback",
        title: "Help shape the personalisation version.",
        description:
            "Coursework Compass is being improved through real student testing. Useful feedback can be short, honest, and specific. Even one confusing button is worth reporting.",
        note:
            "Your feedback does not need to be long. One sentence is useful if it tells me what worked, what confused you, or what you would want next.",
        chooseType: "Choose feedback type",
        promptsTitle: "Helpful feedback prompts",
        prompts: [
            "What did you try to do?",
            "What worked well?",
            "What was confusing?",
            "Which subject template did you test?",
            "Did English / Chinese switching work clearly?",
            "Would this help during real IA, EE, TOK, EPQ, or essay work?",
        ],
        action: "Write structured feedback",
        helper:
            "This opens your email app with a ready-made feedback template. You can edit it before sending.",
        bodyIntro:
            "I tested Coursework Compass v1.4 Personalisation Version and would like to share some feedback.",
    },
    zh: {
        eyebrow: "v1.4 学生测试反馈",
        title: "帮助完善个性化版本。",
        description:
            "Coursework Compass 正在通过真实学生测试继续改进。反馈可以很短、真实、具体。哪怕只是一个让你困惑的按钮，也值得告诉我。",
        note:
            "反馈不需要很长。只要一句话能说明哪里有用、哪里困惑、或者你希望下一步有什么功能，就很有价值。",
        chooseType: "选择反馈类型",
        promptsTitle: "可参考的反馈问题",
        prompts: [
            "你尝试完成什么操作？",
            "哪里比较有用？",
            "哪里让你困惑？",
            "你测试了哪个学科模板？",
            "英文 / 中文切换是否清楚？",
            "它会帮助你完成真实 IA、EE、TOK、EPQ 或论文吗？",
        ],
        action: "填写结构化反馈",
        helper:
            "这会打开你的邮件应用，并预填一个反馈模板。发送前你可以继续编辑。",
        bodyIntro:
            "我测试了 Coursework Compass v1.4 个性化版本，想分享一些反馈。",
    },
} as const;

function createFeedbackBody(
    feedbackType: string,
    pageUrl: string,
    bodyIntro: string,
) {
    return [
        "Hi Zichuan,",
        "",
        bodyIntro,
        "",
        `Feedback type: ${feedbackType}`,
        `Page tested: ${pageUrl}`,
        "",
        "1. What I tried to do:",
        "- ",
        "",
        "2. What I found useful:",
        "- ",
        "",
        "3. What felt confusing or difficult:",
        "- ",
        "",
        "4. What I think should be improved or added:",
        "- ",
        "",
        "5. Subject / coursework type I tested:",
        "- ",
        "",
        "6. Would I use this for real coursework? Why or why not?",
        "- ",
        "",
        "Extra notes:",
        "- ",
        "",
        "Thank you.",
    ].join("\n");
}

export default function FeedbackPanel() {
    const [selectedType, setSelectedType] = useState("General feedback");
    const hasMounted = useHasMounted();
    const language = useStoredLanguage();
    const currentCopy = copy[language];
    const pageUrl = hasMounted ? window.location.href : "Coursework Compass";

    const feedbackMailto = useMemo(() => {
        const subject = encodeURIComponent(
            `Coursework Compass v1.4 Student Testing Feedback - ${selectedType}`,
        );

        const body = encodeURIComponent(
            createFeedbackBody(selectedType, pageUrl, currentCopy.bodyIntro),
        );

        return `mailto:?subject=${subject}&body=${body}`;
    }, [currentCopy.bodyIntro, pageUrl, selectedType]);

    return (
        <section className="cc-card cc-motion-fade-up rounded-[2rem] border-fuchsia-400/30 p-5 sm:p-6">
            <div className="mb-5">
                <p className="mb-2 text-sm font-bold text-fuchsia-300">
                    {currentCopy.eyebrow}
                </p>
                <h2 className="text-2xl font-black sm:text-3xl">
                    {currentCopy.title}
                </h2>
                <p className="cc-text-muted mt-3 max-w-3xl text-sm leading-6">
                    {currentCopy.description}
                </p>

                <div className="mt-4 rounded-3xl border border-fuchsia-400/30 bg-fuchsia-400/10 p-4">
                    <p className="text-sm font-bold leading-6 text-fuchsia-200">
                        {currentCopy.note}
                    </p>
                </div>
            </div>

            <div className="grid gap-4 md:grid-cols-[0.9fr_1.1fr]">
                <div className="cc-surface-inset rounded-3xl p-4">
                    <p className="cc-text-main mb-3 text-sm font-bold">
                        {currentCopy.chooseType}
                    </p>

                    <div className="space-y-2">
                        {feedbackTypes.map((type) => (
                            <button
                                key={type.value}
                                type="button"
                                onClick={() => setSelectedType(type.value)}
                                className={`cc-interactive-button w-full rounded-2xl border px-4 py-3 text-left text-sm font-bold transition ${
                                    selectedType === type.value
                                        ? "border-fuchsia-300 bg-fuchsia-400 text-slate-950"
                                        : "cc-button-secondary hover:border-fuchsia-400 hover:text-fuchsia-300"
                                }`}
                            >
                                {type[language]}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="cc-surface-inset rounded-3xl p-4">
                    <p className="cc-text-main mb-3 text-sm font-bold">
                        {currentCopy.promptsTitle}
                    </p>

                    <ul className="cc-text-subtle space-y-2 text-sm leading-6">
                        {currentCopy.prompts.map((prompt) => (
                            <li key={prompt}>- {prompt}</li>
                        ))}
                    </ul>

                    <a
                        href={feedbackMailto}
                        className="cc-interactive-button mt-5 inline-flex rounded-2xl border border-fuchsia-400/40 bg-fuchsia-400 px-6 py-4 text-center font-bold text-slate-950 transition hover:bg-fuchsia-300"
                    >
                        {currentCopy.action}
                    </a>

                    <p className="cc-text-subtle mt-3 text-xs leading-5">
                        {currentCopy.helper}
                    </p>
                </div>
            </div>
        </section>
    );
}
