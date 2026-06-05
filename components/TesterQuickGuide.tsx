export default function TesterQuickGuide() {
    return (
        <section className="rounded-[2rem] border border-emerald-400/30 bg-emerald-400/10 p-5 shadow-2xl shadow-emerald-950/20 sm:p-6">
            <div className="mb-5 flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                <div>
                    <p className="mb-2 text-sm font-bold text-emerald-300">
                        For student testers
                    </p>
                    <h2 className="text-2xl font-black sm:text-3xl">
                        Use the guided student testing page.
                    </h2>
                    <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-300">
                        v1.1.2 adds a dedicated testing route for students. It explains what
                        to test, gives sample project ideas, and links directly to feedback.
                    </p>
                </div>

                <span className="w-fit rounded-full border border-emerald-400/30 bg-emerald-400/10 px-4 py-2 text-xs font-black uppercase tracking-[0.2em] text-emerald-300">
          v1.1.2
        </span>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
                <div className="rounded-3xl border border-slate-800 bg-slate-950/70 p-4">
                    <p className="mb-2 text-sm font-black text-emerald-300">01</p>
                    <h3 className="mb-2 font-bold text-white">Open testing page</h3>
                    <p className="text-sm leading-6 text-slate-400">
                        Start from the dedicated testing page instead of wandering through
                        the site without a route.
                    </p>
                </div>

                <div className="rounded-3xl border border-slate-800 bg-slate-950/70 p-4">
                    <p className="mb-2 text-sm font-black text-emerald-300">02</p>
                    <h3 className="mb-2 font-bold text-white">Use a sample project</h3>
                    <p className="text-sm leading-6 text-slate-400">
                        Testers can use sample IA, EE, TOK, or essay projects if they do not
                        want to enter a real one.
                    </p>
                </div>

                <div className="rounded-3xl border border-slate-800 bg-slate-950/70 p-4">
                    <p className="mb-2 text-sm font-black text-emerald-300">03</p>
                    <h3 className="mb-2 font-bold text-white">Send feedback</h3>
                    <p className="text-sm leading-6 text-slate-400">
                        The feedback email now clearly identifies student testing responses
                        from v1.1.2.
                    </p>
                </div>
            </div>

            <div className="mt-5 flex flex-col gap-4 sm:flex-row">
                <a
                    href="/test"
                    className="rounded-2xl bg-emerald-400 px-6 py-4 text-center font-bold text-slate-950 transition hover:bg-emerald-300"
                >
                    Open student testing page
                </a>

                <a
                    href="/projects/new"
                    className="rounded-2xl border border-slate-700 px-6 py-4 text-center font-bold text-white transition hover:border-slate-400"
                >
                    Create a project
                </a>
            </div>
        </section>
    );
}