import { Suspense } from "react";
import AppNav from "@/components/AppNav";
import NewProjectForm from "@/components/NewProjectForm";

export default function NewProjectPage() {
    return (
        <main className="min-h-screen bg-slate-950 text-white">
            <section className="mx-auto max-w-4xl px-6 py-8">
                <AppNav />

                <div className="mb-10">
                    <p className="mb-2 text-sm font-bold text-cyan-300">
                        New coursework project
                    </p>
                    <h1 className="text-5xl font-black tracking-tight">
                        Create a new project.
                    </h1>
                    <p className="mt-4 max-w-2xl text-slate-300">
                        Set up your coursework goal, deadline, and planning style. In the
                        next missions, this form will generate a real task plan.
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
            </section>
        </main>
    );
}