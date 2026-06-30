import Link from "next/link";
import type { ProjectTemplate } from "@/types/coursework";

type TemplateCardProps = {
    template: ProjectTemplate;
};

export default function TemplateCard({ template }: TemplateCardProps) {
    return (
        <div className="cc-card cc-interactive-card rounded-[1.5rem] p-5 sm:p-6">
            <p className="cc-kicker mb-4">Template</p>

            <h2 className="cc-card-title mb-4 break-words">
                {template.name}
            </h2>

            <p className="cc-body-text mb-6">
                {template.description}
            </p>

            <Link
                href={`/projects/new?template=${template.id}`}
                className="cc-button-secondary rounded-2xl px-4 py-3 text-center text-sm"
            >
                Use template
            </Link>
        </div>
    );
}
