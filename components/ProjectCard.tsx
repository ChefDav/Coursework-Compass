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
        <div className="cc-card cc-interactive-card cc-motion-fade-up rounded-[1.5rem] p-5 sm:p-6">
            <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div className="min-w-0">
                    <div className="mb-2 flex flex-wrap items-center gap-3">
                        <h2 className="cc-card-title break-words">
                            {project.title}
                        </h2>

                        {isCompleted ? (
                            <span className="cc-badge-success">
                Completed
              </span>
                        ) : null}
                    </div>

                    <p className="cc-helper-text break-words">{project.type}</p>
                </div>

                <div className="shrink-0">
                    <RiskBadge level={project.risk} label={`${project.risk} Risk`} />
                </div>
            </div>

            <div className="cc-text-muted mb-3 flex flex-col gap-1 text-sm sm:flex-row sm:justify-between">
                <span>{project.progress}% complete</span>
                <span>{project.daysLeft} days left</span>
            </div>

            <ProgressBar value={project.progress} />

            {detailsHref ? (
                <div className="mt-5">
                    <Link
                        href={detailsHref}
                        className="cc-button-secondary rounded-2xl px-4 py-3 text-center text-sm sm:inline-flex"
                    >
                        View details
                    </Link>
                </div>
            ) : null}
        </div>
    );
}
