import ProgressBar from "@/components/ProgressBar";
import RiskBadge from "@/components/RiskBadge";
import type { Project } from "@/types/coursework";

type ProjectCardProps = {
    project: Project;
};

export default function ProjectCard({ project }: ProjectCardProps) {
    return (
        <div className="rounded-3xl border border-slate-800 bg-slate-900 p-6">
            <div className="mb-4 flex flex-col justify-between gap-4 md:flex-row md:items-center">
                <div>
                    <h2 className="text-2xl font-bold">{project.title}</h2>
                    <p className="text-sm text-slate-400">{project.type}</p>
                </div>

                <RiskBadge level={project.risk} label={`${project.risk} Risk`} />
            </div>

            <div className="mb-3 flex justify-between text-sm text-slate-300">
                <span>{project.progress}% complete</span>
                <span>{project.daysLeft} days left</span>
            </div>

            <ProgressBar value={project.progress} />
        </div>
    );
}