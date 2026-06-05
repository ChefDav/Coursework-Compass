export default function BetaNotice() {
    return (
        <section className="rounded-[2rem] border border-cyan-400/30 bg-cyan-400/10 p-5 shadow-2xl shadow-cyan-950/20 sm:p-6">
            <div className="mb-5 flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                <div>
                    <p className="mb-2 text-sm font-bold text-cyan-300">
                        Coursework Compass v1.2 Student Testing Polish
                    </p>
                    <h2 className="text-2xl font-black sm:text-3xl">
                        A clearer testing-ready version is now open.
                    </h2>
                    <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-300">
                        This version focuses on making Coursework Compass easier for new
                        students to understand, test, and use. You can create coursework
                        projects, edit your plan, use the guided tutorial, and send short
                        feedback after testing the workflow.
                    </p>

                    <div className="mt-5 flex flex-col gap-3 sm:flex-row">
                        <a
                            href="/updates"
                            className="rounded-2xl bg-cyan-400 px-5 py-3 text-center text-sm font-bold text-slate-950 transition hover:bg-cyan-300"
                        >
                            View release notes
                        </a>

                        <a
                            href="/test"
                            className="rounded-2xl bg-emerald-400 px-5 py-3 text-center text-sm font-bold text-slate-950 transition hover:bg-emerald-300"
                        >
                            Join student test
                        </a>

                        <a
                            href="/projects/new"
                            className="rounded-2xl border border-slate-700 px-5 py-3 text-center text-sm font-bold text-white transition hover:border-slate-400"
                        >
                            Start planning
                        </a>
                    </div>
                </div>

                <span className="w-fit rounded-full border border-emerald-400/30 bg-emerald-400/10 px-4 py-2 text-xs font-black uppercase tracking-[0.2em] text-emerald-300">
          v1.2
        </span>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
                <div className="rounded-3xl border border-slate-800 bg-slate-950/70 p-4">
                    <p className="mb-2 text-sm font-black text-cyan-300">01</p>
                    <h3 className="mb-2 font-bold text-white">Plan coursework</h3>
                    <p className="text-sm leading-6 text-slate-400">
                        Choose a template, set a deadline, and generate a practical task
                        plan for IA, EE, TOK, essays, EPQ, and more.
                    </p>
                </div>

                <div className="rounded-3xl border border-slate-800 bg-slate-950/70 p-4">
                    <p className="mb-2 text-sm font-black text-cyan-300">02</p>
                    <h3 className="mb-2 font-bold text-white">Edit your workflow</h3>
                    <p className="text-sm leading-6 text-slate-400">
                        Add custom tasks, edit task title, due date, priority, estimated
                        time, and delete tasks that do not fit your real project.
                    </p>
                </div>

                <div className="rounded-3xl border border-slate-800 bg-slate-950/70 p-4">
                    <p className="mb-2 text-sm font-black text-cyan-300">03</p>
                    <h3 className="mb-2 font-bold text-white">Test safely</h3>
                    <p className="text-sm leading-6 text-slate-400">
                        The guided tutorial uses simulated data, so students can understand
                        the workflow before creating a real project.
                    </p>
                </div>
            </div>

            <div className="mt-5 rounded-3xl border border-amber-400/30 bg-amber-400/10 p-4">
                <p className="mb-2 text-sm font-bold text-amber-300">
                    Privacy and data note
                </p>
                <p className="text-sm leading-6 text-slate-300">
                    The current beta stores project data locally in your browser. You do
                    not need an account, and you should avoid entering private or
                    sensitive personal information. Cloud sync and accounts are planned
                    for a later version.
                </p>
            </div>
        </section>
    );
}