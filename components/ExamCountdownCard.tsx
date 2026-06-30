"use client";

import { useState } from "react";
import { getIbExamCountdown } from "@/lib/examCountdown";

type Countdown = ReturnType<typeof getIbExamCountdown>;

export default function ExamCountdownCard() {
    const [countdown] = useState<Countdown>(() => getIbExamCountdown());

    if (!countdown) {
        return (
            <div className="cc-card rounded-[1.5rem] p-5 sm:p-6">
                <p className="cc-text-subtle text-sm">Loading exam countdown...</p>
            </div>
        );
    }

    const isStarted = countdown.status === "started";
    const isToday = countdown.status === "today";

    return (
        <div className="cc-card rounded-[1.5rem] border-cyan-400/30 p-5 sm:p-6">
            <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
                <div>
                    <p className="mb-2 text-sm font-bold text-cyan-300">
                        Exam countdown
                    </p>
                    <h2 className="text-2xl font-black sm:text-3xl">
                        {countdown.label}
                    </h2>
                    <p className="cc-text-muted mt-2 text-sm leading-6">
                        Target date: {countdown.targetDateLabel}. Keep coursework pressure
                        under control before revision season becomes a meteor shower.
                    </p>
                </div>

                <div className="cc-surface-inset rounded-[1.5rem] p-5 text-center md:min-w-48">
                    <p
                        className={`text-5xl font-black ${
                            isToday || isStarted ? "text-amber-300" : "text-cyan-300"
                        }`}
                    >
                        {countdown.daysLeft}
                    </p>
                    <p className="cc-text-muted mt-2 text-sm font-bold">
                        {countdown.message}
                    </p>
                </div>
            </div>
        </div>
    );
}
