import { Suspense } from "react";
import AppNav from "@/components/AppNav";
import BetaNotice from "@/components/BetaNotice";
import FeedbackPanel from "@/components/FeedbackPanel";
import NewProjectForm from "@/components/NewProjectForm";
import TestingGuideCard from "@/components/TestingGuideCard";

export default function NewProjectPage() {
    return (
        <main className="min-h-screen bg-slate-950 text-white">
            <section className="mx-auto max-w-4xl px-4 py-6 sm:px-6 sm:py-8">
                <AppNav />

                <div className="mb-10">
                    <p className="mb-2 text-sm font-bold text-cyan-300">
                        New coursework plan
                    </p>
                    <h1 className="text-4xl font-black tracking-tight sm:text-5xl">
                        Create a new project.
                    </h1>
                    <p className="mt-4 max-w-2xl text-slate-300">
                        Set up your coursework goal, template, deadline, and planning
                        intensity. Coursework Compass will generate a real task plan that
                        you can save, edit, and track.
                    </p>
                </div>

                <div className="mb-8 rounded-[2rem] border border-emerald-400/30 bg-emerald-400/10 p-5 sm:p-6">
                    <p className="mb-2 text-sm font-bold text-emerald-300">
                        Testing tip
                    </p>
                    <h2 className="text-2xl font-black sm:text-3xl">
                        Use a real project or make a sample one.
                    </h2>
                    <p className="mt-3 text-sm leading-6 text-slate-300">
                        For next week&apos;s student testing, you can enter a real
                        coursework project, or simply create a sample project to explore the
                        workflow. The current beta stores data locally in this browser, so
                        please avoid entering private or sensitive personal information.
                    </p>

                    <div className="mt-4 grid gap-3 text-sm leading-6 text-slate-400 md:grid-cols-2">
                        <p>• Try choosing a template</p>
                        <p>• Try selecting a deadline</p>
                        <p>• Create and save the generated plan</p>
                        <p>• Then add, edit, delete, and complete a task</p>
                    </div>
                </div>

                <div className="mb-8">
                    <BetaNotice />
                </div>

                <Suspense
                    fallback={
                        <div className="rounded-3xl border border-slate-800 bg-slate-900 p-6 text-slate-300">
                            Loading project form...
                        </div>
                    }
                >
                    <NewProjectForm />
                </Suspense>

                <div className="mt-8">
                    <TestingGuideCard />
                </div>

                <div className="mt-8">
                    <FeedbackPanel />
                </div>
            </section>
        </main>
    );
}