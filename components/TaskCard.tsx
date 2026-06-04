import RiskBadge from "@/components/RiskBadge";
import type { Task, TaskStatus } from "@/types/coursework";

type TaskCardProps = {
    task: Task;
    onChangeStatus?: (taskId: string, nextStatus: TaskStatus) => void;
};

export default function TaskCard({ task, onChangeStatus }: TaskCardProps) {
    const isDone = task.status === "Done";
    const nextStatus: TaskStatus = isDone ? "Todo" : "Done";

    return (
        <div
            className={`rounded-3xl border p-5 sm:p-6 ${
                isDone
                    ? "border-emerald-400/30 bg-emerald-400/10"
                    : "border-slate-800 bg-slate-900"
            }`}
        >
            <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div className="min-w-0">
                    <h2
                        className={`break-words text-xl font-bold leading-tight ${
                            isDone ? "text-emerald-200 line-through" : "text-white"
                        }`}
                    >
                        {task.title}
                    </h2>
                    <p className="mt-1 break-words text-sm text-slate-400">
                        {task.project}
                    </p>
                </div>

                <div className="shrink-0">
                    {isDone ? (
                        <span className="rounded-full bg-emerald-400/10 px-4 py-2 text-sm font-bold text-emerald-300">
              Done
            </span>
                    ) : (
                        <RiskBadge level={task.priority} />
                    )}
                </div>
            </div>

            <div className="flex flex-col gap-4 text-sm text-slate-300 sm:flex-row sm:items-end sm:justify-between">
                <div className="space-y-1">
                    <p>Estimated time: {task.time}</p>
                    <p>Due date: {task.dueDate || "Not scheduled"}</p>
                </div>

                <button
                    type="button"
                    onClick={() => onChangeStatus?.(task.id, nextStatus)}
                    className={`w-full rounded-xl px-4 py-3 font-bold transition sm:w-auto ${
                        isDone
                            ? "border border-emerald-400/30 bg-emerald-400/10 text-emerald-200 hover:bg-emerald-400/20"
                            : "bg-cyan-400 text-slate-950 hover:bg-cyan-300"
                    }`}
                >
                    {isDone ? "Mark as todo" : "Mark done"}
                </button>
            </div>
        </div>
    );
}