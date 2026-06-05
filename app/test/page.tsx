import AppNav from "@/components/AppNav";
import FeedbackPanel from "@/components/FeedbackPanel";

const testingRoute = [
    {
        step: "01",
        title: "Create a coursework project",
        description:
            "Start by creating a project from a template. You can use a real coursework project or a sample one.",
        href: "/projects/new",
        action: "Create a project",
    },
    {
        step: "02",
        title: "Try the planner controls",
        description:
            "Add a custom task, edit a task, delete a task, mark a task done, and restore it back to todo.",
        href: "/today",
        action: "Check Today",
    },
    {
        step: "03",
        title: "Send short feedback",
        description:
            "Tell me what worked, what confused you, what felt missing, and whether you would use this for real coursework.",
        href: "#feedback",
        action: "Send feedback",
    },
];

const sampleProjects = [
    {
        name: "Sample Biology IA",
        template: "Biology IA",
        deadline: "Choose any date 3 to 4 weeks from today",
        intensity: "Balanced",
    },
    {
        name: "Sample Math IA",
        template: "Math IA",
        deadline: "Choose any date around one month from today",
        intensity: "Balanced",
    },
    {
        name: "Sample Extended Essay",
        template: "Extended Essay",
        deadline: "Choose any date 6 to 8 weeks from today",
        intensity: "Light or Balanced",
    },
    {
        name: "Sample TOK Essay",
        template: "TOK Essay",
        deadline: "Choose any date 2 to 4 weeks from today",
        intensity: "Balanced",
    },
];

const feedbackQuestions = [
    "Was the website easy to understand?",
    "Would you use this for real coursework?",
    "Which feature felt most useful?",
    "Which part felt confusing or unnecessary?",
    "Which subject template should be improved or added?",
    "What would make you return to the website again?",
];

export default function StudentTestingPage() {
    return (
        <main className="min-h-screen bg-slate-950 text-white">
            <section className="mx-auto max-w-6xl px-4 py-6 sm:px-6 sm:py-8">
                <AppNav />

                <section className="py-12 sm:py-16">
                    <div className="mb-6 inline-flex rounded-full border border-emerald-400/30 bg-emerald-400/10 px-4 py-2 text-xs font-black uppercase tracking-[0.2em] text-emerald-300">
                        Student testing page
                    </div>

                    <h1 className="max-w-4xl text-5xl font-black tracking-tight sm:text-6xl">
                        Test Coursework Compass in 5 minutes.
                    </h1>

                    <p className="mt-6 max-w-3xl text-base leading-8 text-slate-300 sm:text-lg">
                        This page is designed for student testing. Follow the route below,
                        try the core features, and send short honest feedback. You do not
                        need to write a long report. One useful sentence is enough.
                    </p>

                    <div className="mt-8 flex flex-col gap-4 sm:flex-row">
                        <a
                            href="/projects/new"
                            className="rounded-2xl bg-emerald-400 px-6 py-4 text-center font-bold text-slate-950 transition hover:bg-emerald-300"
                        >
                            Start testing
                        </a>

                        <a
                            href="/updates"
                            className="rounded-2xl border border-slate-700 px-6 py-4 text-center font-bold text-white transition hover:border-slate-400"
                        >
                            View release notes
                        </a>
                    </div>
                </section>

                <section className="rounded-[2rem] border border-cyan-400/30 bg-cyan-400/10 p-5 sm:p-8">
                    <p className="mb-2 text-sm font-bold text-cyan-300">
                        What is this website?
                    </p>
                    <h2 className="text-3xl font-black sm:text-4xl">
                        A coursework planning tool for IB and A-Level students.
                    </h2>
                    <p className="mt-4 max-w-3xl text-sm leading-6 text-slate-300">
                        Coursework Compass helps students turn big coursework projects into
                        clear tasks, deadlines, progress, and daily actions. The current
                        version is v1.1.2, prepared specifically for student testing before
                        the next major polish cycle.
                    </p>
                </section>

                <section className="mt-10">
                    <div className="mb-6">
                        <p className="mb-2 text-sm font-bold text-emerald-300">
                            Testing route
                        </p>
                        <h2 className="text-3xl font-black tracking-tight sm:text-4xl">
                            Follow these three steps.
                        </h2>
                    </div>

                    <div className="grid gap-5 md:grid-cols-3">
                        {testingRoute.map((item) => (
                            <div
                                key={item.step}
                                className="rounded-[2rem] border border-slate-800 bg-slate-900 p-5 sm:p-6"
                            >
                                <p className="mb-4 text-sm font-black text-emerald-300">
                                    {item.step}
                                </p>
                                <h3 className="mb-3 text-xl font-black text-white">
                                    {item.title}
                                </h3>
                                <p className="mb-5 text-sm leading-6 text-slate-400">
                                    {item.description}
                                </p>

                                <a
                                    href={item.href}
                                    className="inline-block rounded-2xl border border-emerald-400/30 bg-emerald-400/10 px-5 py-3 text-sm font-bold text-emerald-300 transition hover:bg-emerald-400/20"
                                >
                                    {item.action}
                                </a>
                            </div>
                        ))}
                    </div>
                </section>

                <section className="mt-10 rounded-[2rem] border border-amber-400/30 bg-amber-400/10 p-5 sm:p-8">
                    <p className="mb-2 text-sm font-bold text-amber-300">
                        Suggested sample projects
                    </p>
                    <h2 className="text-3xl font-black tracking-tight sm:text-4xl">
                        Not sure what to enter? Use one of these.
                    </h2>
                    <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-300">
                        You can use a real coursework project, but you do not have to. If
                        you only want to test the app, copy one of these sample ideas.
                    </p>

                    <div className="mt-6 grid gap-4 md:grid-cols-2">
                        {sampleProjects.map((project) => (
                            <div
                                key={project.name}
                                className="rounded-3xl border border-slate-800 bg-slate-950/70 p-5"
                            >
                                <h3 className="text-xl font-black text-white">
                                    {project.name}
                                </h3>

                                <div className="mt-4 space-y-2 text-sm leading-6 text-slate-400">
                                    <p>
                                        <span className="font-bold text-slate-200">Template:</span>{" "}
                                        {project.template}
                                    </p>
                                    <p>
                                        <span className="font-bold text-slate-200">Deadline:</span>{" "}
                                        {project.deadline}
                                    </p>
                                    <p>
                    <span className="font-bold text-slate-200">
                      Intensity:
                    </span>{" "}
                                        {project.intensity}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                <section className="mt-10 rounded-[2rem] border border-fuchsia-400/30 bg-fuchsia-400/10 p-5 sm:p-8">
                    <p className="mb-2 text-sm font-bold text-fuchsia-300">
                        What feedback should I give?
                    </p>
                    <h2 className="text-3xl font-black tracking-tight sm:text-4xl">
                        Short feedback is useful.
                    </h2>
                    <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-300">
                        You do not need to write a formal review. A short comment about one
                        confusing button, one missing feature, or one useful part is already
                        valuable.
                    </p>

                    <div className="mt-6 grid gap-4 md:grid-cols-2">
                        {feedbackQuestions.map((question) => (
                            <div
                                key={question}
                                className="rounded-3xl border border-slate-800 bg-slate-950/70 p-4"
                            >
                                <p className="text-sm font-bold leading-6 text-slate-200">
                                    {question}
                                </p>
                            </div>
                        ))}
                    </div>
                </section>

                <section id="feedback" className="mt-10">
                    <FeedbackPanel />
                </section>
            </section>
        </main>
    );
}