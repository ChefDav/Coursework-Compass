import type { PriorityLevel } from "@/lib/mockData";

type Task = {
    title: string;
    project: string;
    priority: PriorityLevel;
    time: string;
};

type TaskCardProps = {
    task: Task;
};

function getPriorityStyle(priority: PriorityLevel) {
    if (priority === "High") {
        return "bg-red-400/10 text-red-300";
    }

    if (priority === "Medium") {
        return "bg-amber-400/10 text-amber-300";
    }

    return "bg-emerald-400/10 text-emerald-300";
}

export default function TaskCard({ task }: TaskCardProps) {
    return (
        <div className="rounded-3xl border border-slate-800 bg-slate-900 p-6">
            <div className="mb-4 flex items-start justify-between gap-4">
                <div>
                    <h2 className="text-xl font-bold">{task.title}</h2>
                    <p className="mt-1 text-sm text-slate-400">{task.project}</p>
                </div>

                <span
                    className={`rounded-full px-4 py-2 text-sm font-bold ${getPriorityStyle(
                        task.priority,
                    )}`}
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
    );
}