import AppNav from "@/components/AppNav";
import TemplateCard from "@/components/TemplateCard";
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

                    <a
                        href="/projects/new"
                        className="rounded-2xl bg-cyan-400 px-6 py-4 text-center font-bold text-slate-950 transition hover:bg-cyan-300"
                    >
                        New Project
                    </a>
                </div>

                <div className="grid gap-6 md:grid-cols-3">
                    {projectTemplates.map((template) => (
                        <TemplateCard key={template.id} template={template} />
                    ))}
                </div>
            </section>
        </main>
    );
}