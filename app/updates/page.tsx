import AppNav from "@/components/AppNav";
import FeedbackPanel from "@/components/FeedbackPanel";

const currentFeatures = [
    "Create coursework projects from subject templates",
    "Generate structured task plans based on deadline and planning intensity",
    "Track projects through Dashboard, Projects, Today, and Project Details",
    "Mark tasks as done and restore them back to todo",
    "Add custom tasks for real coursework needs",
    "Edit task title, priority, due date, and estimated time",
    "Delete tasks that no longer fit the project",
    "Use calendar picker for project deadlines and task due dates",
    "Automatically normalise estimated time, such as 60 min to 1 hour",
    "Archive completed tasks and restore them when new work is added",
    "Use draggable, collapsible world clock widget",
    "Send structured beta feedback",
];

const recentUpdates = [
    {
        version: "v1.1 Beta",
        title: "Editable Planner",
        description:
            "Coursework Compass now supports adding, editing, deleting, completing, restoring, and archiving tasks. This makes the app usable as a real planning workspace, not just a task generator.",
    },
    {
        version: "v1.0.x",
        title: "Student testing polish",
        description:
            "Added more templates, custom dropdown UI, calendar date picker, IB exam countdown, movable world clock, testing guide, beta notice, and structured feedback panel.",
    },
    {
        version: "v1.0",
        title: "Public MVP",
        description:
            "The first public version allowed students to create coursework plans, save them locally, track progress, and use Dashboard, Today, Projects, and Project Details.",
    },
];

const currentLimitations = [
    "Project data is currently stored locally in the browser.",
    "There is no account system yet.",
    "Cloud sync across devices is planned for a later version.",
    "Feedback is currently collected through email templates.",
    "AI-generated adaptive planning is not included yet.",
];

const nextSteps = [
    "Run full v1.1 testing with real students",
    "Improve mobile layout based on feedback",
    "Add more subject-specific templates",
    "Prepare Chinese language support",
    "Add theme switching between dark and light mode",
    "Design the future cloud account version",
];

export default function UpdatesPage() {
    return (
        <main className="min-h-screen bg-slate-950 text-white">
            <section className="mx-auto max-w-6xl px-4 py-6 sm:px-6 sm:py-8">
                <AppNav />

                <section className="py-12 sm:py-16">
                    <div className="mb-6 inline-flex rounded-full border border-cyan-400/30 bg-cyan-400/10 px-4 py-2 text-xs font-black uppercase tracking-[0.2em] text-cyan-300">
                        Release notes
                    </div>

                    <h1 className="max-w-4xl text-5xl font-black tracking-tight sm:text-6xl">
                        Coursework Compass v1.1 Beta is now in testing.
                    </h1>

                    <p className="mt-6 max-w-3xl text-base leading-8 text-slate-300 sm:text-lg">
                        This page explains what the current beta can do, what has recently
                        changed, what is still limited, and what will come next. Coursework
                        Compass is being shaped through real student feedback.
                    </p>

                    <div className="mt-8 flex flex-col gap-4 sm:flex-row">
                        <a
                            href="/projects/new"
                            className="rounded-2xl bg-cyan-400 px-6 py-4 text-center font-bold text-slate-950 transition hover:bg-cyan-300"
                        >
                            Create a project
                        </a>

                        <a
                            href="/"
                            className="rounded-2xl border border-slate-700 px-6 py-4 text-center font-bold text-white transition hover:border-slate-400"
                        >
                            Back to home
                        </a>
                    </div>
                </section>

                <section className="rounded-[2rem] border border-cyan-400/30 bg-cyan-400/10 p-5 sm:p-8">
                    <p className="mb-2 text-sm font-bold text-cyan-300">
                        Current version
                    </p>
                    <h2 className="text-3xl font-black sm:text-4xl">
                        v1.1 Beta: Editable Planner
                    </h2>
                    <p className="mt-4 max-w-3xl text-sm leading-6 text-slate-300">
                        The main goal of v1.1 is to make plans maintainable after they are
                        generated. Students can now add their own tasks, edit existing
                        tasks, delete irrelevant tasks, and keep the plan aligned with real
                        coursework changes.
                    </p>
                </section>

                <section className="mt-10">
                    <div className="mb-6">
                        <p className="mb-2 text-sm font-bold text-cyan-300">
                            What works now
                        </p>
                        <h2 className="text-3xl font-black tracking-tight sm:text-4xl">
                            Current beta features.
                        </h2>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                        {currentFeatures.map((feature) => (
                            <div
                                key={feature}
                                className="rounded-3xl border border-slate-800 bg-slate-900 p-5"
                            >
                                <p className="text-sm font-bold leading-6 text-slate-200">
                                    {feature}
                                </p>
                            </div>
                        ))}
                    </div>
                </section>

                <section className="mt-16">
                    <div className="mb-6">
                        <p className="mb-2 text-sm font-bold text-cyan-300">
                            Version history
                        </p>
                        <h2 className="text-3xl font-black tracking-tight sm:text-4xl">
                            How the product has evolved.
                        </h2>
                    </div>

                    <div className="space-y-5">
                        {recentUpdates.map((update) => (
                            <div
                                key={update.version}
                                className="rounded-[2rem] border border-slate-800 bg-slate-900 p-5 sm:p-6"
                            >
                                <div className="mb-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                                    <div>
                                        <p className="mb-1 text-sm font-black text-cyan-300">
                                            {update.version}
                                        </p>
                                        <h3 className="text-2xl font-black">{update.title}</h3>
                                    </div>

                                    <span className="w-fit rounded-full border border-cyan-400/30 bg-cyan-400/10 px-4 py-2 text-xs font-black uppercase tracking-[0.2em] text-cyan-300">
                    Released
                  </span>
                                </div>

                                <p className="max-w-4xl text-sm leading-6 text-slate-300">
                                    {update.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </section>

                <section className="mt-16 grid gap-6 md:grid-cols-2">
                    <div className="rounded-[2rem] border border-amber-400/30 bg-amber-400/10 p-5 sm:p-6">
                        <p className="mb-2 text-sm font-bold text-amber-300">
                            Current limitations
                        </p>
                        <h2 className="text-2xl font-black sm:text-3xl">
                            What this beta does not do yet.
                        </h2>

                        <div className="mt-5 space-y-3">
                            {currentLimitations.map((item) => (
                                <div
                                    key={item}
                                    className="rounded-2xl border border-slate-800 bg-slate-950/60 p-4"
                                >
                                    <p className="text-sm leading-6 text-slate-300">{item}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="rounded-[2rem] border border-emerald-400/30 bg-emerald-400/10 p-5 sm:p-6">
                        <p className="mb-2 text-sm font-bold text-emerald-300">
                            Coming next
                        </p>
                        <h2 className="text-2xl font-black sm:text-3xl">
                            What will be improved after testing.
                        </h2>

                        <div className="mt-5 space-y-3">
                            {nextSteps.map((item) => (
                                <div
                                    key={item}
                                    className="rounded-2xl border border-slate-800 bg-slate-950/60 p-4"
                                >
                                    <p className="text-sm leading-6 text-slate-300">{item}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                <section className="mt-16">
                    <FeedbackPanel />
                </section>
            </section>
        </main>
    );
}