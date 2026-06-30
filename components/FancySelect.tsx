"use client";

import { useEffect, useRef, useState } from "react";

export type FancySelectOption = {
    label: string;
    value: string;
    description?: string;
};

type FancySelectProps = {
    label: string;
    value: string;
    placeholder: string;
    options: FancySelectOption[];
    onChange: (value: string) => void;
    helperText?: string;
};

export default function FancySelect({
                                        label,
                                        value,
                                        placeholder,
                                        options,
                                        onChange,
                                        helperText,
                                    }: FancySelectProps) {
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement | null>(null);

    const selectedOption = options.find((option) => option.value === value);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (!containerRef.current) {
                return;
            }

            if (!containerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }

        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    function handleSelect(nextValue: string) {
        onChange(nextValue);
        setIsOpen(false);
    }

    return (
        <div ref={containerRef} className="relative">
            <label className="cc-text-muted mb-2 block text-sm font-black">
                {label}
            </label>

            <button
                type="button"
                onClick={() => setIsOpen((currentValue) => !currentValue)}
                className={`cc-focus-ring flex w-full items-center justify-between gap-4 rounded-2xl border px-4 py-4 text-left font-bold transition ${
                    isOpen
                        ? "border-cyan-300 bg-[var(--cc-input-bg)] shadow-[var(--cc-shadow-soft)]"
                        : "border-[var(--cc-input-border)] bg-[var(--cc-input-bg)] hover:border-cyan-400/70"
                }`}
            >
        <span className={selectedOption ? "cc-text-main" : "cc-text-subtle"}>
          {selectedOption ? selectedOption.label : placeholder}
        </span>

                <span
                    className={`text-cyan-300 transition ${
                        isOpen ? "rotate-180" : "rotate-0"
                    }`}
                >
          ▼
        </span>
            </button>

            {helperText ? (
                <p className="cc-helper-text mt-2">{helperText}</p>
            ) : null}

            {isOpen ? (
                <div className="cc-panel-strong cc-motion-scale-in absolute left-0 right-0 top-[calc(100%+0.5rem)] z-50 overflow-hidden rounded-[1.5rem]">
                    <div className="max-h-80 overflow-y-auto p-2">
                        {options.map((option) => {
                            const isSelected = option.value === value;

                            return (
                                <button
                                    key={option.value}
                                    type="button"
                                    onClick={() => handleSelect(option.value)}
                                    className={`cc-interactive-button w-full rounded-2xl px-4 py-3 text-left transition ${
                                        isSelected
                                            ? "border-cyan-300 bg-cyan-400 text-slate-950"
                                            : "cc-button-secondary"
                                    }`}
                                >
                                    <div className="flex items-center justify-between gap-3">
                                        <span className="font-black">{option.label}</span>

                                        {isSelected ? (
                                            <span className="rounded-full bg-slate-950/10 px-2 py-1 text-xs font-black">
                        Selected
                      </span>
                                        ) : null}
                                    </div>

                                    {option.description ? (
                                        <p
                                            className={`mt-1 text-xs leading-5 ${
                                                isSelected ? "text-slate-800" : "cc-text-subtle"
                                            }`}
                                        >
                                            {option.description}
                                        </p>
                                    ) : null}
                                </button>
                            );
                        })}
                    </div>
                </div>
            ) : null}
        </div>
    );
}
