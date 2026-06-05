"use client";

import { useEffect, useMemo, useState } from "react";

const feedbackTypes = [
    "Bug report",
    "Feature request",
    "Confusing experience",
    "Template suggestion",
    "General feedback",
];

function createFeedbackBody(feedbackType: string, pageUrl: string) {
    return [
        "Hi Zichuan,",
        "",
        "I tested Coursework Compass v1.2 Student Testing Polish and would like to share some feedback.",
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
    const [pageUrl, setPageUrl] = useState("Coursework Compass");

    useEffect(() => {
        setPageUrl(window.location.href);
    }, []);

    const feedbackMailto = useMemo(() => {
        const subject = encodeURIComponent(
            `Coursework Compass v1.2 Student Testing Feedback - ${selectedType}`,
        );

        const body = encodeURIComponent(createFeedbackBody(selectedType, pageUrl));

        return `mailto:?subject=${subject}&body=${body}`;
    }, [pageUrl, selectedType]);

    return (
        <section className="rounded-[2rem] border border-fuchsia-400/30 bg-fuchsia-400/10 p-5 shadow-2xl shadow-fuchsia-950/20 sm:p-6">
            <div className="mb-5">
                <p className="mb-2 text-sm font-bold text-fuchsia-300">
                    v1.2 student testing feedback
                </p>
                <h2 className="text-2xl font-black sm:text-3xl">
                    Help shape the next version.
                </h2>
                <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-300">
                    Coursework Compass is being improved through real student testing.
                    Useful feedback can be short, honest, and specific. Even one confusing
                    button is worth reporting.
                </p>

                <div className="mt-4 rounded-3xl border border-fuchsia-400/30 bg-slate-950/60 p-4">
                    <p className="text-sm font-bold leading-6 text-fuchsia-200">
                        Your feedback does not need to be long. One sentence is useful if it
                        tells me what worked, what confused you, or what you would want
                        next.
                    </p>
                </div>
            </div>

            <div className="grid gap-4 md:grid-cols-[0.9fr_1.1fr]">
                <div className="rounded-3xl border border-slate-800 bg-slate-950/70 p-4">
                    <p className="mb-3 text-sm font-bold text-white">
                        Choose feedback type
                    </p>

                    <div className="space-y-2">
                        {feedbackTypes.map((type) => (
                            <button
                                key={type}
                                type="button"
                                onClick={() => setSelectedType(type)}
                                className={`w-full rounded-2xl border px-4 py-3 text-left text-sm font-bold transition ${
                                    selectedType === type
                                        ? "border-fuchsia-300 bg-fuchsia-400 text-slate-950"
                                        : "border-slate-800 bg-slate-900 text-slate-300 hover:border-fuchsia-400 hover:text-fuchsia-300"
                                }`}
                            >
                                {type}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="rounded-3xl border border-slate-800 bg-slate-950/70 p-4">
                    <p className="mb-3 text-sm font-bold text-white">
                        Helpful feedback prompts
                    </p>

                    <ul className="space-y-2 text-sm leading-6 text-slate-400">
                        <li>• What did you try to do?</li>
                        <li>• What worked well?</li>
                        <li>• What was confusing?</li>
                        <li>• Which subject template did you test?</li>
                        <li>• What feature would make you come back?</li>
                        <li>
                            • Would this help during real IA, EE, TOK, EPQ, or essay work?
                        </li>
                    </ul>

                    <a
                        href={feedbackMailto}
                        className="mt-5 inline-block rounded-2xl bg-fuchsia-400 px-6 py-4 text-center font-bold text-slate-950 transition hover:bg-fuchsia-300"
                    >
                        Write structured feedback
                    </a>

                    <p className="mt-3 text-xs leading-5 text-slate-500">
                        This opens your email app with a ready-made feedback template. You
                        can edit it before sending.
                    </p>
                </div>
            </div>
        </section>
    );
}