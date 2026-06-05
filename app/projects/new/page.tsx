import { Suspense } from "react";
import AppNav from "@/components/AppNav";
import NewProjectForm from "@/components/NewProjectForm";
import TestingGuideCard from "@/components/TestingGuideCard";

export default function NewProjectPage() {
    return (
        <main className="min-h-screen bg-slate-950 text-white">
            <section className="mx-auto max-w-4xl px-4 py-6 sm:px-6 sm:py-8">
                <AppNav />

                <div className="mb-10">
                    <p className="mb-2 text-sm font-bold text-cyan-300">
                        New coursework project
                    </p>
                    <h1 className="text-4xl font-black tracking-tight sm:text-5xl">
                        Create a new project.
                    </h1>
                    <p className="mt-4 max-w-2xl text-slate-300">
                        Set up your coursework goal, deadline, and planning style. This
                        form can generate and save a real coursework task plan.
                    </p>
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
            </section>
        </main>
    );
}