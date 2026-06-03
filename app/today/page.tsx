const tasks = [
    {
        title: "Collect 3 data sources",
        project: "Math IA",
        priority: "High",
        time: "45 min",
    },
    {
        title: "Draft success criteria",
        project: "Computer Science IA",
        priority: "Medium",
        time: "30 min",
    },
    {
        title: "Annotate one TOK example",
        project: "TOK Essay",
        priority: "Medium",
        time: "25 min",
    },
    {
        title: "Review supervisor feedback",
        project: "Extended Essay",
        priority: "Low",
        time: "20 min",
    },
];

export default function TodayPage() {
    return (
        <main className="min-h-screen bg-slate-950 text-white">
            <section className="mx-auto max-w-6xl px-6 py-8">
                <nav className="mb-12 flex items-center justify-between">
                    <a href="/" className="text-xl font-bold">
                        Coursework Compass
                    </a>

                    <div className="flex gap-4 text-sm text-slate-300">
                        <a href="/dashboard" className="hover:text-white">
                            Dashboard
                        </a>
                        <a href="/projects" className="hover:text-white">
                            Projects
                        </a>
                        <a href="/today" className="text-cyan-300">
                            Today
                        </a>
                    </div>
                </nav>

                <div className="mb-10">
                    <p className="mb-2 text-sm font-bold text-cyan-300">
                        Daily execution
                    </p>
                    <h1 className="text-5xl font-black tracking-tight">
                        What should I do today?
                    </h1>
                    <p className="mt-4 max-w-2xl text-slate-300">
                        A focused list of tasks chosen from your deadlines, project risks,
                        and current progress.
                    </p>
                </div>

                <div className="grid gap-6 md:grid-cols-[2fr_1fr]">
                    <div className="space-y-4">
                        {tasks.map((task) => (
                            <div
                                key={task.title}
                                className="rounded-3xl border border-slate-800 bg-slate-900 p-6"
                            >
                                <div className="mb-4 flex items-start justify-between gap-4">
                                    <div>
                                        <h2 className="text-xl font-bold">{task.title}</h2>
                                        <p className="mt-1 text-sm text-slate-400">
                                            {task.project}
                                        </p>
                                    </div>

                                    <span
                                        className={`rounded-full px-4 py-2 text-sm font-bold ${
                                            task.priority === "High"
                                                ? "bg-red-400/10 text-red-300"
                                                : task.priority === "Medium"
                                                    ? "bg-amber-400/10 text-amber-300"
                                                    : "bg-emerald-400/10 text-emerald-300"
                                        }`}
                                    >
                    {task.priority}
                  </span>
                                </div>

                                <div className="flex items-center justify-between text-sm text-slate-300">
                                    <span>Estimated time: {task.time}</span>
                                    <button className="rounded-xl bg-cyan-400 px-4 py-2 font-bold text-slate-950 hover:bg-cyan-300">
                                        Mark done
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    <aside className="rounded-3xl border border-cyan-400/30 bg-cyan-400/10 p-6">
                        <p className="mb-2 text-sm font-bold text-cyan-300">
                            Today&apos;s strategy
                        </p>
                        <h2 className="mb-4 text-2xl font-black">
                            Attack the highest-risk project first.
                        </h2>
                        <p className="text-sm leading-6 text-slate-300">
                            Your Math IA has the closest deadline and the most unfinished
                            work. Finish the research source task before moving to lighter
                            review tasks.
                        </p>
                    </aside>
                </div>
            </section>
        </main>
    );
}