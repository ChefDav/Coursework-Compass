import RiskBadge from "@/components/RiskBadge";
import type { Task } from "@/types/coursework";

type TaskCardProps = {
    task: Task;
};

export default function TaskCard({ task }: TaskCardProps) {
    return (
        <div className="rounded-3xl border border-slate-800 bg-slate-900 p-6">
            <div className="mb-4 flex items-start justify-between gap-4">
                <div>
                    <h2 className="text-xl font-bold">{task.title}</h2>
                    <p className="mt-1 text-sm text-slate-400">{task.project}</p>
                </div>

                <RiskBadge level={task.priority} />
            </div>

            <div className="flex flex-col gap-3 text-sm text-slate-300 sm:flex-row sm:items-center sm:justify-between">
                <div className="space-y-1">
                    <p>Estimated time: {task.time}</p>
                    <p>Due date: {task.dueDate}</p>
                </div>

                <button className="rounded-xl bg-cyan-400 px-4 py-2 font-bold text-slate-950 hover:bg-cyan-300">
                    Mark done
                </button>
            </div>
        </div>
    );
}