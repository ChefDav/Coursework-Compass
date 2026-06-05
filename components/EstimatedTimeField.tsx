"use client";

import { useEffect, useMemo, useState } from "react";
import FancySelect from "@/components/FancySelect";

type TimeUnit = "minutes" | "hours" | "days";

type EstimatedTimeFieldProps = {
    label: string;
    value: string;
    onChange: (value: string) => void;
    helperText?: string;
};

const unitOptions = [
    {
        label: "Minutes",
        value: "minutes",
        description: "Best for short tasks, for example 30 min or 45 min.",
    },
    {
        label: "Hours",
        value: "hours",
        description: "Best for longer work blocks, for example 1 hour or 2 hours.",
    },
    {
        label: "Days",
        value: "days",
        description: "Best for major tasks that take multiple days.",
    },
];

function isTimeUnit(value: string): value is TimeUnit {
    return value === "minutes" || value === "hours" || value === "days";
}

function formatNumber(value: number) {
    if (Number.isInteger(value)) {
        return String(value);
    }

    return String(Number(value.toFixed(2)));
}

function formatEstimatedTimeFromMinutes(totalMinutes: number) {
    if (!Number.isFinite(totalMinutes) || totalMinutes <= 0) {
        return "45 min";
    }

    if (totalMinutes < 60) {
        return `${formatNumber(totalMinutes)} min`;
    }

    if (totalMinutes < 24 * 60) {
        const hours = totalMinutes / 60;
        const unit = hours === 1 ? "hour" : "hours";

        return `${formatNumber(hours)} ${unit}`;
    }

    const days = totalMinutes / (24 * 60);
    const unit = days === 1 ? "day" : "days";

    return `${formatNumber(days)} ${unit}`;
}

function convertToMinutes(amount: number, unit: TimeUnit) {
    if (unit === "minutes") {
        return amount;
    }

    if (unit === "hours") {
        return amount * 60;
    }

    return amount * 24 * 60;
}

function parseEstimatedTime(value: string) {
    const cleanedValue = value.trim().toLowerCase();

    if (!cleanedValue) {
        return {
            amount: "45",
            unit: "minutes" as TimeUnit,
        };
    }

    const numberMatch = cleanedValue.match(/(\d+(\.\d+)?)/);
    const amount = numberMatch?.[1] ?? "45";

    if (
        cleanedValue.includes("day") ||
        cleanedValue.includes("days") ||
        cleanedValue.includes("d")
    ) {
        return {
            amount,
            unit: "days" as TimeUnit,
        };
    }

    if (
        cleanedValue.includes("hour") ||
        cleanedValue.includes("hours") ||
        cleanedValue.includes("hr") ||
        cleanedValue.includes("hrs") ||
        cleanedValue.includes("h")
    ) {
        return {
            amount,
            unit: "hours" as TimeUnit,
        };
    }

    return {
        amount,
        unit: "minutes" as TimeUnit,
    };
}

export function normaliseEstimatedTime(value: string) {
    const parsedValue = parseEstimatedTime(value);
    const amount = Number(parsedValue.amount);

    if (!Number.isFinite(amount) || amount <= 0) {
        return "45 min";
    }

    return formatEstimatedTimeFromMinutes(
        convertToMinutes(amount, parsedValue.unit),
    );
}

export default function EstimatedTimeField({
                                               label,
                                               value,
                                               onChange,
                                               helperText,
                                           }: EstimatedTimeFieldProps) {
    const parsedInitialValue = useMemo(() => parseEstimatedTime(value), [value]);

    const [amount, setAmount] = useState(parsedInitialValue.amount);
    const [unit, setUnit] = useState<TimeUnit>(parsedInitialValue.unit);
    const [error, setError] = useState("");

    useEffect(() => {
        const parsedValue = parseEstimatedTime(value);
        setAmount(parsedValue.amount);
        setUnit(parsedValue.unit);
    }, [value]);

    function updateEstimatedTime(nextAmount: string, nextUnit: TimeUnit) {
        setAmount(nextAmount);
        setUnit(nextUnit);
        setError("");

        const numericAmount = Number(nextAmount);

        if (!nextAmount.trim()) {
            onChange("");
            return;
        }

        if (!Number.isFinite(numericAmount) || numericAmount <= 0) {
            setError("Enter a positive number.");
            return;
        }

        const totalMinutes = convertToMinutes(numericAmount, nextUnit);
        const formattedValue = formatEstimatedTimeFromMinutes(totalMinutes);

        onChange(formattedValue);
    }

    return (
        <div>
            <label className="mb-2 block text-sm font-bold text-white">
                {label}
            </label>

            <div className="grid gap-3 sm:grid-cols-[0.8fr_1.2fr]">
                <input
                    type="number"
                    min="0"
                    step="0.25"
                    value={amount}
                    onChange={(event) => updateEstimatedTime(event.target.value, unit)}
                    placeholder="45"
                    className="w-full rounded-2xl border border-slate-600 bg-slate-950/70 px-4 py-4 font-bold text-white outline-none transition placeholder:text-slate-500 focus:border-cyan-300 focus:shadow-lg focus:shadow-cyan-950/40"
                />

                <FancySelect
                    label="Unit"
                    value={unit}
                    placeholder="Choose unit"
                    options={unitOptions}
                    onChange={(nextValue) => {
                        if (!isTimeUnit(nextValue)) {
                            return;
                        }

                        updateEstimatedTime(amount, nextValue);
                    }}
                    helperText=""
                />
            </div>

            <div className="mt-2 rounded-2xl border border-slate-800 bg-slate-950/60 px-3 py-2">
                <p className="text-xs font-bold text-cyan-300">
                    Saved as: {normaliseEstimatedTime(value || `${amount} ${unit}`)}
                </p>
            </div>

            {helperText ? (
                <p className="mt-2 text-xs leading-5 text-slate-400">{helperText}</p>
            ) : null}

            {error ? (
                <div className="mt-3 rounded-2xl border border-red-400/30 bg-red-400/10 p-3 text-xs font-bold text-red-300">
                    {error}
                </div>
            ) : null}
        </div>
    );
}