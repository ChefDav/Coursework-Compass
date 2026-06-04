"use client";

import { useEffect, useState } from "react";

type ClockRow = {
    label: string;
    value: string;
};

function formatTime(date: Date, timeZone?: string) {
    return new Intl.DateTimeFormat("en-GB", {
        timeZone,
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
    }).format(date);
}

function getClockRows(date: Date): ClockRow[] {
    return [
        {
            label: "Beijing",
            value: formatTime(date, "Asia/Shanghai"),
        },
        {
            label: "UTC",
            value: formatTime(date, "UTC"),
        },
        {
            label: "System",
            value: formatTime(date),
        },
        {
            label: "UAE",
            value: formatTime(date, "Asia/Dubai"),
        },
    ];
}

function ClockContent({ clockRows }: { clockRows: ClockRow[] }) {
    return (
        <>
            <div className="mb-2 flex items-center justify-between gap-3">
                <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-cyan-300/80">
                    Time
                </p>

                <span className="h-2 w-2 rounded-full bg-cyan-300/80 shadow-sm shadow-cyan-300/50" />
            </div>

            <div className="space-y-1.5">
                {clockRows.map((row) => (
                    <div
                        key={row.label}
                        className="flex items-center justify-between gap-3 text-[11px]"
                    >
                        <span className="font-semibold text-slate-400">{row.label}</span>
                        <span className="font-mono font-bold tracking-wide text-slate-100">
              {row.value}
            </span>
                    </div>
                ))}
            </div>
        </>
    );
}

export default function GlobalClock() {
    const [now, setNow] = useState<Date | null>(null);
    const [isMobileOpen, setIsMobileOpen] = useState(false);

    useEffect(() => {
        setNow(new Date());

        const timer = window.setInterval(() => {
            setNow(new Date());
        }, 1000);

        return () => {
            window.clearInterval(timer);
        };
    }, []);

    const clockRows = now ? getClockRows(now) : [];

    return (
        <>
            <aside className="fixed right-5 top-5 z-30 hidden w-56 rounded-2xl border border-white/5 bg-slate-950/45 px-4 py-3 text-white/80 shadow-lg shadow-slate-950/20 backdrop-blur-md transition hover:border-cyan-400/20 hover:bg-slate-950/75 hover:text-white sm:block">
                {now ? (
                    <ClockContent clockRows={clockRows} />
                ) : (
                    <p className="text-[11px] font-semibold text-slate-400">
                        Syncing clocks...
                    </p>
                )}
            </aside>

            <div className="fixed right-0 top-28 z-30 sm:hidden">
                <button
                    type="button"
                    onClick={() => setIsMobileOpen((currentValue) => !currentValue)}
                    className="rounded-l-2xl border border-r-0 border-cyan-400/20 bg-slate-950/70 px-2 py-4 text-[10px] font-black uppercase tracking-[0.18em] text-cyan-300 shadow-lg shadow-slate-950/30 backdrop-blur-md"
                    aria-label={isMobileOpen ? "Hide world clock" : "Show world clock"}
                >
                    Time
                </button>
            </div>

            <aside
                className={`fixed right-0 top-24 z-30 w-64 rounded-l-3xl border border-r-0 border-cyan-400/20 bg-slate-950/90 p-4 text-white shadow-2xl shadow-slate-950/40 backdrop-blur-md transition-transform duration-300 sm:hidden ${
                    isMobileOpen ? "translate-x-0" : "translate-x-full"
                }`}
            >
                <div className="mb-3 flex items-center justify-between gap-3">
                    <div>
                        <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-cyan-300/80">
                            World Clock
                        </p>
                        <h2 className="mt-1 text-sm font-black text-white">
                            Time zones
                        </h2>
                    </div>

                    <button
                        type="button"
                        onClick={() => setIsMobileOpen(false)}
                        className="rounded-full border border-slate-700 px-3 py-1 text-xs font-bold text-slate-300"
                    >
                        Close
                    </button>
                </div>

                {now ? (
                    <ClockContent clockRows={clockRows} />
                ) : (
                    <p className="text-[11px] font-semibold text-slate-400">
                        Syncing clocks...
                    </p>
                )}
            </aside>
        </>
    );
}