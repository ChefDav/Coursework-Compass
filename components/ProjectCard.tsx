import ProgressBar from "@/components/ProgressBar";
import RiskBadge from "@/components/RiskBadge";
import type { Project } from "@/types/coursework";

type ProjectCardProps = {
    project: Project;
    detailsHref?: string;
};

export default function ProjectCard({ project, detailsHref }: ProjectCardProps) {
    const isCompleted = project.status === "Completed";

    return (
        <div className="rounded-3xl border border-slate-800 bg-slate-900 p-6">
            <div className="mb-4 flex flex-col justify-between gap-4 md:flex-row md:items-center">
                <div>
                    <div className="mb-2 flex flex-wrap items-center gap-3">
                        <h2 className="text-2xl font-bold">{project.title}</h2>

                        {isCompleted ? (
                            <span className="rounded-full bg-emerald-400/10 px-3 py-1 text-xs font-bold text-emerald-300">
                Completed
              </span>
                        ) : null}
                    </div>

                    <p className="text-sm text-slate-400">{project.type}</p>
                </div>

                <RiskBadge level={project.risk} label={`${project.risk} Risk`} />
            </div>

            <div className="mb-3 flex justify-between text-sm text-slate-300">
                <span>{project.progress}% complete</span>
                <span>{project.daysLeft} days left</span>
            </div>

            <ProgressBar value={project.progress} />

            {detailsHref ? (
                <div className="mt-5">
                    <a
                        href={detailsHref}
                        className="inline-block rounded-xl border border-slate-700 px-4 py-3 text-sm font-bold hover:border-cyan-400 hover:text-cyan-300"
                    >
                        View details
                    </a>
                </div>
            ) : null}
        </div>
    );
}