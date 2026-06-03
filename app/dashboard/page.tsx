import AppNav from "@/components/AppNav";
const projects = [
    {
        title: "Math IA",
        type: "Internal Assessment",
        progress: 68,
        daysLeft: 23,
        risk: "Medium",
    },
    {
        title: "Computer Science IA",
        type: "Coursework Project",
        progress: 42,
        daysLeft: 37,
        risk: "Low",
    },
    {
        title: "TOK Essay",
        type: "Essay",
        progress: 21,
        daysLeft: 14,
        risk: "High",
    },
];

export default function DashboardPage() {
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
                        <p className="mt-2 text-4xl font-black">3</p>
                    </div>

                    <div className="rounded-3xl border border-slate-800 bg-slate-900 p-6">
                        <p className="text-sm text-slate-400">Tasks due today</p>
                        <p className="mt-2 text-4xl font-black">4</p>
                    </div>

                    <div className="rounded-3xl border border-red-400/30 bg-red-400/10 p-6">
                        <p className="text-sm text-red-200">High risk items</p>
                        <p className="mt-2 text-4xl font-black text-red-200">1</p>
                    </div>
                </div>

                <div className="grid gap-6">
                    {projects.map((project) => (
                        <div
                            key={project.title}
                            className="rounded-3xl border border-slate-800 bg-slate-900 p-6"
                        >
                            <div className="mb-4 flex flex-col justify-between gap-4 md:flex-row md:items-center">
                                <div>
                                    <h2 className="text-2xl font-bold">{project.title}</h2>
                                    <p className="text-sm text-slate-400">{project.type}</p>
                                </div>

                                <span
                                    className={`rounded-full px-4 py-2 text-sm font-bold ${
                                        project.risk === "High"
                                            ? "bg-red-400/10 text-red-300"
                                            : project.risk === "Medium"
                                                ? "bg-amber-400/10 text-amber-300"
                                                : "bg-emerald-400/10 text-emerald-300"
                                    }`}
                                >
                  {project.risk} Risk
                </span>
                            </div>

                            <div className="mb-3 flex justify-between text-sm text-slate-300">
                                <span>{project.progress}% complete</span>
                                <span>{project.daysLeft} days left</span>
                            </div>

                            <div className="h-3 rounded-full bg-slate-800">
                                <div
                                    className="h-3 rounded-full bg-cyan-400"
                                    style={{ width: `${project.progress}%` }}
                                />
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        </main>
    );
}