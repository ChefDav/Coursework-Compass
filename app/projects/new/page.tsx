import { Suspense } from "react";
import AppNav from "@/components/AppNav";
import BetaNotice from "@/components/BetaNotice";
import FeedbackPanel from "@/components/FeedbackPanel";
import NewProjectForm from "@/components/NewProjectForm";
import TestingGuideCard from "@/components/TestingGuideCard";

export default function NewProjectPage() {
    return (
        <main className="min-h-screen bg-slate-950 text-white">
            <section className="mx-auto max-w-6xl px-4 py-6 sm:px-6 sm:py-8">
                <AppNav />

                <div className="mb-10">
                    <p className="mb-2 text-sm font-bold text-cyan-300">
                        New coursework plan
                    </p>
                    <h1 className="text-4xl font-black tracking-tight sm:text-5xl">
                        Create a new project.
                    </h1>
                    <p className="mt-4 max-w-3xl text-sm leading-6 text-slate-300">
                        Set up your coursework goal, template, deadline, and planning
                        intensity. Coursework Compass will generate a real task plan that
                        you can save, edit, and track.
                    </p>
                </div>

                <section className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
                    <div className="space-y-8">
                        <div className="rounded-[2rem] border border-emerald-400/30 bg-emerald-400/10 p-5 shadow-2xl shadow-emerald-950/20 sm:p-6">
                            <p className="mb-2 text-sm font-bold text-emerald-300">
                                Testing tip
                            </p>
                            <h2 className="text-2xl font-black sm:text-3xl">
                                Use a real project or make a sample one.
                            </h2>
                            <p className="mt-3 text-sm leading-6 text-slate-300">
                                For student testing, you can enter a real coursework project,
                                or simply create a sample project to explore the workflow. The
                                current beta stores data locally in this browser, so please
                                avoid entering private or sensitive personal information.
                            </p>

                            <div className="mt-5 grid gap-3 text-sm leading-6 text-slate-400">
                                <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-4">
                                    Try choosing a subject-specific template.
                                </div>

                                <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-4">
                                    Try selecting a deadline with the calendar picker.
                                </div>

                                <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-4">
                                    Create and save the generated plan.
                                </div>

                                <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-4">
                                    Then add, edit, delete, and complete a task.
                                </div>
                            </div>

                            <div className="mt-5 flex flex-col gap-3 sm:flex-row lg:flex-col">
                                <a
                                    href="/test"
                                    className="rounded-2xl bg-emerald-400 px-5 py-3 text-center text-sm font-bold text-slate-950 transition hover:bg-emerald-300"
                                >
                                    Try guided tutorial first
                                </a>

                                <a
                                    href="/projects"
                                    className="rounded-2xl border border-slate-700 px-5 py-3 text-center text-sm font-bold text-white transition hover:border-slate-400"
                                >
                                    Back to projects
                                </a>
                            </div>
                        </div>

                        <BetaNotice />
                    </div>

                    <div className="rounded-[2rem] border border-cyan-400/20 bg-slate-900/70 p-4 shadow-2xl shadow-cyan-950/20 sm:p-6">
                        <Suspense
                            fallback={
                                <div className="rounded-3xl border border-slate-800 bg-slate-950/70 p-6 text-sm font-bold text-slate-300">
                                    Loading project form...
                                </div>
                            }
                        >
                            <NewProjectForm />
                        </Suspense>
                    </div>
                </section>

                <div className="mt-10">
                    <TestingGuideCard />
                </div>

                <div className="mt-10">
                    <FeedbackPanel />
                </div>
            </section>
        </main>
    );
}