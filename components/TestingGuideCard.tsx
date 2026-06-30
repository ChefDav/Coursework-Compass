"use client";

import { useStoredLanguage } from "@/lib/clientStores";

const copy = {
    en: {
        eyebrow: "Testing guide",
        title: "Suggested student testing flow",
        description:
            "This guide gives testers a simple path through the product. It helps students understand what to try without needing a long explanation from a teacher.",
        sections: [
            {
                title: "Recommended order",
                items: [
                    "Start with the guided tutorial.",
                    "Create one sample coursework project.",
                    "Open the Dashboard to check progress.",
                    "Open Projects to find the saved project.",
                    "Open Today to check active work.",
                    "Open the project detail page and try editing tasks.",
                ],
            },
            {
                title: "Useful things to test",
                items: [
                    "Can you understand what the product is for?",
                    "Can you create a project without help?",
                    "Do the generated tasks feel useful?",
                    "Are the deadline and estimated time labels clear?",
                    "Does the mobile layout feel usable?",
                    "Is anything confusing, missing, or unnecessary?",
                ],
            },
        ],
        sampleTitle: "Good sample project ideas",
        samples: [
            "Biology IA investigation",
            "Extended Essay plan",
            "TOK Essay draft",
            "Computer Science IA project",
            "Economics commentary",
            "University personal statement",
        ],
        noteTitle: "Important",
        note:
            "Coursework Compass v1.4 is still a beta. Saved data and preferences stay in the current browser only, so students should avoid sensitive personal information during testing.",
    },
    zh: {
        eyebrow: "测试指南",
        title: "建议的学生测试流程",
        description:
            "这份指南给测试者一条简单清晰的体验路径。学生不需要老师长时间解释，也可以知道应该测试哪些地方。",
        sections: [
            {
                title: "推荐测试顺序",
                items: [
                    "先完成引导测试。",
                    "创建一个示例 coursework 项目。",
                    "打开仪表盘查看进度。",
                    "打开项目库找到保存的项目。",
                    "打开今日任务查看当前任务。",
                    "打开项目详情页，尝试编辑任务。",
                ],
            },
            {
                title: "值得测试的地方",
                items: [
                    "你能理解这个产品是用来做什么的吗？",
                    "你能在没有帮助的情况下创建项目吗？",
                    "生成出来的任务是否有用？",
                    "截止日期和预计用时标签是否清楚？",
                    "移动端布局是否好用？",
                    "有没有让你困惑、缺失或不必要的地方？",
                ],
            },
        ],
        sampleTitle: "适合测试的示例项目",
        samples: [
            "Biology IA 实验项目",
            "Extended Essay 计划",
            "TOK Essay 草稿",
            "Computer Science IA 项目",
            "Economics commentary",
            "大学个人陈述",
        ],
        noteTitle: "重要说明",
        note:
            "Coursework Compass v1.4 仍然是 beta 版本。保存的数据和偏好只会留在当前浏览器中，因此测试时请避免输入敏感个人信息。",
    },
} as const;

export default function TestingGuideCard() {
    const language = useStoredLanguage();
    const currentCopy = copy[language];

    return (
        <section className="cc-panel-strong cc-motion-fade-up relative overflow-hidden rounded-[2rem] p-5 sm:p-6 lg:p-8">
            <div className="relative z-10">
                <div className="mb-7">
                    <div className="mb-4 inline-flex rounded-full border border-emerald-400/30 bg-emerald-400/10 px-4 py-2 text-xs font-black uppercase tracking-[0.18em] text-emerald-300">
                        {currentCopy.eyebrow}
                    </div>

                    <h2 className="cc-text-main max-w-4xl text-3xl font-black tracking-tight sm:text-4xl">
                        {currentCopy.title}
                    </h2>

                    <p className="cc-text-muted mt-4 max-w-5xl text-sm leading-6 sm:text-base sm:leading-7">
                        {currentCopy.description}
                    </p>
                </div>

                <div className="grid gap-4 lg:grid-cols-2">
                    {currentCopy.sections.map((section) => (
                        <article
                            key={section.title}
                            className="cc-card cc-interactive-card cc-motion-fade-up rounded-[1.75rem] p-5"
                        >
                            <h3 className="cc-text-main mb-5 text-xl font-black">
                                {section.title}
                            </h3>

                            <ol className="space-y-4">
                                {section.items.map((item, index) => (
                                    <li key={item} className="flex gap-3">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border border-emerald-400/30 bg-emerald-400/10 text-xs font-black text-emerald-300">
                      {index + 1}
                    </span>

                                        <p className="cc-text-muted pt-1 text-sm leading-6">
                                            {item}
                                        </p>
                                    </li>
                                ))}
                            </ol>
                        </article>
                    ))}
                </div>

                <div className="cc-card cc-motion-fade-up mt-5 rounded-[1.75rem] p-5">
                    <h3 className="cc-text-main mb-5 text-xl font-black">
                        {currentCopy.sampleTitle}
                    </h3>

                    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                        {currentCopy.samples.map((sample) => (
                            <div
                                key={sample}
                                className="cc-pill-muted rounded-2xl px-4 py-3 text-sm font-bold leading-6"
                            >
                                {sample}
                            </div>
                        ))}
                    </div>
                </div>

                <div className="mt-5 rounded-[1.75rem] border border-amber-400/30 bg-amber-400/10 p-5">
                    <p className="mb-2 text-sm font-black text-amber-300">
                        {currentCopy.noteTitle}
                    </p>

                    <p className="cc-text-muted text-sm leading-6">
                        {currentCopy.note}
                    </p>
                </div>
            </div>
        </section>
    );
}
