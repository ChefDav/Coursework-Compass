import Link from "next/link";
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
        <div className="rounded-3xl border border-slate-800 bg-slate-900 p-5 sm:p-6">
            <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div className="min-w-0">
                    <div className="mb-2 flex flex-wrap items-center gap-3">
                        <h2 className="break-words text-2xl font-bold leading-tight">
                            {project.title}
                        </h2>

                        {isCompleted ? (
                            <span className="rounded-full bg-emerald-400/10 px-3 py-1 text-xs font-bold text-emerald-300">
                Completed
              </span>
                        ) : null}
                    </div>

                    <p className="break-words text-sm text-slate-400">{project.type}</p>
                </div>

                <div className="shrink-0">
                    <RiskBadge level={project.risk} label={`${project.risk} Risk`} />
                </div>
            </div>

            <div className="mb-3 flex flex-col gap-1 text-sm text-slate-300 sm:flex-row sm:justify-between">
                <span>{project.progress}% complete</span>
                <span>{project.daysLeft} days left</span>
            </div>

            <ProgressBar value={project.progress} />

            {detailsHref ? (
                <div className="mt-5">
                    <Link
                        href={detailsHref}
                        className="block rounded-xl border border-slate-700 px-4 py-3 text-center text-sm font-bold transition hover:border-cyan-400 hover:text-cyan-300 sm:inline-block"
                    >
                        View details
                    </Link>
                </div>
            ) : null}
        </div>
    );
}
