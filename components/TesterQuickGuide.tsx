export default function TesterQuickGuide() {
    return (
        <section className="rounded-[2rem] border border-emerald-400/30 bg-emerald-400/10 p-5 shadow-2xl shadow-emerald-950/20 sm:p-6">
            <div className="mb-5 flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                <div>
                    <p className="mb-2 text-sm font-bold text-emerald-300">
                        For student testers
                    </p>
                    <h2 className="text-2xl font-black sm:text-3xl">
                        Use the guided v1.2 tutorial first.
                    </h2>
                    <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-300">
                        v1.2 includes a separate tutorial sandbox for student testing. It
                        explains the product, lets students practise the planner controls,
                        and keeps the test experience separate from real saved projects.
                    </p>
                </div>

                <span className="w-fit rounded-full border border-emerald-400/30 bg-emerald-400/10 px-4 py-2 text-xs font-black uppercase tracking-[0.2em] text-emerald-300">
          v1.2
        </span>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
                <div className="rounded-3xl border border-slate-800 bg-slate-950/70 p-4">
                    <p className="mb-2 text-sm font-black text-emerald-300">01</p>
                    <h3 className="mb-2 font-bold text-white">Open tutorial</h3>
                    <p className="text-sm leading-6 text-slate-400">
                        Start from the guided tutorial instead of entering the full product
                        without context.
                    </p>
                </div>

                <div className="rounded-3xl border border-slate-800 bg-slate-950/70 p-4">
                    <p className="mb-2 text-sm font-black text-emerald-300">02</p>
                    <h3 className="mb-2 font-bold text-white">Practise controls</h3>
                    <p className="text-sm leading-6 text-slate-400">
                        Students can add, edit, complete, and delete simulated tasks inside
                        the tutorial before using the real planner.
                    </p>
                </div>

                <div className="rounded-3xl border border-slate-800 bg-slate-950/70 p-4">
                    <p className="mb-2 text-sm font-black text-emerald-300">03</p>
                    <h3 className="mb-2 font-bold text-white">Send feedback</h3>
                    <p className="text-sm leading-6 text-slate-400">
                        Feedback is short and structured, helping future versions become
                        clearer for real students.
                    </p>
                </div>
            </div>

            <div className="mt-5 flex flex-col gap-4 sm:flex-row">
                <a
                    href="/test"
                    className="rounded-2xl bg-emerald-400 px-6 py-4 text-center font-bold text-slate-950 transition hover:bg-emerald-300"
                >
                    Open guided tutorial
                </a>

                <a
                    href="/projects/new"
                    className="rounded-2xl border border-slate-700 px-6 py-4 text-center font-bold text-white transition hover:border-slate-400"
                >
                    Create a real project
                </a>
            </div>
        </section>
    );
}