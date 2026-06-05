"use client";

import { useEffect, useRef, useState } from "react";

type ClockMode = "expanded" | "minimized" | "hidden";

type ClockRow = {
    label: string;
    value: string;
};

type ClockPosition = {
    x: number;
    y: number;
};

type DragStart = {
    pointerId: number;
    startX: number;
    startY: number;
    initialX: number;
    initialY: number;
};

const CLOCK_MODE_STORAGE_KEY = "coursework-compass-clock-mode";
const CLOCK_POSITION_STORAGE_KEY = "coursework-compass-clock-position";

const viewportPadding = 16;

function formatTime(date: Date, timeZone?: string) {
    return new Intl.DateTimeFormat("en-GB", {
        timeZone,
        year: "numeric",
        month: "short",
        day: "2-digit",
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

function isClockMode(value: string | null): value is ClockMode {
    return value === "expanded" || value === "minimized" || value === "hidden";
}

function getFallbackPanelSize(clockMode: ClockMode) {
    if (clockMode === "hidden") {
        return {
            width: 170,
            height: 52,
        };
    }

    if (clockMode === "minimized") {
        return {
            width: 320,
            height: 112,
        };
    }

    return {
        width: 320,
        height: 310,
    };
}

function getSavedClockPosition() {
    if (typeof window === "undefined") {
        return null;
    }

    const rawPosition = window.localStorage.getItem(CLOCK_POSITION_STORAGE_KEY);

    if (!rawPosition) {
        return null;
    }

    try {
        const parsedPosition = JSON.parse(rawPosition);

        if (
            typeof parsedPosition?.x === "number" &&
            Number.isFinite(parsedPosition.x) &&
            typeof parsedPosition?.y === "number" &&
            Number.isFinite(parsedPosition.y)
        ) {
            return {
                x: parsedPosition.x,
                y: parsedPosition.y,
            };
        }

        return null;
    } catch {
        return null;
    }
}

function saveClockPosition(position: ClockPosition) {
    window.localStorage.setItem(
        CLOCK_POSITION_STORAGE_KEY,
        JSON.stringify(position),
    );
}

function getDefaultPosition(clockMode: ClockMode): ClockPosition {
    const fallbackSize = getFallbackPanelSize(clockMode);

    return {
        x: Math.max(
            viewportPadding,
            window.innerWidth - fallbackSize.width - viewportPadding,
        ),
        y: Math.max(
            viewportPadding,
            window.innerHeight - fallbackSize.height - viewportPadding,
        ),
    };
}

function clampPosition(
    position: ClockPosition,
    panelElement: HTMLDivElement | null,
    clockMode: ClockMode,
): ClockPosition {
    const fallbackSize = getFallbackPanelSize(clockMode);
    const panelRect = panelElement?.getBoundingClientRect();

    const panelWidth = panelRect?.width || fallbackSize.width;
    const panelHeight = panelRect?.height || fallbackSize.height;

    const maxX = Math.max(viewportPadding, window.innerWidth - panelWidth - viewportPadding);
    const maxY = Math.max(viewportPadding, window.innerHeight - panelHeight - viewportPadding);

    return {
        x: Math.min(Math.max(position.x, viewportPadding), maxX),
        y: Math.min(Math.max(position.y, viewportPadding), maxY),
    };
}

export default function GlobalClock() {
    const [now, setNow] = useState<Date | null>(null);
    const [clockMode, setClockMode] = useState<ClockMode>("expanded");
    const [position, setPosition] = useState<ClockPosition | null>(null);
    const [isDragging, setIsDragging] = useState(false);

    const panelRef = useRef<HTMLDivElement | null>(null);
    const dragStartRef = useRef<DragStart | null>(null);

    useEffect(() => {
        const savedClockMode = window.localStorage.getItem(CLOCK_MODE_STORAGE_KEY);

        const initialClockMode = isClockMode(savedClockMode)
            ? savedClockMode
            : "expanded";

        setClockMode(initialClockMode);

        const savedPosition = getSavedClockPosition();
        const initialPosition = savedPosition || getDefaultPosition(initialClockMode);

        setPosition(initialPosition);
        setNow(new Date());

        const timer = window.setInterval(() => {
            setNow(new Date());
        }, 1000);

        return () => {
            window.clearInterval(timer);
        };
    }, []);

    useEffect(() => {
        if (!position) {
            return;
        }

        function handleResize() {
            setPosition((currentPosition) => {
                if (!currentPosition) {
                    return currentPosition;
                }

                const clampedPosition = clampPosition(
                    currentPosition,
                    panelRef.current,
                    clockMode,
                );

                saveClockPosition(clampedPosition);

                return clampedPosition;
            });
        }

        window.addEventListener("resize", handleResize);

        return () => {
            window.removeEventListener("resize", handleResize);
        };
    }, [clockMode, position]);

    useEffect(() => {
        if (!position) {
            return;
        }

        window.requestAnimationFrame(() => {
            setPosition((currentPosition) => {
                if (!currentPosition) {
                    return currentPosition;
                }

                const clampedPosition = clampPosition(
                    currentPosition,
                    panelRef.current,
                    clockMode,
                );

                saveClockPosition(clampedPosition);

                return clampedPosition;
            });
        });
    }, [clockMode]);

    function updateClockMode(nextMode: ClockMode) {
        setClockMode(nextMode);
        window.localStorage.setItem(CLOCK_MODE_STORAGE_KEY, nextMode);
    }

    function handleDragStart(event: React.PointerEvent<HTMLDivElement>) {
        if (!position) {
            return;
        }

        event.preventDefault();

        event.currentTarget.setPointerCapture(event.pointerId);

        dragStartRef.current = {
            pointerId: event.pointerId,
            startX: event.clientX,
            startY: event.clientY,
            initialX: position.x,
            initialY: position.y,
        };

        setIsDragging(true);
    }

    function handleDragMove(event: React.PointerEvent<HTMLDivElement>) {
        const dragStart = dragStartRef.current;

        if (!dragStart || !position) {
            return;
        }

        const nextPosition = {
            x: dragStart.initialX + event.clientX - dragStart.startX,
            y: dragStart.initialY + event.clientY - dragStart.startY,
        };

        const clampedPosition = clampPosition(
            nextPosition,
            panelRef.current,
            clockMode,
        );

        setPosition(clampedPosition);
    }

    function handleDragEnd(event: React.PointerEvent<HTMLDivElement>) {
        const dragStart = dragStartRef.current;

        if (dragStart?.pointerId === event.pointerId) {
            event.currentTarget.releasePointerCapture(event.pointerId);
        }

        dragStartRef.current = null;
        setIsDragging(false);

        setPosition((currentPosition) => {
            if (!currentPosition) {
                return currentPosition;
            }

            const clampedPosition = clampPosition(
                currentPosition,
                panelRef.current,
                clockMode,
            );

            saveClockPosition(clampedPosition);

            return clampedPosition;
        });
    }

    const clockRows = now ? getClockRows(now) : [];
    const systemTime =
        clockRows.find((row) => row.label === "System")?.value ?? "Syncing...";

    if (!position) {
        return null;
    }

    if (clockMode === "hidden") {
        return (
            <div
                ref={panelRef}
                className="fixed z-40 flex items-center gap-2"
                style={{
                    left: position.x,
                    top: position.y,
                }}
            >
                <div
                    onPointerDown={handleDragStart}
                    onPointerMove={handleDragMove}
                    onPointerUp={handleDragEnd}
                    onPointerCancel={handleDragEnd}
                    className={`cursor-grab touch-none rounded-full border border-slate-700 bg-slate-950/90 px-3 py-3 text-xs font-black text-slate-400 shadow-2xl shadow-cyan-950/30 backdrop-blur-md transition hover:border-cyan-400 hover:text-cyan-300 ${
                        isDragging ? "cursor-grabbing border-cyan-400 text-cyan-300" : ""
                    }`}
                    aria-label="Drag hidden clock button"
                >
                    ⠿
                </div>

                <button
                    type="button"
                    onClick={() => updateClockMode("minimized")}
                    className="rounded-full border border-cyan-400/30 bg-slate-950/90 px-4 py-3 text-xs font-black text-cyan-300 shadow-2xl shadow-cyan-950/40 backdrop-blur-md transition hover:bg-cyan-400/10 hover:text-cyan-200"
                    aria-label="Show world clock"
                >
                    Show clock
                </button>
            </div>
        );
    }

    if (clockMode === "minimized") {
        return (
            <aside
                ref={panelRef}
                className="fixed z-40 w-[calc(100%-2rem)] max-w-sm rounded-3xl border border-cyan-400/20 bg-slate-950/90 p-3 text-white shadow-2xl shadow-cyan-950/40 backdrop-blur-md sm:w-auto sm:min-w-80"
                style={{
                    left: position.x,
                    top: position.y,
                }}
            >
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div
                        onPointerDown={handleDragStart}
                        onPointerMove={handleDragMove}
                        onPointerUp={handleDragEnd}
                        onPointerCancel={handleDragEnd}
                        className={`touch-none rounded-2xl px-2 py-1 transition ${
                            isDragging
                                ? "cursor-grabbing bg-cyan-400/10"
                                : "cursor-grab hover:bg-slate-900"
                        }`}
                    >
                        <p className="text-xs font-bold uppercase tracking-[0.2em] text-cyan-300">
                            System time · drag
                        </p>
                        <p className="mt-1 text-sm font-black text-white">{systemTime}</p>
                    </div>

                    <div className="flex flex-wrap gap-2">
                        <button
                            type="button"
                            onClick={() => updateClockMode("expanded")}
                            className="rounded-full border border-slate-700 px-3 py-2 text-xs font-bold text-slate-300 transition hover:border-cyan-400 hover:text-cyan-300"
                        >
                            Expand
                        </button>

                        <button
                            type="button"
                            onClick={() => updateClockMode("hidden")}
                            className="rounded-full border border-slate-700 px-3 py-2 text-xs font-bold text-slate-300 transition hover:border-red-400 hover:text-red-300"
                        >
                            Hide
                        </button>
                    </div>
                </div>
            </aside>
        );
    }

    return (
        <aside
            ref={panelRef}
            className="fixed z-40 w-[calc(100%-2rem)] max-w-sm rounded-3xl border border-cyan-400/20 bg-slate-950/90 p-4 text-white shadow-2xl shadow-cyan-950/40 backdrop-blur-md sm:w-80"
            style={{
                left: position.x,
                top: position.y,
            }}
        >
            <div className="mb-3 flex items-start justify-between gap-3">
                <div
                    onPointerDown={handleDragStart}
                    onPointerMove={handleDragMove}
                    onPointerUp={handleDragEnd}
                    onPointerCancel={handleDragEnd}
                    className={`touch-none rounded-2xl px-2 py-1 transition ${
                        isDragging
                            ? "cursor-grabbing bg-cyan-400/10"
                            : "cursor-grab hover:bg-slate-900"
                    }`}
                >
                    <p className="text-xs font-bold uppercase tracking-[0.2em] text-cyan-300">
                        World clock · drag
                    </p>
                    <h2 className="mt-1 text-sm font-black text-white">
                        Coursework time zones
                    </h2>
                </div>

                <span className="rounded-full bg-cyan-400/10 px-3 py-1 text-xs font-bold text-cyan-300">
          Live
        </span>
            </div>

            <div className="mb-3 flex flex-wrap gap-2">
                <button
                    type="button"
                    onClick={() => updateClockMode("minimized")}
                    className="rounded-full border border-slate-700 px-3 py-2 text-xs font-bold text-slate-300 transition hover:border-cyan-400 hover:text-cyan-300"
                >
                    Minimize
                </button>

                <button
                    type="button"
                    onClick={() => updateClockMode("hidden")}
                    className="rounded-full border border-slate-700 px-3 py-2 text-xs font-bold text-slate-300 transition hover:border-red-400 hover:text-red-300"
                >
                    Hide
                </button>
            </div>

            {now ? (
                <div className="space-y-2">
                    {clockRows.map((row) => (
                        <div
                            key={row.label}
                            className="flex items-center justify-between gap-3 rounded-2xl border border-slate-800 bg-slate-900/80 px-3 py-2"
                        >
                            <p className="text-xs font-bold text-slate-400">{row.label}</p>
                            <p className="text-right text-xs font-bold text-slate-100">
                                {row.value}
                            </p>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="rounded-2xl border border-slate-800 bg-slate-900/80 px-3 py-2 text-xs font-bold text-slate-400">
                    Syncing clocks...
                </div>
            )}
        </aside>
    );
}