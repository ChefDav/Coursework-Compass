"use client";

import { useRef } from "react";

type DateInputElement = HTMLInputElement & {
    showPicker?: () => void;
};

type CalendarDateFieldProps = {
    id?: string;
    name?: string;
    label?: string;
    value: string;
    min?: string;
    max?: string;
    disabled?: boolean;
    placeholder?: string;
    helperText?: string;
    className?: string;
    onChange?: (value: string) => void;
    onDateChange?: (value: string) => void;
};

export default function CalendarDateField({
                                              id,
                                              name,
                                              label,
                                              value,
                                              min,
                                              max,
                                              disabled = false,
                                              placeholder,
                                              helperText,
                                              className = "",
                                              onChange,
                                              onDateChange,
                                          }: CalendarDateFieldProps) {
    const inputRef = useRef<HTMLInputElement>(null);

    function handleValueChange(nextValue: string) {
        onChange?.(nextValue);
        onDateChange?.(nextValue);
    }

    function openDatePicker() {
        if (disabled) {
            return;
        }

        const input = inputRef.current as DateInputElement | null;

        if (!input) {
            return;
        }

        input.focus();

        try {
            if (typeof input.showPicker === "function") {
                input.showPicker();
            }
        } catch {
            input.click();
        }
    }

    return (
        <div className={className}>
            {label ? (
                <label
                    htmlFor={id}
                    className="cc-text-muted mb-2 block text-sm font-black"
                >
                    {label}
                </label>
            ) : null}

            <div
                role="button"
                tabIndex={0}
                onClick={openDatePicker}
                onKeyDown={(event) => {
                    if (event.key === "Enter" || event.key === " ") {
                        event.preventDefault();
                        openDatePicker();
                    }
                }}
                className={`group cc-input relative flex min-h-16 cursor-pointer items-center rounded-2xl transition ${
                    disabled
                        ? "cursor-not-allowed opacity-60"
                        : "hover:border-cyan-400/70 focus-within:border-cyan-400 focus-within:ring-4 focus-within:ring-cyan-400/10"
                }`}
            >
                <input
                    ref={inputRef}
                    id={id}
                    name={name}
                    type="date"
                    value={value}
                    min={min}
                    max={max}
                    disabled={disabled}
                    onChange={(event) => handleValueChange(event.target.value)}
                    placeholder={placeholder}
                    className="cc-date-input h-full min-h-16 w-full cursor-pointer rounded-2xl bg-transparent px-4 py-4 pr-16 text-sm font-black outline-none sm:text-base"
                />

                <button
                    type="button"
                    aria-label="Open calendar"
                    onClick={(event) => {
                        event.preventDefault();
                        event.stopPropagation();
                        openDatePicker();
                    }}
                    disabled={disabled}
                    className="absolute right-3 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-2xl border border-cyan-400/30 bg-cyan-400/10 text-cyan-200 shadow-lg shadow-cyan-950/20 transition group-hover:border-cyan-300/60 group-hover:bg-cyan-400/20 group-hover:text-white disabled:cursor-not-allowed"
                >
                    <svg
                        aria-hidden="true"
                        viewBox="0 0 24 24"
                        className="h-5 w-5"
                        fill="none"
                    >
                        <path
                            d="M7 3v3M17 3v3M4.5 9.2h15M6.5 5h11A2.5 2.5 0 0 1 20 7.5v10A2.5 2.5 0 0 1 17.5 20h-11A2.5 2.5 0 0 1 4 17.5v-10A2.5 2.5 0 0 1 6.5 5Z"
                            stroke="currentColor"
                            strokeWidth="1.8"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                        <path
                            d="M8 12h.01M12 12h.01M16 12h.01M8 16h.01M12 16h.01"
                            stroke="currentColor"
                            strokeWidth="2.6"
                            strokeLinecap="round"
                        />
                    </svg>
                </button>
            </div>

            {helperText ? (
                <p className="cc-text-subtle mt-2 text-xs font-bold leading-5">
                    {helperText}
                </p>
            ) : null}
        </div>
    );
}
