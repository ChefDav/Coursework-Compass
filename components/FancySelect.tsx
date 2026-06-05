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
            <label className="mb-2 block text-sm font-bold text-white">
                {label}
            </label>

            <button
                type="button"
                onClick={() => setIsOpen((currentValue) => !currentValue)}
                className={`flex w-full items-center justify-between gap-4 rounded-2xl border px-4 py-4 text-left font-bold transition ${
                    isOpen
                        ? "border-cyan-300 bg-slate-950 shadow-lg shadow-cyan-950/40"
                        : "border-slate-600 bg-slate-950/70 hover:border-cyan-400/70"
                }`}
            >
        <span className={selectedOption ? "text-white" : "text-slate-400"}>
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
                <p className="mt-2 text-xs leading-5 text-slate-400">{helperText}</p>
            ) : null}

            {isOpen ? (
                <div className="absolute left-0 right-0 top-[calc(100%+0.5rem)] z-50 overflow-hidden rounded-3xl border border-cyan-400/30 bg-slate-950 shadow-2xl shadow-cyan-950/50">
                    <div className="max-h-80 overflow-y-auto p-2">
                        {options.map((option) => {
                            const isSelected = option.value === value;

                            return (
                                <button
                                    key={option.value}
                                    type="button"
                                    onClick={() => handleSelect(option.value)}
                                    className={`w-full rounded-2xl px-4 py-3 text-left transition ${
                                        isSelected
                                            ? "bg-cyan-400 text-slate-950"
                                            : "text-slate-200 hover:bg-slate-800"
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
                                                isSelected ? "text-slate-800" : "text-slate-400"
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