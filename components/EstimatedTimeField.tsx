"use client";

import { useMemo, useState } from "react";

type TimeUnit = "min" | "hours" | "days";

type ParsedEstimatedTime = {
    amount: string;
    unit: TimeUnit;
};

type EstimatedTimeFieldProps = {
    value?: string | null;
    onChange: (value: string) => void;
    label?: string;
    disabled?: boolean;
};

const unitOptions: { label: string; value: TimeUnit }[] = [
    {
        label: "min",
        value: "min",
    },
    {
        label: "hours",
        value: "hours",
    },
    {
        label: "days",
        value: "days",
    },
];

function safeString(value: string | number | null | undefined) {
    if (typeof value === "number") {
        return String(value);
    }

    if (typeof value !== "string") {
        return "";
    }

    return value;
}

function removeTrailingZero(value: number) {
    if (Number.isInteger(value)) {
        return String(value);
    }

    return String(Number(value.toFixed(2)));
}

export function parseEstimatedTime(
    value: string | number | null | undefined,
): ParsedEstimatedTime {
    const cleanedValue = safeString(value).trim().toLowerCase();

    if (!cleanedValue || cleanedValue === "not set") {
        return {
            amount: "",
            unit: "min",
        };
    }

    const numberMatch = cleanedValue.match(/[\d.]+/);
    const amount = numberMatch ? numberMatch[0] : "";

    if (
        cleanedValue.includes("day") ||
        cleanedValue.includes("days") ||
        cleanedValue.endsWith(" d")
    ) {
        return {
            amount,
            unit: "days",
        };
    }

    if (
        cleanedValue.includes("hour") ||
        cleanedValue.includes("hours") ||
        cleanedValue.includes("hr") ||
        cleanedValue.includes("hrs") ||
        cleanedValue.endsWith(" h")
    ) {
        return {
            amount,
            unit: "hours",
        };
    }

    return {
        amount,
        unit: "min",
    };
}

export function normaliseEstimatedTime(
    value: string | number | null | undefined,
    fallbackUnit: TimeUnit = "min",
) {
    const cleanedValue = safeString(value).trim();

    if (!cleanedValue || cleanedValue.toLowerCase() === "not set") {
        return "Not set";
    }

    const parsed = parseEstimatedTime(cleanedValue);
    const amountNumber = Number(parsed.amount);

    if (!Number.isFinite(amountNumber) || amountNumber <= 0) {
        return "Not set";
    }

    const unit = parsed.unit || fallbackUnit;

    if (unit === "min") {
        if (amountNumber >= 1440) {
            const days = amountNumber / 1440;
            return `${removeTrailingZero(days)} ${days === 1 ? "day" : "days"}`;
        }

        if (amountNumber >= 60) {
            const hours = amountNumber / 60;
            return `${removeTrailingZero(hours)} ${
                hours === 1 ? "hour" : "hours"
            }`;
        }

        return `${removeTrailingZero(amountNumber)} min`;
    }

    if (unit === "hours") {
        if (amountNumber >= 24) {
            const days = amountNumber / 24;
            return `${removeTrailingZero(days)} ${days === 1 ? "day" : "days"}`;
        }

        return `${removeTrailingZero(amountNumber)} ${
            amountNumber === 1 ? "hour" : "hours"
        }`;
    }

    return `${removeTrailingZero(amountNumber)} ${
        amountNumber === 1 ? "day" : "days"
    }`;
}

export default function EstimatedTimeField({
                                               value,
                                               onChange,
                                               label = "Estimated time",
                                               disabled = false,
                                           }: EstimatedTimeFieldProps) {
    const parsedValue = useMemo(() => parseEstimatedTime(value), [value]);

    const [lastValue, setLastValue] = useState(value);
    const [amount, setAmount] = useState(parsedValue.amount);
    const [unit, setUnit] = useState<TimeUnit>(parsedValue.unit);

    if (value !== lastValue) {
        const nextParsedValue = parseEstimatedTime(value);
        setLastValue(value);
        setAmount(nextParsedValue.amount);
        setUnit(nextParsedValue.unit);
    }

    function commitValue(nextAmount: string, nextUnit: TimeUnit) {
        const cleanedAmount = nextAmount.trim();

        if (!cleanedAmount) {
            onChange("Not set");
            return;
        }

        const normalisedValue = normaliseEstimatedTime(
            `${cleanedAmount} ${nextUnit}`,
            nextUnit,
        );

        onChange(normalisedValue);
    }

    function handleAmountChange(nextAmount: string) {
        const cleanedAmount = nextAmount.replace(/[^\d.]/g, "");
        setAmount(cleanedAmount);
    }

    function handleAmountBlur() {
        commitValue(amount, unit);
    }

    function handleUnitChange(nextUnit: TimeUnit) {
        setUnit(nextUnit);
        commitValue(amount, nextUnit);
    }

    return (
        <div>
            <label className="cc-text-muted mb-2 block text-xs font-bold">
                {label}
            </label>

            <div className="grid grid-cols-[1fr_8.5rem] gap-3">
                <input
                    type="text"
                    value={amount}
                    disabled={disabled}
                    onChange={(event) => handleAmountChange(event.target.value)}
                    onBlur={handleAmountBlur}
                    onKeyDown={(event) => {
                        if (event.key === "Enter") {
                            commitValue(amount, unit);
                        }
                    }}
                    placeholder="e.g. 60"
                    className="cc-input w-full rounded-2xl px-4 py-3 text-sm font-bold transition disabled:cursor-not-allowed disabled:opacity-60"
                />

                <select
                    value={unit}
                    disabled={disabled}
                    onChange={(event) => handleUnitChange(event.target.value as TimeUnit)}
                    className="cc-input w-full rounded-2xl px-4 py-3 text-sm font-bold transition disabled:cursor-not-allowed disabled:opacity-60"
                >
                    {unitOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                            {option.label}
                        </option>
                    ))}
                </select>
            </div>

            <p className="cc-text-subtle mt-2 text-xs leading-5">
                Examples: 60 min becomes 1 hour, 120 min becomes 2 hours, and 24 hours
                becomes 1 day.
            </p>
        </div>
    );
}
