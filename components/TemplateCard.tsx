import type { ProjectTemplate } from "@/types/coursework";

type TemplateCardProps = {
    template: ProjectTemplate;
};

export default function TemplateCard({ template }: TemplateCardProps) {
    return (
        <div className="rounded-3xl border border-slate-800 bg-slate-900 p-5 transition hover:border-cyan-400/60 sm:p-6">
            <p className="mb-4 text-sm text-slate-400">Template</p>

            <h2 className="mb-4 break-words text-2xl font-bold leading-tight">
                {template.name}
            </h2>

            <p className="mb-6 text-sm leading-6 text-slate-300">
                {template.description}
            </p>

            <a
                href={`/projects/new?template=${template.id}`}
                className="block rounded-xl border border-slate-700 px-4 py-3 text-center text-sm font-bold transition hover:border-cyan-400 hover:text-cyan-300 sm:inline-block"
            >
                Use template
            </a>
        </div>
    );
}