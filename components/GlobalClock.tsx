"use client";

import {
    useEffect,
    useMemo,
    useRef,
    useState,
    type PointerEvent as ReactPointerEvent,
} from "react";
import { useHasMounted, useStoredLanguage } from "@/lib/clientStores";
import { createTranslator, type Language } from "@/lib/i18n";

type ClockMode = "expanded" | "minimized" | "hidden";

type ClockPosition = {
    x: number;
    y: number;
};

type ClockCorner = "top-left" | "top-right" | "bottom-left" | "bottom-right";

type ClockZone = {
    id: string;
    label: string;
    shortLabel: string;
    timeZone?: string;
};

const CLOCK_MODE_KEY = "coursework-compass-clock-mode";
const CLOCK_POSITION_KEY = "coursework-compass-clock-position";
const VIEWPORT_GUTTER = 12;
const COMPACT_CLOCK_WIDTH = 288;
const EXPANDED_CLOCK_WIDTH = 336;
const COMPACT_CLOCK_HEIGHT = 220;
const EXPANDED_CLOCK_HEIGHT = 460;

function getLocale(language: Language) {
    return language === "zh" ? "zh-CN" : "en-GB";
}

function formatClockTime(timeZone: string | undefined, language: Language) {
    return new Intl.DateTimeFormat(getLocale(language), {
        timeZone,
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
    }).format(new Date());
}

function formatClockDate(timeZone: string | undefined, language: Language) {
    return new Intl.DateTimeFormat(getLocale(language), {
        timeZone,
        weekday: "short",
        month: "short",
        day: "2-digit",
        year: "numeric",
    }).format(new Date());
}

function getDefaultMode(): ClockMode {
    if (typeof window === "undefined") {
        return "minimized";
    }

    return window.innerWidth < 768 ? "minimized" : "expanded";
}

function getDefaultPosition(): ClockPosition {
    if (typeof window === "undefined") {
        return {
            x: 16,
            y: 16,
        };
    }

    return {
        x: window.innerWidth < 768 ? 12 : 16,
        y: window.innerWidth < 768 ? 12 : 16,
    };
}

function isClockMode(value: string | null): value is ClockMode {
    return value === "expanded" || value === "minimized" || value === "hidden";
}

function readSavedMode() {
    if (typeof window === "undefined") {
        return "minimized";
    }

    const savedMode = window.localStorage.getItem(CLOCK_MODE_KEY);
    return isClockMode(savedMode) ? savedMode : getDefaultMode();
}

function getClockSize(mode: ClockMode) {
    const isSmallScreen =
        typeof window !== "undefined" && window.innerWidth < 768;

    return {
        width: isSmallScreen ? COMPACT_CLOCK_WIDTH : EXPANDED_CLOCK_WIDTH,
        height:
            mode === "expanded" && !isSmallScreen
                ? EXPANDED_CLOCK_HEIGHT
                : COMPACT_CLOCK_HEIGHT,
    };
}

function clampPosition(position: ClockPosition, mode: ClockMode = "expanded") {
    if (typeof window === "undefined") {
        return position;
    }

    const clockSize = getClockSize(mode);
    const maxX = Math.max(
        VIEWPORT_GUTTER,
        window.innerWidth - clockSize.width - VIEWPORT_GUTTER,
    );
    const maxY = Math.max(
        VIEWPORT_GUTTER,
        window.innerHeight - clockSize.height - VIEWPORT_GUTTER,
    );

    return {
        x: Math.min(Math.max(position.x, VIEWPORT_GUTTER), maxX),
        y: Math.min(Math.max(position.y, VIEWPORT_GUTTER), maxY),
    };
}

function getCornerPosition(corner: ClockCorner, mode: ClockMode) {
    if (typeof window === "undefined") {
        return getDefaultPosition();
    }

    const clockSize = getClockSize(mode);
    const right = Math.max(
        VIEWPORT_GUTTER,
        window.innerWidth - clockSize.width - VIEWPORT_GUTTER,
    );
    const bottom = Math.max(
        VIEWPORT_GUTTER,
        window.innerHeight - clockSize.height - VIEWPORT_GUTTER,
    );

    return {
        x: corner.endsWith("right") ? right : VIEWPORT_GUTTER,
        y: corner.startsWith("bottom") ? bottom : VIEWPORT_GUTTER,
    };
}

function readSavedPosition(mode: ClockMode) {
    if (typeof window === "undefined") {
        return getDefaultPosition();
    }

    const savedPosition = window.localStorage.getItem(CLOCK_POSITION_KEY);

    if (!savedPosition) {
        return getDefaultPosition();
    }

    try {
        const parsedPosition = JSON.parse(savedPosition) as ClockPosition;

        if (
            typeof parsedPosition.x !== "number" ||
            typeof parsedPosition.y !== "number"
        ) {
            return getDefaultPosition();
        }

        return clampPosition(parsedPosition, mode);
    } catch {
        return getDefaultPosition();
    }
}

export default function GlobalClock() {
    const hasMounted = useHasMounted();
    const language = useStoredLanguage();
    const [mode, setMode] = useState<ClockMode>(() => readSavedMode());
    const [position, setPosition] = useState<ClockPosition>(() =>
        readSavedPosition(readSavedMode()),
    );
    const [tick, setTick] = useState(0);
    const [isDragging, setIsDragging] = useState(false);

    const dragStartRef = useRef<{
        pointerX: number;
        pointerY: number;
        startX: number;
        startY: number;
    } | null>(null);

    const t = createTranslator(language);
    const zones = useMemo<ClockZone[]>(
        () => [
            {
                id: "local",
                label: t("systemTime"),
                shortLabel: language === "zh" ? "本地" : "Local",
            },
            {
                id: "beijing",
                label: t("beijingTime"),
                shortLabel: "BJS",
                timeZone: "Asia/Shanghai",
            },
            {
                id: "utc",
                label: t("utcTime"),
                shortLabel: "UTC",
                timeZone: "UTC",
            },
            {
                id: "uae",
                label: t("uaeTime"),
                shortLabel: "UAE",
                timeZone: "Asia/Dubai",
            },
        ],
        [language, t],
    );
    const primaryZone = zones[0];
    const currentTick = tick;
    const positionLabel = language === "zh" ? "位置" : "Position";

    useEffect(() => {
        const timer = window.setInterval(() => {
            setTick((currentValue) => currentValue + 1);
        }, 1000);

        function handleResize() {
            setPosition((currentPosition) => {
                const nextPosition = clampPosition(currentPosition, mode);

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
    }, [mode]);

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

    function handleExpandOrMinimise() {
        setMode((currentMode) => {
            const nextMode =
                currentMode === "expanded" ? "minimized" : "expanded";

            setPosition((currentPosition) =>
                clampPosition(currentPosition, nextMode),
            );

            return nextMode;
        });
    }

    function handleClose() {
        setMode("hidden");
    }

    function handleShowAgain() {
        setPosition((currentPosition) => clampPosition(currentPosition, "minimized"));
        setMode("minimized");
    }

    function handleMoveToCorner(corner: ClockCorner) {
        setPosition(getCornerPosition(corner, mode));
    }

    function handlePointerDown(event: ReactPointerEvent<HTMLDivElement>) {
        dragStartRef.current = {
            pointerX: event.clientX,
            pointerY: event.clientY,
            startX: position.x,
            startY: position.y,
        };

        setIsDragging(true);
        event.currentTarget.setPointerCapture(event.pointerId);
    }

    function handlePointerMove(event: ReactPointerEvent<HTMLDivElement>) {
        if (!dragStartRef.current) {
            return;
        }

        const nextPosition = clampPosition(
            {
                x:
                    dragStartRef.current.startX +
                    event.clientX -
                    dragStartRef.current.pointerX,
                y:
                    dragStartRef.current.startY +
                    event.clientY -
                    dragStartRef.current.pointerY,
            },
            mode,
        );

        setPosition(nextPosition);
    }

    function handlePointerUp(event: ReactPointerEvent<HTMLDivElement>) {
        dragStartRef.current = null;
        setIsDragging(false);

        if (event.currentTarget.hasPointerCapture(event.pointerId)) {
            event.currentTarget.releasePointerCapture(event.pointerId);
        }
    }

    if (!hasMounted) {
        return null;
    }

    if (mode === "hidden") {
        return (
            <button
                type="button"
                onClick={handleShowAgain}
                className="cc-panel-strong cc-interactive-button fixed bottom-4 right-4 z-[60] inline-flex min-h-12 items-center gap-2 rounded-full px-4 py-3 text-xs font-black text-cyan-300 shadow-cyan-950/30"
                aria-label={t("showTime")}
                title={t("showTime")}
            >
                <span className="text-base" aria-hidden="true">
                    :
                </span>
                {t("showTime")}
            </button>
        );
    }

    return (
        <section
            style={{
                left: position.x,
                top: position.y,
            }}
            className="cc-panel-strong cc-motion-scale-in fixed z-[60] w-[min(18rem,calc(100vw-1.5rem))] overflow-hidden rounded-2xl p-2 shadow-cyan-950/30 sm:w-[21rem]"
            aria-label={t("worldClock")}
        >
            <div
                onPointerDown={handlePointerDown}
                onPointerMove={handlePointerMove}
                onPointerUp={handlePointerUp}
                onPointerCancel={handlePointerUp}
                className={`cc-surface-muted flex cursor-grab touch-none items-center gap-3 rounded-xl px-3 py-2.5 active:cursor-grabbing ${
                    isDragging ? "border-cyan-400/60 bg-cyan-400/10" : ""
                }`}
                title={t("dragThisAreaToMove")}
            >
                <div className="grid h-9 w-9 shrink-0 place-items-center rounded-xl border border-cyan-400/30 bg-cyan-400/10 text-lg font-black leading-none text-cyan-300">
                    :
                </div>

                <div className="min-w-0 flex-1">
                    <p className="truncate text-xs font-black uppercase text-cyan-300">
                        {t("worldClock")}
                    </p>
                    <p className="cc-text-subtle mt-0.5 truncate text-[0.72rem] font-semibold">
                        {t("dragThisAreaToMove")}
                    </p>
                </div>

                <div className="flex shrink-0 items-center gap-1">
                    <button
                        type="button"
                        onClick={handleExpandOrMinimise}
                        className="cc-button-secondary h-9 min-h-0 w-9 rounded-xl p-0 text-sm"
                        aria-label={mode === "expanded" ? t("minimise") : t("open")}
                        title={mode === "expanded" ? t("minimise") : t("open")}
                    >
                        {mode === "expanded" ? "-" : "+"}
                    </button>

                    <button
                        type="button"
                        onClick={handleClose}
                        className="cc-button-danger h-9 min-h-0 w-9 rounded-xl p-0 text-sm"
                        aria-label={t("close")}
                        title={t("close")}
                    >
                        x
                    </button>
                </div>
            </div>

            <div className="px-2 pb-2 pt-3">
                <div className="flex items-end justify-between gap-3">
                    <div className="min-w-0">
                        <p className="cc-text-subtle truncate text-xs font-bold">
                            {primaryZone.label}
                        </p>
                        <p className="cc-text-main mt-1 font-mono text-3xl font-black leading-none tracking-normal sm:text-4xl">
                            {formatClockTime(primaryZone.timeZone, language)}
                        </p>
                        <p className="cc-text-subtle mt-1 truncate text-xs font-semibold">
                            {formatClockDate(primaryZone.timeZone, language)}
                        </p>
                    </div>

                    <span className="cc-badge-accent shrink-0 px-2.5 py-1 text-[0.68rem] uppercase">
                        {primaryZone.shortLabel}
                    </span>
                </div>

                {mode === "expanded" ? (
                    <>
                        <div className="mt-4 grid gap-2">
                            {zones.slice(1).map((zone) => (
                                <div
                                    key={zone.id}
                                    className="cc-surface-muted flex items-center justify-between gap-3 rounded-xl px-3 py-2.5"
                                >
                                    <div className="min-w-0">
                                        <p className="cc-text-main truncate text-sm font-black">
                                            {zone.label}
                                        </p>
                                        <p className="cc-text-subtle mt-0.5 truncate text-xs">
                                            {formatClockDate(zone.timeZone, language)}
                                        </p>
                                    </div>

                                    <div className="shrink-0 text-right">
                                        <p className="cc-text-main font-mono text-base font-black">
                                            {formatClockTime(zone.timeZone, language)}
                                        </p>
                                        <p className="cc-text-accent text-[0.65rem] font-black uppercase">
                                            {zone.shortLabel}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="mt-3 flex items-center justify-between gap-2">
                            <span className="cc-text-subtle text-[0.7rem] font-bold">
                                {positionLabel}
                            </span>
                            <div className="grid grid-cols-4 gap-1.5">
                                {(
                                    [
                                        ["top-left", "TL"],
                                        ["top-right", "TR"],
                                        ["bottom-left", "BL"],
                                        ["bottom-right", "BR"],
                                    ] as [ClockCorner, string][]
                                ).map(([corner, label]) => (
                                    <button
                                        key={corner}
                                        type="button"
                                        onClick={() => handleMoveToCorner(corner)}
                                        className="cc-button-secondary h-8 min-h-0 rounded-lg px-2 text-[0.65rem] font-black"
                                        aria-label={`Move clock to ${corner.replace("-", " ")}`}
                                        title={`Move clock to ${corner.replace("-", " ")}`}
                                    >
                                        {label}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </>
                ) : (
                    <div className="mt-3 grid grid-cols-3 gap-1.5">
                        {zones.slice(1).map((zone) => (
                            <div
                                key={zone.id}
                                className="cc-surface-muted rounded-xl px-2 py-2 text-center"
                            >
                                <p className="cc-text-accent text-[0.62rem] font-black uppercase">
                                    {zone.shortLabel}
                                </p>
                                <p className="cc-text-main mt-1 font-mono text-xs font-black">
                                    {formatClockTime(zone.timeZone, language).slice(0, 5)}
                                </p>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <span className="sr-only">Clock refresh {currentTick}</span>
        </section>
    );
}
