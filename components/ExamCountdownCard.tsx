"use client";

import { useEffect, useState } from "react";
import { getIbExamCountdown } from "@/lib/examCountdown";

type Countdown = ReturnType<typeof getIbExamCountdown>;

export default function ExamCountdownCard() {
    const [countdown, setCountdown] = useState<Countdown | null>(null);

    useEffect(() => {
        setCountdown(getIbExamCountdown());
    }, []);

    if (!countdown) {
        return (
            <div className="rounded-3xl border border-slate-800 bg-slate-900 p-5 sm:p-6">
                <p className="text-sm text-slate-400">Loading exam countdown...</p>
            </div>
        );
    }

    const isStarted = countdown.status === "started";
    const isToday = countdown.status === "today";

    return (
        <div className="rounded-3xl border border-cyan-400/30 bg-cyan-400/10 p-5 sm:p-6">
            <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
                <div>
                    <p className="mb-2 text-sm font-bold text-cyan-300">
                        Exam countdown
                    </p>
                    <h2 className="text-2xl font-black sm:text-3xl">
                        {countdown.label}
                    </h2>
                    <p className="mt-2 text-sm leading-6 text-slate-300">
                        Target date: {countdown.targetDateLabel}. Keep coursework pressure
                        under control before revision season becomes a meteor shower.
                    </p>
                </div>

                <div className="rounded-3xl border border-slate-800 bg-slate-950 p-5 text-center md:min-w-48">
                    <p
                        className={`text-5xl font-black ${
                            isToday || isStarted ? "text-amber-300" : "text-cyan-300"
                        }`}
                    >
                        {countdown.daysLeft}
                    </p>
                    <p className="mt-2 text-sm font-bold text-slate-300">
                        {countdown.message}
                    </p>
                </div>
            </div>
        </div>
    );
}