import AppNav from "@/components/AppNav";
import ProjectCard from "@/components/ProjectCard";
import { projects } from "@/lib/mockData";

export default function DashboardPage() {
    const highRiskProjectCount = projects.filter(
        (project) => project.risk === "High",
    ).length;

    return (
        <main className="min-h-screen bg-slate-950 text-white">
            <section className="mx-auto max-w-6xl px-6 py-8">
                <AppNav />

                <div className="mb-10">
                    <p className="mb-2 text-sm font-bold text-cyan-300">
                        Student command center
                    </p>
                    <h1 className="text-5xl font-black tracking-tight">
                        Your coursework dashboard.
                    </h1>
                    <p className="mt-4 max-w-2xl text-slate-300">
                        Track every major assignment, spot risky deadlines, and decide what
                        deserves your attention today.
                    </p>
                </div>

                <div className="mb-10 grid gap-6 md:grid-cols-3">
                    <div className="rounded-3xl border border-slate-800 bg-slate-900 p-6">
                        <p className="text-sm text-slate-400">Active projects</p>
                        <p className="mt-2 text-4xl font-black">{projects.length}</p>
                    </div>

                    <div className="rounded-3xl border border-slate-800 bg-slate-900 p-6">
                        <p className="text-sm text-slate-400">Tasks due today</p>
                        <p className="mt-2 text-4xl font-black">4</p>
                    </div>

                    <div className="rounded-3xl border border-red-400/30 bg-red-400/10 p-6">
                        <p className="text-sm text-red-200">High risk items</p>
                        <p className="mt-2 text-4xl font-black text-red-200">
                            {highRiskProjectCount}
                        </p>
                    </div>
                </div>

                <div className="grid gap-6">
                    {projects.map((project) => (
                        <ProjectCard key={project.title} project={project} />
                    ))}
                </div>
            </section>
        </main>
    );
}