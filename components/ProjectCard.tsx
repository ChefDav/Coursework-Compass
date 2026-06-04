import type { RiskLevel } from "@/lib/mockData";

type Project = {
    title: string;
    type: string;
    progress: number;
    daysLeft: number;
    risk: RiskLevel;
};

type ProjectCardProps = {
    project: Project;
};

function getRiskStyle(risk: RiskLevel) {
    if (risk === "High") {
        return "bg-red-400/10 text-red-300";
    }

    if (risk === "Medium") {
        return "bg-amber-400/10 text-amber-300";
    }

    return "bg-emerald-400/10 text-emerald-300";
}

export default function ProjectCard({ project }: ProjectCardProps) {
    return (
        <div className="rounded-3xl border border-slate-800 bg-slate-900 p-6">
            <div className="mb-4 flex flex-col justify-between gap-4 md:flex-row md:items-center">
                <div>
                    <h2 className="text-2xl font-bold">{project.title}</h2>
                    <p className="text-sm text-slate-400">{project.type}</p>
                </div>

                <span
                    className={`rounded-full px-4 py-2 text-sm font-bold ${getRiskStyle(
                        project.risk,
                    )}`}
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
    );
}