"use client";

import { useEffect, useMemo, useRef, useState } from "react";

type CalendarDateFieldProps = {
    label: string;
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    helperText?: string;
};

type ParsedDate = {
    year: number;
    month: number;
    day: number;
};

type DisplayMonth = {
    year: number;
    month: number;
};

const minimumYear = 2026;
const weekdays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

function normaliseDateInput(value: string) {
    return value.trim().replaceAll("-", "/");
}

function pad(value: number) {
    return String(value).padStart(2, "0");
}

function formatDate(year: number, month: number, day: number) {
    return `${year}/${pad(month)}/${pad(day)}`;
}

function parseDateInput(value: string): ParsedDate | null {
    const normalisedValue = normaliseDateInput(value);
    const match = normalisedValue.match(/^(\d{4})\/(\d{2})\/(\d{2})$/);

    if (!match) {
        return null;
    }

    const year = Number(match[1]);
    const month = Number(match[2]);
    const day = Number(match[3]);

    const parsedDate = new Date(year, month - 1, day);
    const isRealDate =
        parsedDate.getFullYear() === year &&
        parsedDate.getMonth() === month - 1 &&
        parsedDate.getDate() === day;

    if (!isRealDate) {
        return null;
    }

    return {
        year,
        month,
        day,
    };
}

function getInitialDisplayMonth(value: string): DisplayMonth {
    const parsedDate = parseDateInput(value);

    if (parsedDate && parsedDate.year >= minimumYear) {
        return {
            year: parsedDate.year,
            month: parsedDate.month - 1,
        };
    }

    const today = new Date();

    if (today.getFullYear() < minimumYear) {
        return {
            year: minimumYear,
            month: 0,
        };
    }

    return {
        year: today.getFullYear(),
        month: today.getMonth(),
    };
}

function getDaysInMonth(year: number, month: number) {
    return new Date(year, month + 1, 0).getDate();
}

function getMondayFirstOffset(year: number, month: number) {
    const day = new Date(year, month, 1).getDay();

    return (day + 6) % 7;
}

function isBeforeMinimumYear(year: number) {
    return year < minimumYear;
}

export default function CalendarDateField({
                                              label,
                                              value,
                                              onChange,
                                              placeholder = "yyyy/mm/dd",
                                              helperText,
                                          }: CalendarDateFieldProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [isManualMode, setIsManualMode] = useState(false);
    const [manualValue, setManualValue] = useState(normaliseDateInput(value));
    const [manualError, setManualError] = useState("");
    const [displayMonth, setDisplayMonth] = useState<DisplayMonth>(() =>
        getInitialDisplayMonth(value),
    );

    const containerRef = useRef<HTMLDivElement | null>(null);

    const selectedDate = useMemo(() => {
        return parseDateInput(value);
    }, [value]);

    const daysInMonth = getDaysInMonth(displayMonth.year, displayMonth.month);
    const firstDayOffset = getMondayFirstOffset(
        displayMonth.year,
        displayMonth.month,
    );

    const monthLabel = new Intl.DateTimeFormat("en-GB", {
        month: "long",
        year: "numeric",
    }).format(new Date(displayMonth.year, displayMonth.month, 1));

    useEffect(() => {
        setManualValue(normaliseDateInput(value));
        setDisplayMonth(getInitialDisplayMonth(value));
    }, [value]);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (!containerRef.current) {
                return;
            }

            if (!containerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
                setIsManualMode(false);
                setManualError("");
            }
        }

        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    function openCalendar() {
        setIsOpen(true);
        setIsManualMode(false);
        setManualError("");
    }

    function openManualInput() {
        setIsOpen(true);
        setIsManualMode(true);
        setManualValue(normaliseDateInput(value));
        setManualError("");
    }

    function changeMonth(monthOffset: number) {
        const nextDate = new Date(
            displayMonth.year,
            displayMonth.month + monthOffset,
            1,
        );

        const nextYear = nextDate.getFullYear();
        const nextMonth = nextDate.getMonth();

        if (nextYear < minimumYear) {
            setDisplayMonth({
                year: minimumYear,
                month: 0,
            });
            return;
        }

        setDisplayMonth({
            year: nextYear,
            month: nextMonth,
        });
    }

    function changeYear(yearOffset: number) {
        const nextYear = displayMonth.year + yearOffset;

        if (nextYear < minimumYear) {
            setDisplayMonth({
                year: minimumYear,
                month: 0,
            });
            return;
        }

        setDisplayMonth({
            year: nextYear,
            month: displayMonth.month,
        });
    }

    function selectDate(day: number) {
        if (isBeforeMinimumYear(displayMonth.year)) {
            return;
        }

        const nextValue = formatDate(
            displayMonth.year,
            displayMonth.month + 1,
            day,
        );

        onChange(nextValue);
        setManualValue(nextValue);
        setIsOpen(false);
        setIsManualMode(false);
        setManualError("");
    }

    function applyManualValue() {
        const parsedDate = parseDateInput(manualValue);

        if (!parsedDate) {
            setManualError("Use a real date in yyyy/mm/dd format.");
            return;
        }

        if (parsedDate.year < minimumYear) {
            setManualError("The year cannot be earlier than 2026.");
            return;
        }

        const nextValue = formatDate(
            parsedDate.year,
            parsedDate.month,
            parsedDate.day,
        );

        onChange(nextValue);
        setManualValue(nextValue);
        setDisplayMonth({
            year: parsedDate.year,
            month: parsedDate.month - 1,
        });
        setIsOpen(false);
        setIsManualMode(false);
        setManualError("");
    }

    const displayedValue = value ? normaliseDateInput(value) : placeholder;

    return (
        <div ref={containerRef} className="relative">
            <label className="mb-2 block text-sm font-bold text-white">
                {label}
            </label>

            <button
                type="button"
                onClick={openCalendar}
                onDoubleClick={openManualInput}
                className="group flex w-full items-center justify-between gap-4 rounded-2xl border border-slate-600 bg-slate-950/70 px-4 py-4 text-left font-bold text-white outline-none transition hover:border-cyan-400/70 focus:border-cyan-300 focus:shadow-lg focus:shadow-cyan-950/40"
            >
        <span className={value ? "text-white" : "text-slate-500"}>
          {displayedValue}
        </span>

                <span className="rounded-full bg-cyan-400/10 px-3 py-1 text-xs font-black text-cyan-300 transition group-hover:bg-cyan-400/20">
          Calendar
        </span>
            </button>

            {helperText ? (
                <p className="mt-2 text-xs leading-5 text-slate-400">{helperText}</p>
            ) : null}

            {isOpen ? (
                <div className="absolute left-0 right-0 top-[calc(100%+0.75rem)] z-50 rounded-[2rem] border border-cyan-400/30 bg-slate-950 p-4 text-white shadow-2xl shadow-cyan-950/60 sm:min-w-[25rem]">
                    <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <p className="text-xs font-bold uppercase tracking-[0.2em] text-cyan-300">
                                Deadline calendar
                            </p>
                            <h3 className="mt-1 text-xl font-black">{monthLabel}</h3>
                        </div>

                        <div className="flex flex-wrap gap-2">
                            <button
                                type="button"
                                onClick={() => changeYear(-1)}
                                className="rounded-full border border-slate-700 px-3 py-2 text-xs font-bold text-slate-300 transition hover:border-cyan-400 hover:text-cyan-300"
                            >
                                Year -
                            </button>

                            <button
                                type="button"
                                onClick={() => changeMonth(-1)}
                                className="rounded-full border border-slate-700 px-3 py-2 text-xs font-bold text-slate-300 transition hover:border-cyan-400 hover:text-cyan-300"
                            >
                                Month -
                            </button>

                            <button
                                type="button"
                                onClick={() => changeMonth(1)}
                                className="rounded-full border border-slate-700 px-3 py-2 text-xs font-bold text-slate-300 transition hover:border-cyan-400 hover:text-cyan-300"
                            >
                                Month +
                            </button>

                            <button
                                type="button"
                                onClick={() => changeYear(1)}
                                className="rounded-full border border-slate-700 px-3 py-2 text-xs font-bold text-slate-300 transition hover:border-cyan-400 hover:text-cyan-300"
                            >
                                Year +
                            </button>
                        </div>
                    </div>

                    <div className="mb-4 flex flex-wrap gap-2">
                        <button
                            type="button"
                            onClick={() => {
                                setIsManualMode((currentValue) => !currentValue);
                                setManualValue(normaliseDateInput(value));
                                setManualError("");
                            }}
                            className="rounded-full border border-cyan-400/30 bg-cyan-400/10 px-4 py-2 text-xs font-black text-cyan-300 transition hover:bg-cyan-400/20"
                        >
                            {isManualMode ? "Back to calendar" : "Manual input"}
                        </button>

                        <button
                            type="button"
                            onClick={() => {
                                setIsOpen(false);
                                setIsManualMode(false);
                                setManualError("");
                            }}
                            className="rounded-full border border-slate-700 px-4 py-2 text-xs font-black text-slate-300 transition hover:border-slate-400 hover:text-white"
                        >
                            Close
                        </button>
                    </div>

                    {isManualMode ? (
                        <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-4">
                            <label className="mb-2 block text-sm font-bold text-white">
                                Type date manually
                            </label>

                            <input
                                type="text"
                                value={manualValue}
                                onChange={(event) => {
                                    setManualValue(normaliseDateInput(event.target.value));
                                    setManualError("");
                                }}
                                onKeyDown={(event) => {
                                    if (event.key === "Enter") {
                                        applyManualValue();
                                    }
                                }}
                                placeholder="yyyy/mm/dd"
                                autoFocus
                                className="w-full rounded-2xl border border-slate-600 bg-slate-950/70 px-4 py-4 font-bold text-white outline-none transition placeholder:text-slate-500 focus:border-cyan-300 focus:shadow-lg focus:shadow-cyan-950/40"
                            />

                            <p className="mt-2 text-xs leading-5 text-slate-400">
                                You can also double-click the deadline field to open this mode.
                            </p>

                            {manualError ? (
                                <div className="mt-3 rounded-2xl border border-red-400/30 bg-red-400/10 p-3 text-xs font-bold text-red-300">
                                    {manualError}
                                </div>
                            ) : null}

                            <button
                                type="button"
                                onClick={applyManualValue}
                                className="mt-4 rounded-2xl bg-cyan-400 px-5 py-3 text-sm font-bold text-slate-950 transition hover:bg-cyan-300"
                            >
                                Apply date
                            </button>
                        </div>
                    ) : (
                        <>
                            <div className="grid grid-cols-7 gap-2">
                                {weekdays.map((weekday) => (
                                    <div
                                        key={weekday}
                                        className="px-2 py-2 text-center text-xs font-black text-slate-500"
                                    >
                                        {weekday}
                                    </div>
                                ))}

                                {Array.from({ length: firstDayOffset }).map((_, index) => (
                                    <div key={`blank-${index}`} />
                                ))}

                                {Array.from({ length: daysInMonth }).map((_, index) => {
                                    const day = index + 1;
                                    const isSelected =
                                        selectedDate?.year === displayMonth.year &&
                                        selectedDate.month === displayMonth.month + 1 &&
                                        selectedDate.day === day;

                                    const isDisabled = displayMonth.year < minimumYear;

                                    return (
                                        <button
                                            key={day}
                                            type="button"
                                            onClick={() => selectDate(day)}
                                            disabled={isDisabled}
                                            className={`relative flex aspect-square items-center justify-center rounded-2xl text-sm font-black transition ${
                                                isDisabled
                                                    ? "cursor-not-allowed text-slate-700"
                                                    : isSelected
                                                        ? "text-cyan-100"
                                                        : "text-slate-200 hover:bg-slate-800 hover:text-cyan-300"
                                            }`}
                                        >
                                            {isSelected ? (
                                                <span className="absolute inset-1 rotate-[-8deg] rounded-[47%_53%_45%_55%/54%_43%_57%_46%] border-2 border-cyan-300" />
                                            ) : null}

                                            {isSelected ? (
                                                <span className="absolute inset-2 rotate-[5deg] rounded-[54%_46%_55%_45%/45%_56%_44%_55%] border border-cyan-200/70" />
                                            ) : null}

                                            <span className="relative z-10">{day}</span>
                                        </button>
                                    );
                                })}
                            </div>

                            <p className="mt-4 text-xs leading-5 text-slate-400">
                                Click a date to select it. Double-click the deadline field to
                                type manually.
                            </p>
                        </>
                    )}
                </div>
            ) : null}
        </div>
    );
}