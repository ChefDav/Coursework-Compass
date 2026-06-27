"use client";

import {
    useEffect,
    useRef,
    useState,
    type PointerEvent as ReactPointerEvent,
} from "react";
import {
    createTranslator,
    getStoredLanguage,
    listenForLanguageChange,
    type Language,
} from "@/lib/i18n";

type ClockMode = "expanded" | "minimized" | "hidden";

type ClockPosition = {
    x: number;
    y: number;
};

const CLOCK_MODE_KEY = "coursework-compass-clock-mode";
const CLOCK_POSITION_KEY = "coursework-compass-clock-position";

function formatTime(timeZone?: string, language: Language = "en") {
    const now = new Date();
    const locale = language === "zh" ? "zh-CN" : "en-GB";

    return new Intl.DateTimeFormat(locale, {
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

    if (window.innerWidth < 768) {
        return {
            x: 12,
            y: 12,
        };
    }

    return {
        x: 16,
        y: 16,
    };
}

function isClockMode(value: string | null): value is ClockMode {
    return value === "expanded" || value === "minimized" || value === "hidden";
}

function clampPosition(position: ClockPosition) {
    if (typeof window === "undefined") {
        return position;
    }

    const clockWidth = window.innerWidth < 768 ? 288 : 320;
    const clockHeight = window.innerWidth < 768 ? 180 : 320;

    const maxX = Math.max(12, window.innerWidth - clockWidth);
    const maxY = Math.max(12, window.innerHeight - clockHeight);

    return {
        x: Math.min(Math.max(position.x, 12), maxX),
        y: Math.min(Math.max(position.y, 12), maxY),
    };
}

function readSavedPosition() {
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

        return clampPosition(parsedPosition);
    } catch {
        return getDefaultPosition();
    }
}

export default function GlobalClock() {
    const [hasMounted, setHasMounted] = useState(false);
    const [language, setLanguage] = useState<Language>("en");
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

    const t = createTranslator(language);

    useEffect(() => {
        const savedMode = window.localStorage.getItem(CLOCK_MODE_KEY);

        setLanguage(getStoredLanguage());
        setMode(isClockMode(savedMode) ? savedMode : getDefaultMode());
        setPosition(readSavedPosition());
        setHasMounted(true);

        const unsubscribeLanguage = listenForLanguageChange((nextLanguage) => {
            setLanguage(nextLanguage);
        });

        const timer = window.setInterval(() => {
            setTick((currentTick) => currentTick + 1);
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
            unsubscribeLanguage();
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

    function handleExpandOrMinimise() {
        setMode((currentMode) =>
            currentMode === "expanded" ? "minimized" : "expanded",
        );
    }

    function handleClose() {
        setMode("hidden");
    }

    function handleShowAgain() {
        setPosition((currentPosition) => clampPosition(currentPosition));
        setMode("minimized");
    }

    function handlePointerDown(event: ReactPointerEvent<HTMLDivElement>) {
        dragStartRef.current = {
            pointerX: event.clientX,
            pointerY: event.clientY,
            startX: position.x,
            startY: position.y,
        };

        event.currentTarget.setPointerCapture(event.pointerId);
    }

    function handlePointerMove(event: ReactPointerEvent<HTMLDivElement>) {
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

    function handlePointerUp(event: ReactPointerEvent<HTMLDivElement>) {
        dragStartRef.current = null;

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
                className="fixed bottom-4 right-4 z-[60] rounded-2xl border border-cyan-400/30 bg-slate-950/95 px-4 py-3 text-xs font-black text-cyan-300 shadow-2xl shadow-cyan-950/40 backdrop-blur-md transition hover:border-cyan-300 hover:text-cyan-200"
            >
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
            className="fixed z-[60] w-[min(18rem,calc(100vw-1.5rem))] rounded-[1.5rem] border border-cyan-400/30 bg-slate-950/95 p-3 text-white shadow-2xl shadow-cyan-950/40 backdrop-blur-md sm:w-80 sm:p-4"
        >
            <div className="flex items-start justify-between gap-3">
                <div
                    onPointerDown={handlePointerDown}
                    onPointerMove={handlePointerMove}
                    onPointerUp={handlePointerUp}
                    onPointerCancel={handlePointerUp}
                    className="min-w-0 flex-1 cursor-grab touch-none rounded-2xl border border-slate-800 bg-slate-900/80 px-3 py-2 active:cursor-grabbing"
                >
                    <p className="truncate text-xs font-black uppercase tracking-[0.16em] text-cyan-300">
                        {t("worldClock")}
                    </p>
                    <p className="mt-1 truncate text-xs text-slate-500">
                        {t("dragThisAreaToMove")}
                    </p>
                </div>

                <div className="flex shrink-0 gap-2">
                    <button
                        type="button"
                        onClick={handleExpandOrMinimise}
                        className="min-w-14 rounded-xl border border-slate-700 px-3 py-2 text-xs font-bold text-slate-300 transition hover:border-cyan-400 hover:text-cyan-300"
                    >
                        {mode === "expanded" ? t("minimise") : t("open")}
                    </button>

                    <button
                        type="button"
                        onClick={handleClose}
                        className="min-w-14 rounded-xl border border-red-400/30 bg-red-400/10 px-3 py-2 text-xs font-bold text-red-300 transition hover:bg-red-400/20"
                    >
                        {t("close")}
                    </button>
                </div>
            </div>

            {mode === "minimized" ? (
                <div className="mt-3 rounded-2xl border border-slate-800 bg-slate-900/80 p-3">
                    <div className="flex items-center justify-between gap-3">
                        <div className="min-w-0">
                            <p className="text-xs font-bold text-slate-400">
                                {t("systemTime")}
                            </p>
                            <p className="mt-1 text-sm font-black text-white">
                                {formatTime(undefined, language)}
                            </p>
                        </div>

                        <span className="shrink-0 rounded-full border border-cyan-400/30 bg-cyan-400/10 px-3 py-1 text-[0.65rem] font-black uppercase tracking-[0.14em] text-cyan-300">
              {language === "zh" ? "本地" : "Local"}
            </span>
                    </div>
                </div>
            ) : (
                <div className="mt-3 grid gap-2">
                    <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-3">
                        <p className="text-xs font-bold text-slate-400">
                            {t("systemTime")}
                        </p>
                        <p className="mt-1 text-sm font-black text-white">
                            {formatTime(undefined, language)}
                        </p>
                    </div>

                    <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-3">
                        <p className="text-xs font-bold text-slate-400">
                            {t("beijingTime")}
                        </p>
                        <p className="mt-1 text-sm font-black text-white">
                            {formatTime("Asia/Shanghai", language)}
                        </p>
                    </div>

                    <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-3">
                        <p className="text-xs font-bold text-slate-400">{t("utcTime")}</p>
                        <p className="mt-1 text-sm font-black text-white">
                            {formatTime("UTC", language)}
                        </p>
                    </div>

                    <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-3">
                        <p className="text-xs font-bold text-slate-400">{t("uaeTime")}</p>
                        <p className="mt-1 text-sm font-black text-white">
                            {formatTime("Asia/Dubai", language)}
                        </p>
                    </div>
                </div>
            )}

            <span className="sr-only">{tick}</span>
        </section>
    );
}