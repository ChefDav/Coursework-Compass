import RiskBadge from "@/components/RiskBadge";
import type { Task } from "@/types/coursework";

type TaskCardProps = {
    task: Task;
    onMarkDone?: (taskId: string) => void;
};

export default function TaskCard({ task, onMarkDone }: TaskCardProps) {
    const isDone = task.status === "Done";

    return (
        <div
            className={`rounded-3xl border p-6 ${
                isDone
                    ? "border-emerald-400/30 bg-emerald-400/10"
                    : "border-slate-800 bg-slate-900"
            }`}
        >
            <div className="mb-4 flex items-start justify-between gap-4">
                <div>
                    <h2
                        className={`text-xl font-bold ${
                            isDone ? "text-emerald-200 line-through" : "text-white"
                        }`}
                    >
                        {task.title}
                    </h2>
                    <p className="mt-1 text-sm text-slate-400">{task.project}</p>
                </div>

                {isDone ? (
                    <span className="rounded-full bg-emerald-400/10 px-4 py-2 text-sm font-bold text-emerald-300">
            Done
          </span>
                ) : (
                    <RiskBadge level={task.priority} />
                )}
            </div>

            <div className="flex flex-col gap-3 text-sm text-slate-300 sm:flex-row sm:items-center sm:justify-between">
                <div className="space-y-1">
                    <p>Estimated time: {task.time}</p>
                    <p>Due date: {task.dueDate}</p>
                </div>

                <button
                    type="button"
                    onClick={() => onMarkDone?.(task.id)}
                    disabled={isDone}
                    className={`rounded-xl px-4 py-2 font-bold ${
                        isDone
                            ? "cursor-not-allowed bg-emerald-400/20 text-emerald-200"
                            : "bg-cyan-400 text-slate-950 hover:bg-cyan-300"
                    }`}
                >
                    {isDone ? "Done" : "Mark done"}
                </button>
            </div>
        </div>
    );
}