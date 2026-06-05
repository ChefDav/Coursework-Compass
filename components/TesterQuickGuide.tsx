export default function TesterQuickGuide() {
    return (
        <section className="rounded-[2rem] border border-emerald-400/30 bg-emerald-400/10 p-5 shadow-2xl shadow-emerald-950/20 sm:p-6">
            <div className="mb-5 flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                <div>
                    <p className="mb-2 text-sm font-bold text-emerald-300">
                        For student testers
                    </p>
                    <h2 className="text-2xl font-black sm:text-3xl">
                        Test Coursework Compass in 5 minutes.
                    </h2>
                    <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-300">
                        You do not need to write a long report. Try the core workflow, notice
                        what feels useful or confusing, then send short feedback.
                    </p>
                </div>

                <span className="w-fit rounded-full border border-emerald-400/30 bg-emerald-400/10 px-4 py-2 text-xs font-black uppercase tracking-[0.2em] text-emerald-300">
          Test flow
        </span>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
                <div className="rounded-3xl border border-slate-800 bg-slate-950/70 p-4">
                    <p className="mb-2 text-sm font-black text-emerald-300">01</p>
                    <h3 className="mb-2 font-bold text-white">Create a plan</h3>
                    <p className="text-sm leading-6 text-slate-400">
                        Click Start planning, choose a template, set a deadline, and create
                        a coursework project.
                    </p>
                </div>

                <div className="rounded-3xl border border-slate-800 bg-slate-950/70 p-4">
                    <p className="mb-2 text-sm font-black text-emerald-300">02</p>
                    <h3 className="mb-2 font-bold text-white">Edit the workflow</h3>
                    <p className="text-sm leading-6 text-slate-400">
                        Try adding a task, editing a task, deleting a task, and marking a
                        task as done.
                    </p>
                </div>

                <div className="rounded-3xl border border-slate-800 bg-slate-950/70 p-4">
                    <p className="mb-2 text-sm font-black text-emerald-300">03</p>
                    <h3 className="mb-2 font-bold text-white">Send feedback</h3>
                    <p className="text-sm leading-6 text-slate-400">
                        Tell me what helped, what confused you, and what would make you use
                        it again.
                    </p>
                </div>
            </div>

            <div className="mt-5 rounded-3xl border border-slate-800 bg-slate-950/70 p-4">
                <p className="mb-3 text-sm font-bold text-white">
                    Quick tester checklist
                </p>

                <div className="grid gap-3 text-sm leading-6 text-slate-400 md:grid-cols-2">
                    <p>• Create and save a project</p>
                    <p>• Try the calendar date picker</p>
                    <p>• Add your own custom task</p>
                    <p>• Edit task title, priority, due date, and time</p>
                    <p>• Delete a task and check the progress</p>
                    <p>• Send one piece of honest feedback</p>
                </div>
            </div>

            <div className="mt-5 flex flex-col gap-4 sm:flex-row">
                <a
                    href="/projects/new"
                    className="rounded-2xl bg-emerald-400 px-6 py-4 text-center font-bold text-slate-950 transition hover:bg-emerald-300"
                >
                    Start 5-minute test
                </a>

                <a
                    href="/updates"
                    className="rounded-2xl border border-slate-700 px-6 py-4 text-center font-bold text-white transition hover:border-slate-400"
                >
                    View testing guide
                </a>
            </div>
        </section>
    );
}