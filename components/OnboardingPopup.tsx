"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

const ONBOARDING_STORAGE_KEY =
    "coursework-compass-v1-2-onboarding-dismissed";

export default function OnboardingPopup() {
    const pathname = usePathname();
    const [isReady, setIsReady] = useState(false);
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        if (pathname === "/test") {
            setIsReady(true);
            setIsOpen(false);
            return;
        }

        const hasDismissed = window.localStorage.getItem(ONBOARDING_STORAGE_KEY);

        setIsReady(true);
        setIsOpen(!hasDismissed);
    }, [pathname]);

    function handleClose() {
        window.localStorage.setItem(ONBOARDING_STORAGE_KEY, "true");
        setIsOpen(false);
    }

    if (!isReady || !isOpen) {
        return null;
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 px-4 py-6 backdrop-blur-md">
            <section className="relative max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-[2rem] border border-cyan-400/30 bg-slate-950 p-5 text-white shadow-2xl shadow-cyan-950/50 sm:p-8">
                <div className="absolute -right-16 -top-16 h-40 w-40 rounded-full bg-cyan-400/20 blur-3xl" />
                <div className="absolute -bottom-20 -left-20 h-48 w-48 rounded-full bg-emerald-400/20 blur-3xl" />

                <div className="relative z-10">
                    <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                        <div>
                            <div className="mb-4 inline-flex rounded-full border border-cyan-400/30 bg-cyan-400/10 px-4 py-2 text-xs font-black uppercase tracking-[0.2em] text-cyan-300">
                                v1.2 Student Testing Polish
                            </div>

                            <h2 className="text-3xl font-black tracking-tight sm:text-4xl">
                                Welcome to Coursework Compass.
                            </h2>

                            <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-300">
                                Coursework Compass helps IB and A-Level students turn large
                                coursework projects into clearer tasks, deadlines, and daily
                                actions. This version is prepared for student testing and early
                                feedback.
                            </p>
                        </div>

                        <button
                            type="button"
                            onClick={handleClose}
                            className="w-fit rounded-2xl border border-slate-700 px-4 py-3 text-sm font-bold text-slate-300 transition hover:border-slate-400 hover:text-white"
                        >
                            Close
                        </button>
                    </div>

                    <div className="grid gap-4 md:grid-cols-3">
                        <div className="rounded-3xl border border-slate-800 bg-slate-900 p-4">
                            <p className="mb-2 text-sm font-black text-cyan-300">01</p>
                            <h3 className="mb-2 font-bold text-white">Create a plan</h3>
                            <p className="text-sm leading-6 text-slate-400">
                                Start with a coursework template, choose a deadline, and create
                                a task plan.
                            </p>
                        </div>

                        <div className="rounded-3xl border border-slate-800 bg-slate-900 p-4">
                            <p className="mb-2 text-sm font-black text-cyan-300">02</p>
                            <h3 className="mb-2 font-bold text-white">Try the tutorial</h3>
                            <p className="text-sm leading-6 text-slate-400">
                                Joining the student test? Use the guided tutorial before using
                                the real planner.
                            </p>
                        </div>

                        <div className="rounded-3xl border border-slate-800 bg-slate-900 p-4">
                            <p className="mb-2 text-sm font-black text-cyan-300">03</p>
                            <h3 className="mb-2 font-bold text-white">Send feedback</h3>
                            <p className="text-sm leading-6 text-slate-400">
                                Short feedback is enough. One clear sentence can help improve
                                the next version.
                            </p>
                        </div>
                    </div>

                    <div className="mt-5 rounded-3xl border border-amber-400/30 bg-amber-400/10 p-4">
                        <p className="mb-2 text-sm font-bold text-amber-300">
                            Before you save project data
                        </p>

                        <div className="space-y-2 text-sm leading-6 text-slate-300">
                            <p>
                                This beta saves projects in the local storage of this browser.
                                It does not currently create an online account or sync data
                                across devices.
                            </p>

                            <p>
                                Your saved projects may not appear if you switch device, switch
                                browser, clear browser data, use private browsing, or press
                                Reset data.
                            </p>

                            <p>
                                Please avoid entering private or sensitive personal information
                                during testing. You can use sample project names and sample
                                coursework details instead.
                            </p>
                        </div>
                    </div>

                    <div className="mt-6 flex flex-col gap-4 sm:flex-row">
                        <a
                            href="/projects/new"
                            onClick={handleClose}
                            className="rounded-2xl bg-cyan-400 px-6 py-4 text-center font-bold text-slate-950 transition hover:bg-cyan-300"
                        >
                            Start planning
                        </a>

                        <a
                            href="/test"
                            onClick={handleClose}
                            className="rounded-2xl bg-emerald-400 px-6 py-4 text-center font-bold text-slate-950 transition hover:bg-emerald-300"
                        >
                            Join student test
                        </a>

                        <button
                            type="button"
                            onClick={handleClose}
                            className="rounded-2xl border border-slate-700 px-6 py-4 text-center font-bold text-white transition hover:border-slate-400"
                        >
                            Explore first
                        </button>
                    </div>
                </div>
            </section>
        </div>
    );
}