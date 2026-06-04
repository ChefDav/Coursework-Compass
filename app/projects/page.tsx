import AppNav from "@/components/AppNav";
import { projectTemplates } from "@/lib/mockData";

export default function ProjectsPage() {
    return (
        <main className="min-h-screen bg-slate-950 text-white">
            <section className="mx-auto max-w-6xl px-6 py-8">
                <AppNav />

                <div className="mb-10 flex flex-col justify-between gap-6 md:flex-row md:items-end">
                    <div>
                        <p className="mb-2 text-sm font-bold text-cyan-300">
                            Coursework library
                        </p>
                        <h1 className="text-5xl font-black tracking-tight">
                            Manage your projects.
                        </h1>
                        <p className="mt-4 max-w-2xl text-slate-300">
                            Create coursework projects from common IB and A-Level templates.
                            Later, this page will connect to real saved user data.
                        </p>
                    </div>

                    <button className="rounded-2xl bg-cyan-400 px-6 py-4 font-bold text-slate-950 transition hover:bg-cyan-300">
                        New Project
                    </button>
                </div>

                <div className="grid gap-6 md:grid-cols-3">
                    {projectTemplates.map((template) => (
                        <div
                            key={template.id}
                            className="rounded-3xl border border-slate-800 bg-slate-900 p-6 transition hover:border-cyan-400/60"
                        >
                            <p className="mb-4 text-sm text-slate-400">Template</p>
                            <h2 className="mb-4 text-2xl font-bold">{template.name}</h2>
                            <p className="mb-6 text-sm leading-6 text-slate-300">
                                {template.description}
                            </p>
                            <button className="rounded-xl border border-slate-700 px-4 py-3 text-sm font-bold hover:border-cyan-400 hover:text-cyan-300">
                                Use template
                            </button>
                        </div>
                    ))}
                </div>
            </section>
        </main>
    );
}