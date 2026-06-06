import AppNav from "@/components/AppNav";
import FeedbackPanel from "@/components/FeedbackPanel";

const currentFeatures = [
    "Create coursework projects from subject templates",
    "Generate structured task plans based on deadline and planning intensity",
    "Track projects through Dashboard, Projects, Today, and Project Details",
    "Mark tasks as done and restore them back to todo",
    "Add custom tasks for real coursework needs",
    "Edit task title, priority, due date, and estimated time",
    "Delete individual tasks and whole projects safely",
    "Use calendar picker for project deadlines and task due dates",
    "Automatically normalise estimated time, such as 60 min to 1 hour",
    "Show days left and overdue status for project and task deadlines",
    "Archive completed tasks and restore archived tasks when new work is added",
    "Use clearer save success messages after project and task changes",
    "See clearer empty states on Dashboard, Projects, and Today",
    "Read clearer browser-only local storage notices across the product",
    "Use a mobile-friendly navigation menu and improved mobile layout foundation",
    "Use the draggable, collapsible world clock widget",
    "Use the isolated guided tutorial sandbox for student testing",
    "See the v1.2 onboarding popup on first visit",
    "See unified inline error messages for missing project and task titles",
    "Send structured student testing feedback",
];

const whatToTest = [
    "Open the website and read the v1.2 onboarding popup",
    "Check the browser-only local storage notice",
    "Open the guided tutorial from the homepage",
    "Choose a sample project inside the tutorial",
    "Complete the hands-on simulated planner actions",
    "Watch the feedback loading screen reach 100%",
    "Return to the main menu from the completion screen",
    "Create a real project from the normal product flow",
    "Open Dashboard, Projects, Today, and Project Details",
    "Add a custom task inside Project Details",
    "Edit task title, priority, due date, and estimated time",
    "Try estimated time conversion, such as 60 min to 1 hour",
    "Mark a task as done and restore it back to todo",
    "Delete a task and delete a project",
    "Check that days left appears correctly in Today and Project Details",
    "Clear browser data or use Reset data to check empty states",
];

const mobileChecklist = [
    "Open the website on a phone or small screen",
    "Check whether the mobile navigation menu is easy to open",
    "Check whether the onboarding popup fits the screen",
    "Check whether buttons are easy to tap",
    "Check whether project cards are readable",
    "Check whether Project Details is usable on mobile",
    "Check whether task edit controls fit properly",
    "Check whether calendar and estimated time fields are usable",
    "Check whether empty states are clear and not cramped",
    "Check whether the save success toast does not block important actions",
    "Check whether the clock widget can be minimized, hidden, and moved",
    "Report any page that feels cramped, confusing, or difficult to use",
];

const recentUpdates = [
    {
        version: "v1.2",
        title: "Student Testing Polish",
        description:
            "Completed the v1.2 student testing release. This version unified product version labels, added first-visit onboarding, improved empty states, clarified browser-only local storage, added clearer save success messages, improved mobile layout foundations, restored stable project deletion, repaired estimated time display and conversion, restored days-left indicators, fixed project detail hydration issues, unified inline error messages, and prepared the product for a more stable student testing session.",
    },
    {
        version: "v1.1.3",
        title: "Guided Test Flow + Homepage Restore",
        description:
            "Restored the homepage to a normal product entry, added a larger Join student test button, redesigned /test as an isolated tutorial sandbox, added a feedback loading screen, and added a final congratulations screen after testing.",
    },
    {
        version: "v1.1.2",
        title: "Student Testing Guide",
        description:
            "Added a dedicated /test student testing page, a three-step testing route, suggested sample projects, clearer feedback instructions, and student testing labels in feedback email subjects.",
    },
    {
        version: "v1.1.1",
        title: "Pre-Test Polish",
        description:
            "Added clearer tester guidance, short feedback prompts, a focused What to test checklist, and mobile testing guidance before the Year 12 testing session.",
    },
    {
        version: "v1.1",
        title: "Editable Planner",
        description:
            "Coursework Compass added support for adding, editing, deleting, completing, restoring, and archiving tasks. This made the app usable as a real planning workspace, not just a task generator.",
    },
    {
        version: "v1.0.x",
        title: "Student Testing Preparation",
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
    "The guided test tutorial uses simulated data and does not save real project data.",
    "Feedback is currently collected through email templates.",
    "AI-generated adaptive planning is not included yet.",
    "Students should avoid entering sensitive personal information during testing.",
];

const nextSteps = [
    "Run full v1.2 testing with real students",
    "Collect Year 12 and Year 13 feedback",
    "Use student feedback to plan v1.3",
    "Improve the feedback system after real testing",
    "Add more subject-specific templates based on student demand",
    "Prepare Chinese language support",
    "Explore theme switching after the testing release is stable",
    "Design the future cloud account version carefully",
];

const stabilityNotes = [
    "v1.2 is now in stabilisation mode.",
    "No major data-layer rewrites should be made before student testing.",
    "Future updates should be smaller, slower, and tested with a clear checklist.",
    "Testing feedback will guide v1.3 instead of adding more speculative features now.",
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
                        Coursework Compass v1.2 is ready for student testing.
                    </h1>

                    <p className="mt-6 max-w-3xl text-base leading-8 text-slate-300 sm:text-lg">
                        v1.2 is the Student Testing Polish release. It focuses on making
                        Coursework Compass clearer, safer, more stable, and easier to test
                        before real Year 12 and Year 13 feedback is collected.
                    </p>

                    <div className="mt-8 flex flex-col gap-4 sm:flex-row">
                        <a
                            href="/test"
                            className="rounded-2xl bg-emerald-400 px-6 py-4 text-center font-bold text-slate-950 transition hover:bg-emerald-300"
                        >
                            Join student test
                        </a>

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
                        v1.2: Student Testing Polish
                    </h2>
                    <p className="mt-4 max-w-3xl text-sm leading-6 text-slate-300">
                        The main goal of v1.2 is to make Coursework Compass ready for
                        student testing. This version improves onboarding, empty states,
                        local storage communication, save feedback, mobile layout,
                        estimated time handling, deadline visibility, and inline error
                        messages.
                    </p>
                </section>

                <section className="mt-10 rounded-[2rem] border border-emerald-400/30 bg-emerald-400/10 p-5 sm:p-8">
                    <p className="mb-2 text-sm font-bold text-emerald-300">
                        Guided tutorial sandbox
                    </p>
                    <h2 className="text-3xl font-black tracking-tight sm:text-4xl">
                        The test flow is separate from the real app.
                    </h2>
                    <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-300">
                        The /test page uses simulated data only. It does not open Dashboard,
                        Projects, or Today, and it does not write real project data. This
                        makes the testing route safer and clearer for students.
                    </p>

                    <div className="mt-6">
                        <a
                            href="/test"
                            className="inline-block rounded-2xl bg-emerald-400 px-6 py-4 text-center font-bold text-slate-950 transition hover:bg-emerald-300"
                        >
                            Open guided tutorial
                        </a>
                    </div>
                </section>

                <section className="mt-10 rounded-[2rem] border border-amber-400/30 bg-amber-400/10 p-5 sm:p-8">
                    <p className="mb-2 text-sm font-bold text-amber-300">
                        Data and privacy boundary
                    </p>
                    <h2 className="text-3xl font-black tracking-tight sm:text-4xl">
                        v1.2 stores projects locally in the browser.
                    </h2>
                    <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-300">
                        Coursework Compass v1.2 does not use accounts or cloud sync yet.
                        Saved projects are stored in this browser only. Students should
                        avoid sensitive personal information during testing and use sample
                        project details when possible.
                    </p>
                </section>

                <section className="mt-10 rounded-[2rem] border border-cyan-400/30 bg-cyan-400/10 p-5 sm:p-8">
                    <p className="mb-2 text-sm font-bold text-cyan-300">
                        Better empty states and errors
                    </p>
                    <h2 className="text-3xl font-black tracking-tight sm:text-4xl">
                        Empty pages and mistakes now guide the next action.
                    </h2>
                    <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-300">
                        Dashboard, Projects, Today, and Project Details now give clearer
                        guidance when data is missing. Form mistakes such as blank task
                        titles now use unified inline error messages instead of inconsistent
                        temporary warnings.
                    </p>
                </section>

                <section className="mt-10 rounded-[2rem] border border-fuchsia-400/30 bg-fuchsia-400/10 p-5 sm:p-8">
                    <p className="mb-2 text-sm font-bold text-fuchsia-300">
                        Mobile polish
                    </p>
                    <h2 className="text-3xl font-black tracking-tight sm:text-4xl">
                        v1.2 improves the mobile foundation.
                    </h2>
                    <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-300">
                        The navigation bar, onboarding popup, empty states, save success
                        toast, and clock widget have been adjusted to work more comfortably
                        on smaller screens.
                    </p>
                </section>

                <section className="mt-10 rounded-[2rem] border border-emerald-400/30 bg-emerald-400/10 p-5 sm:p-8">
                    <p className="mb-2 text-sm font-bold text-emerald-300">
                        What to test
                    </p>
                    <h2 className="text-3xl font-black tracking-tight sm:text-4xl">
                        Suggested testing flow for v1.2.
                    </h2>
                    <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-300">
                        Students can test the guided tutorial safely first, then explore the
                        real planning tools afterwards if they want to create a real
                        browser-saved project.
                    </p>

                    <div className="mt-6 grid gap-4 md:grid-cols-2">
                        {whatToTest.map((item, index) => (
                            <div
                                key={item}
                                className="rounded-3xl border border-slate-800 bg-slate-950/70 p-4"
                            >
                                <p className="mb-1 text-sm font-black text-emerald-300">
                                    {String(index + 1).padStart(2, "0")}
                                </p>
                                <p className="text-sm font-bold leading-6 text-slate-200">
                                    {item}
                                </p>
                            </div>
                        ))}
                    </div>
                </section>

                <section className="mt-10 rounded-[2rem] border border-fuchsia-400/30 bg-fuchsia-400/10 p-5 sm:p-8">
                    <p className="mb-2 text-sm font-bold text-fuchsia-300">
                        Mobile testing checklist
                    </p>
                    <h2 className="text-3xl font-black tracking-tight sm:text-4xl">
                        Please check the phone experience too.
                    </h2>
                    <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-300">
                        Many students may open Coursework Compass on a phone. If something
                        feels cramped, blocked, or difficult to tap, that feedback is very
                        valuable.
                    </p>

                    <div className="mt-6 grid gap-4 md:grid-cols-2">
                        {mobileChecklist.map((item) => (
                            <div
                                key={item}
                                className="rounded-3xl border border-slate-800 bg-slate-950/70 p-4"
                            >
                                <p className="text-sm font-bold leading-6 text-slate-200">
                                    {item}
                                </p>
                            </div>
                        ))}
                    </div>
                </section>

                <section className="mt-16">
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

                <section className="mt-16 rounded-[2rem] border border-cyan-400/30 bg-cyan-400/10 p-5 sm:p-8">
                    <p className="mb-2 text-sm font-bold text-cyan-300">
                        Stabilisation notes
                    </p>
                    <h2 className="text-3xl font-black tracking-tight sm:text-4xl">
                        v1.2 is now frozen for testing.
                    </h2>
                    <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-300">
                        After this release, the product should avoid major feature changes
                        before the student testing session. The next meaningful product
                        direction should come from real student feedback.
                    </p>

                    <div className="mt-6 grid gap-4 md:grid-cols-2">
                        {stabilityNotes.map((note) => (
                            <div
                                key={note}
                                className="rounded-3xl border border-slate-800 bg-slate-950/70 p-4"
                            >
                                <p className="text-sm font-bold leading-6 text-slate-200">
                                    {note}
                                </p>
                            </div>
                        ))}
                    </div>
                </section>

                <section className="mt-16">
                    <FeedbackPanel />
                </section>
            </section>
        </main>
    );
}