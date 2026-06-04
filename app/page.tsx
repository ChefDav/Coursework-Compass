import FeedbackLink from "@/components/FeedbackLink";

export default function HomePage() {
  return (
      <main className="min-h-screen bg-slate-950 text-white">
        <section className="mx-auto max-w-6xl px-4 py-6 sm:px-6 sm:py-8">
          <nav className="mb-16 flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <a href="/" className="text-xl font-black tracking-tight">
              Coursework Compass
            </a>

            <div className="flex flex-wrap gap-3 text-sm text-slate-300">
              <a
                  href="/dashboard"
                  className="rounded-full px-3 py-2 font-bold transition hover:bg-slate-800 hover:text-white"
              >
                Dashboard
              </a>
              <a
                  href="/projects"
                  className="rounded-full px-3 py-2 font-bold transition hover:bg-slate-800 hover:text-white"
              >
                Projects
              </a>
              <a
                  href="/today"
                  className="rounded-full px-3 py-2 font-bold transition hover:bg-slate-800 hover:text-white"
              >
                Today
              </a>
              <FeedbackLink />
            </div>
          </nav>

          <section className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
            <div>
              <p className="mb-4 inline-flex rounded-full border border-cyan-400/30 bg-cyan-400/10 px-4 py-2 text-sm font-bold text-cyan-300">
                Coursework planning for deadline-heavy students
              </p>

              <h1 className="max-w-4xl text-5xl font-black tracking-tight sm:text-6xl lg:text-7xl">
                Turn coursework chaos into a clear task plan.
              </h1>

              <p className="mt-6 max-w-2xl text-base leading-7 text-slate-300 sm:text-lg">
                Coursework Compass helps students create project plans from
                common coursework templates, generate deadline-based tasks, track
                progress, and keep daily work focused.
              </p>

              <div className="mt-8 flex flex-col gap-4 sm:flex-row">
                <a
                    href="/projects/new"
                    className="rounded-2xl bg-cyan-400 px-6 py-4 text-center font-bold text-slate-950 transition hover:bg-cyan-300"
                >
                  Start planning
                </a>

                <a
                    href="/dashboard"
                    className="rounded-2xl border border-slate-700 px-6 py-4 text-center font-bold text-white transition hover:border-slate-400"
                >
                  Open dashboard
                </a>
              </div>

              <div className="mt-8 grid gap-4 sm:grid-cols-3">
                <div className="rounded-3xl border border-slate-800 bg-slate-900 p-5">
                  <p className="text-3xl font-black text-cyan-300">4-8</p>
                  <p className="mt-2 text-sm text-slate-400">
                    generated tasks per project
                  </p>
                </div>

                <div className="rounded-3xl border border-slate-800 bg-slate-900 p-5">
                  <p className="text-3xl font-black text-emerald-300">100%</p>
                  <p className="mt-2 text-sm text-slate-400">
                    progress tracking from done tasks
                  </p>
                </div>

                <div className="rounded-3xl border border-slate-800 bg-slate-900 p-5">
                  <p className="text-3xl font-black text-amber-300">V1</p>
                  <p className="mt-2 text-sm text-slate-400">
                    local-first MVP in progress
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-[2rem] border border-cyan-400/30 bg-cyan-400/10 p-5 shadow-2xl shadow-cyan-950/40 sm:p-6">
              <div className="rounded-[1.5rem] border border-slate-800 bg-slate-950 p-5">
                <p className="mb-2 text-sm font-bold text-cyan-300">
                  Today&apos;s strategy
                </p>
                <h2 className="text-2xl font-black">
                  Attack the highest-risk task first.
                </h2>
                <p className="mt-3 text-sm leading-6 text-slate-300">
                  Coursework Compass turns your deadline into a focused task list,
                  then keeps the next action visible.
                </p>

                <div className="mt-6 space-y-4">
                  <div className="rounded-2xl border border-slate-800 bg-slate-900 p-4">
                    <div className="mb-2 flex items-center justify-between gap-3">
                      <p className="font-bold">Define research question</p>
                      <span className="rounded-full bg-red-400/10 px-3 py-1 text-xs font-bold text-red-300">
                      High
                    </span>
                    </div>
                    <p className="text-sm text-slate-400">Math IA</p>
                  </div>

                  <div className="rounded-2xl border border-slate-800 bg-slate-900 p-4">
                    <div className="mb-2 flex items-center justify-between gap-3">
                      <p className="font-bold">Create data table</p>
                      <span className="rounded-full bg-amber-400/10 px-3 py-1 text-xs font-bold text-amber-300">
                      Medium
                    </span>
                    </div>
                    <p className="text-sm text-slate-400">Math IA</p>
                  </div>

                  <div className="rounded-2xl border border-emerald-400/30 bg-emerald-400/10 p-4">
                    <div className="mb-2 flex items-center justify-between gap-3">
                      <p className="font-bold text-emerald-200 line-through">
                        Choose project template
                      </p>
                      <span className="rounded-full bg-emerald-400/10 px-3 py-1 text-xs font-bold text-emerald-300">
                      Done
                    </span>
                    </div>
                    <p className="text-sm text-slate-400">Project setup</p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="mt-20">
            <div className="mb-8">
              <p className="mb-2 text-sm font-bold text-cyan-300">
                How it works
              </p>
              <h2 className="text-3xl font-black sm:text-4xl">
                From deadline panic to a visible plan.
              </h2>
            </div>

            <div className="grid gap-6 md:grid-cols-4">
              <div className="rounded-3xl border border-slate-800 bg-slate-900 p-6">
                <p className="mb-4 text-sm font-bold text-cyan-300">01</p>
                <h3 className="mb-3 text-xl font-bold">Choose a template</h3>
                <p className="text-sm leading-6 text-slate-300">
                  Start from Math IA, CS IA, TOK Essay, Extended Essay, English,
                  or Economics templates.
                </p>
              </div>

              <div className="rounded-3xl border border-slate-800 bg-slate-900 p-6">
                <p className="mb-4 text-sm font-bold text-cyan-300">02</p>
                <h3 className="mb-3 text-xl font-bold">Add a deadline</h3>
                <p className="text-sm leading-6 text-slate-300">
                  Enter a valid deadline and choose a planning intensity that
                  matches your workload.
                </p>
              </div>

              <div className="rounded-3xl border border-slate-800 bg-slate-900 p-6">
                <p className="mb-4 text-sm font-bold text-cyan-300">03</p>
                <h3 className="mb-3 text-xl font-bold">Generate tasks</h3>
                <p className="text-sm leading-6 text-slate-300">
                  Coursework Compass creates a task plan with priorities, due
                  dates, and estimated work time.
                </p>
              </div>

              <div className="rounded-3xl border border-slate-800 bg-slate-900 p-6">
                <p className="mb-4 text-sm font-bold text-cyan-300">04</p>
                <h3 className="mb-3 text-xl font-bold">Track progress</h3>
                <p className="text-sm leading-6 text-slate-300">
                  Mark tasks done, watch progress rise, and archive finished work
                  when a project reaches 100%.
                </p>
              </div>
            </div>
          </section>

          <section className="mt-20 rounded-[2rem] border border-slate-800 bg-slate-900 p-6 sm:p-8">
            <div className="grid gap-8 md:grid-cols-[1fr_auto] md:items-center">
              <div>
                <p className="mb-2 text-sm font-bold text-emerald-300">
                  Ready to test the workflow?
                </p>
                <h2 className="text-3xl font-black sm:text-4xl">
                  Create your first coursework plan.
                </h2>
                <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-300">
                  This MVP currently saves data in your browser. Cloud accounts
                  and sync will come later after the core experience is polished.
                </p>
              </div>

              <a
                  href="/projects/new"
                  className="rounded-2xl bg-cyan-400 px-6 py-4 text-center font-bold text-slate-950 transition hover:bg-cyan-300"
              >
                Start now
              </a>
            </div>
          </section>
        </section>
      </main>
  );
}