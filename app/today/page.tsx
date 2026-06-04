import AppNav from "@/components/AppNav";
import TaskCard from "@/components/TaskCard";
import { tasks } from "@/lib/mockData";

export default function TodayPage() {
    return (
        <main className="min-h-screen bg-slate-950 text-white">
            <section className="mx-auto max-w-6xl px-6 py-8">
                <AppNav />

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
                            <TaskCard key={task.title} task={task} />
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