"use client";

import { useEffect, useRef, useState } from "react";

type ClockMode = "expanded" | "minimized" | "hidden";

type ClockPosition = {
    x: number;
    y: number;
};

const CLOCK_MODE_KEY = "coursework-compass-clock-mode";
const CLOCK_POSITION_KEY = "coursework-compass-clock-position";

function formatTime(timeZone?: string) {
    const now = new Date();

    return new Intl.DateTimeFormat("en-GB", {
        timeZone,
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour12: false,
    }).format(now);
}

function getDefaultMode() {
    if (typeof window === "undefined") {
        return "minimized";
    }

    return window.innerWidth < 768 ? "minimized" : "expanded";
}

function clampPosition(position: ClockPosition) {
    if (typeof window === "undefined") {
        return position;
    }

    const maxX = Math.max(12, window.innerWidth - 280);
    const maxY = Math.max(12, window.innerHeight - 220);

    return {
        x: Math.min(Math.max(position.x, 12), maxX),
        y: Math.min(Math.max(position.y, 12), maxY),
    };
}

export default function GlobalClock() {
    const [hasMounted, setHasMounted] = useState(false);
    const [mode, setMode] = useState<ClockMode>("minimized");
    const [position, setPosition] = useState<ClockPosition>({
        x: 16,
        y: 16,
    });
    const [tick, setTick] = useState(0);
    const dragStartRef = useRef<{
        pointerX: number;
        pointerY: number;
        startX: number;
        startY: number;
    } | null>(null);

    useEffect(() => {
        const savedMode = window.localStorage.getItem(CLOCK_MODE_KEY);
        const savedPosition = window.localStorage.getItem(CLOCK_POSITION_KEY);

        if (
            savedMode === "expanded" ||
            savedMode === "minimized" ||
            savedMode === "hidden"
        ) {
            setMode(savedMode);
        } else {
            setMode(getDefaultMode());
        }

        if (savedPosition) {
            try {
                const parsedPosition = JSON.parse(savedPosition) as ClockPosition;
                setPosition(clampPosition(parsedPosition));
            } catch {
                setPosition({
                    x: 16,
                    y: 16,
                });
            }
        } else {
            setPosition({
                x: 16,
                y: 16,
            });
        }

        setHasMounted(true);

        const timer = window.setInterval(() => {
            setTick((current) => current + 1);
        }, 1000);

        function handleResize() {
            setPosition((currentPosition) => {
                const nextPosition = clampPosition(currentPosition);
                window.localStorage.setItem(
                    CLOCK_POSITION_KEY,
                    JSON.stringify(nextPosition),
                );
                return nextPosition;
            });
        }

        window.addEventListener("resize", handleResize);

        return () => {
            window.clearInterval(timer);
            window.removeEventListener("resize", handleResize);
        };
    }, []);

    useEffect(() => {
        if (!hasMounted) {
            return;
        }

        window.localStorage.setItem(CLOCK_MODE_KEY, mode);
    }, [hasMounted, mode]);

    useEffect(() => {
        if (!hasMounted) {
            return;
        }

        window.localStorage.setItem(CLOCK_POSITION_KEY, JSON.stringify(position));
    }, [hasMounted, position]);

    if (!hasMounted || mode === "hidden") {
        return (
            <button
                type="button"
                onClick={() => setMode("minimized")}
                className="fixed bottom-4 right-4 z-[60] rounded-2xl border border-cyan-400/30 bg-slate-950/95 px-4 py-3 text-xs font-black text-cyan-300 shadow-2xl shadow-cyan-950/40 backdrop-blur-md"
            >
                Show time
            </button>
        );
    }

    const style = {
        left: position.x,
        top: position.y,
    };

    function handlePointerDown(event: React.PointerEvent<HTMLDivElement>) {
        dragStartRef.current = {
            pointerX: event.clientX,
            pointerY: event.clientY,
            startX: position.x,
            startY: position.y,
        };

        event.currentTarget.setPointerCapture(event.pointerId);
    }

    function handlePointerMove(event: React.PointerEvent<HTMLDivElement>) {
        if (!dragStartRef.current) {
            return;
        }

        const nextPosition = clampPosition({
            x:
                dragStartRef.current.startX +
                event.clientX -
                dragStartRef.current.pointerX,
            y:
                dragStartRef.current.startY +
                event.clientY -
                dragStartRef.current.pointerY,
        });

        setPosition(nextPosition);
    }

    function handlePointerUp() {
        dragStartRef.current = null;
    }

    return (
        <section
            style={style}
            className="fixed z-[60] w-[min(17rem,calc(100vw-1.5rem))] rounded-[1.5rem] border border-cyan-400/30 bg-slate-950/95 p-3 text-white shadow-2xl shadow-cyan-950/40 backdrop-blur-md sm:w-72 sm:p-4"
        >
            <div
                onPointerDown={handlePointerDown}
                onPointerMove={handlePointerMove}
                onPointerUp={handlePointerUp}
                className="cursor-grab rounded-2xl border border-slate-800 bg-slate-900/80 px-3 py-2 active:cursor-grabbing"
            >
                <div className="flex items-center justify-between gap-3">
                    <div className="min-w-0">
                        <p className="truncate text-xs font-black uppercase tracking-[0.16em] text-cyan-300">
                            World clock
                        </p>
                        <p className="mt-1 text-xs text-slate-500">
                            Drag to move
                        </p>
                    </div>

                    <div className="flex gap-2">
                        <button
                            type="button"
                            onClick={() =>
                                setMode((currentMode) =>
                                    currentMode === "expanded" ? "minimized" : "expanded",
                                )
                            }
                            className="rounded-xl border border-slate-700 px-3 py-2 text-xs font-bold text-slate-300 transition hover:border-cyan-400 hover:text-cyan-300"
                        >
                            {mode === "expanded" ? "Min" : "Open"}
                        </button>

                        <button
                            type="button"
                            onClick={() => setMode("hidden")}
                            className="rounded-xl border border-slate-700 px-3 py-2 text-xs font-bold text-slate-300 transition hover:border-slate-400 hover:text-white"
                        >
                            Hide
                        </button>
                    </div>
                </div>
            </div>

            {mode === "minimized" ? (
                <div className="mt-3 rounded-2xl border border-slate-800 bg-slate-900/80 p-3">
                    <p className="text-xs font-bold text-slate-400">System time</p>
                    <p className="mt-1 text-sm font-black text-white">
                        {formatTime()}
                    </p>
                </div>
            ) : (
                <div className="mt-3 grid gap-2">
                    <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-3">
                        <p className="text-xs font-bold text-slate-400">System time</p>
                        <p className="mt-1 text-sm font-black text-white">
                            {formatTime()}
                        </p>
                    </div>

                    <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-3">
                        <p className="text-xs font-bold text-slate-400">Beijing time</p>
                        <p className="mt-1 text-sm font-black text-white">
                            {formatTime("Asia/Shanghai")}
                        </p>
                    </div>

                    <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-3">
                        <p className="text-xs font-bold text-slate-400">UTC time</p>
                        <p className="mt-1 text-sm font-black text-white">
                            {formatTime("UTC")}
                        </p>
                    </div>

                    <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-3">
                        <p className="text-xs font-bold text-slate-400">UAE time</p>
                        <p className="mt-1 text-sm font-black text-white">
                            {formatTime("Asia/Dubai")}
                        </p>
                    </div>
                </div>
            )}

            <span className="sr-only">{tick}</span>
        </section>
    );
}