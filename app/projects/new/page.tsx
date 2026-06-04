import AppNav from "@/components/AppNav";
import { projectTemplates } from "@/lib/mockData";

export default function NewProjectPage() {
    return (
        <main className="min-h-screen bg-slate-950 text-white">
            <section className="mx-auto max-w-4xl px-6 py-8">
                <AppNav />

                <div className="mb-10">
                    <p className="mb-2 text-sm font-bold text-cyan-300">
                        New coursework project
                    </p>
                    <h1 className="text-5xl font-black tracking-tight">
                        Create a new project.
                    </h1>
                    <p className="mt-4 max-w-2xl text-slate-300">
                        Set up your coursework goal, deadline, and planning style. In the
                        next missions, this form will generate a real task plan.
                    </p>
                </div>

                <div className="rounded-3xl border border-slate-800 bg-slate-900 p-6">
                    <form className="space-y-6">
                        <div>
                            <label
                                htmlFor="project-title"
                                className="mb-2 block text-sm font-bold text-slate-200"
                            >
                                Project name
                            </label>
                            <input
                                id="project-title"
                                name="project-title"
                                type="text"
                                placeholder="e.g. Math IA Exploration"
                                className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-4 text-white outline-none transition placeholder:text-slate-500 focus:border-cyan-400"
                            />
                        </div>

                        <div>
                            <label
                                htmlFor="project-template"
                                className="mb-2 block text-sm font-bold text-slate-200"
                            >
                                Project type
                            </label>
                            <select
                                id="project-template"
                                name="project-template"
                                className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-4 text-white outline-none transition focus:border-cyan-400"
                                defaultValue=""
                            >
                                <option value="" disabled>
                                    Choose a template
                                </option>
                                {projectTemplates.map((template) => (
                                    <option key={template.id} value={template.id}>
                                        {template.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label
                                htmlFor="deadline"
                                className="mb-2 block text-sm font-bold text-slate-200"
                            >
                                Deadline
                            </label>
                            <input
                                id="deadline"
                                name="deadline"
                                type="date"
                                className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-4 text-white outline-none transition focus:border-cyan-400"
                            />
                        </div>

                        <div>
                            <label
                                htmlFor="intensity"
                                className="mb-2 block text-sm font-bold text-slate-200"
                            >
                                Planning intensity
                            </label>
                            <select
                                id="intensity"
                                name="intensity"
                                className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-4 text-white outline-none transition focus:border-cyan-400"
                                defaultValue="balanced"
                            >
                                <option value="light">Light: fewer tasks per week</option>
                                <option value="balanced">Balanced: steady daily progress</option>
                                <option value="intense">Intense: faster deadline attack</option>
                            </select>
                        </div>

                        <div className="rounded-2xl border border-cyan-400/30 bg-cyan-400/10 p-5">
                            <p className="mb-2 text-sm font-bold text-cyan-300">
                                Coming next
                            </p>
                            <p className="text-sm leading-6 text-slate-300">
                                Soon, clicking Create Project will build a real coursework plan
                                from your template and deadline. For now, this page establishes
                                the V1 creation flow.
                            </p>
                        </div>

                        <div className="flex flex-col gap-4 sm:flex-row">
                            <button
                                type="button"
                                className="rounded-2xl bg-cyan-400 px-6 py-4 font-bold text-slate-950 transition hover:bg-cyan-300"
                            >
                                Create Project
                            </button>

                            <a
                                href="/projects"
                                className="rounded-2xl border border-slate-700 px-6 py-4 text-center font-bold text-white transition hover:border-slate-400"
                            >
                                Back to Projects
                            </a>
                        </div>
                    </form>
                </div>
            </section>
        </main>
    );
}