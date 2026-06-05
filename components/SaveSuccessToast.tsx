"use client";

import { useEffect, useRef, useState } from "react";

type SaveSuccessEventDetail = {
    title?: string;
    message: string;
    actionLabel?: string;
    actionHref?: string;
};

const SAVE_SUCCESS_EVENT_NAME = "coursework-compass-save-success";

export default function SaveSuccessToast() {
    const [toast, setToast] = useState<SaveSuccessEventDetail | null>(null);
    const hideTimerRef = useRef<number | null>(null);

    useEffect(() => {
        function handleSaveSuccess(event: Event) {
            const customEvent = event as CustomEvent<SaveSuccessEventDetail>;

            if (hideTimerRef.current) {
                window.clearTimeout(hideTimerRef.current);
            }

            setToast({
                title: customEvent.detail?.title || "Saved successfully",
                message:
                    customEvent.detail?.message ||
                    "Your changes have been saved locally in this browser.",
                actionLabel: customEvent.detail?.actionLabel,
                actionHref: customEvent.detail?.actionHref,
            });

            hideTimerRef.current = window.setTimeout(() => {
                setToast(null);
            }, 4200);
        }

        window.addEventListener(SAVE_SUCCESS_EVENT_NAME, handleSaveSuccess);

        return () => {
            window.removeEventListener(SAVE_SUCCESS_EVENT_NAME, handleSaveSuccess);

            if (hideTimerRef.current) {
                window.clearTimeout(hideTimerRef.current);
            }
        };
    }, []);

    if (!toast) {
        return null;
    }

    return (
        <section className="fixed bottom-6 left-4 right-4 z-[70] mx-auto max-w-xl rounded-[1.75rem] border border-emerald-400/30 bg-slate-950/95 p-4 text-white shadow-2xl shadow-emerald-950/40 backdrop-blur-md sm:left-auto sm:right-6 sm:mx-0 sm:w-[28rem]">
            <div className="flex gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-emerald-400/30 bg-emerald-400/10 text-xl">
                    ✓
                </div>

                <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-4">
                        <div>
                            <p className="text-sm font-black text-emerald-300">
                                {toast.title}
                            </p>
                            <p className="mt-1 text-sm leading-6 text-slate-300">
                                {toast.message}
                            </p>
                        </div>

                        <button
                            type="button"
                            onClick={() => setToast(null)}
                            className="rounded-xl border border-slate-700 px-3 py-2 text-xs font-bold text-slate-400 transition hover:border-slate-400 hover:text-white"
                        >
                            Close
                        </button>
                    </div>

                    {toast.actionHref && toast.actionLabel ? (
                        <a
                            href={toast.actionHref}
                            className="mt-4 inline-block rounded-2xl bg-emerald-400 px-4 py-3 text-sm font-bold text-slate-950 transition hover:bg-emerald-300"
                        >
                            {toast.actionLabel}
                        </a>
                    ) : null}

                    <div className="mt-4 h-1 overflow-hidden rounded-full bg-slate-800">
                        <div className="h-full w-full origin-left animate-[saveToastBar_4.2s_linear_forwards] rounded-full bg-emerald-400" />
                    </div>
                </div>
            </div>
        </section>
    );
}