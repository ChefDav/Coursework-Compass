export default function Home(){
  return (
      <main className="min-h-screen bg-slate-950 text-white">
        <section className="mx-auto flex min-h-screen max-w-6xl flex-col px-6 py-8">
          <nav className="flex items-center justify-between">
            <div className="text-xl font-bold tracking-tight">
              Coursework Compass
            </div>

            <div className="hidden gap-6 text-sm text-slate-300 md:flex">
              <a href="#features" className="hover:text-white">
                Features
              </a>
              <a href="#workflow" className="hover:text-white">
                Workflow
              </a>
              <a href="#pricing" className="hover:text-white">
                Pricing
              </a>
            </div>
          </nav>

          <div className="grid flex-1 items-center gap-12 py-20 md:grid-cols-2">
            <div>
              <div className="mb-6 inline-flex rounded-full border border-cyan-400/30 bg-cyan-400/10 px-4 py-2 text-sm text-cyan-200">
                Built for IB and A-Level students
              </div>

              <h1 className="mb-6 text-5xl font-black tracking-tight md:text-7xl">
                Turn giant coursework into clear daily steps.
              </h1>

              <p className="mb-8 max-w-xl text-lg leading-8 text-slate-300">
                Coursework Compass helps students manage IA, EE, TOK, essays,
                projects, and revision plans before deadlines become monsters
                under the bed.
              </p>

              <div className="flex flex-col gap-4 sm:flex-row">
                <a
                    href="#demo"
                    className="rounded-2xl bg-cyan-400 px-6 py-4 text-center font-bold text-slate-950 transition hover:bg-cyan-300"
                >
                  Start Planning
                </a>

                <a
                    href="#features"
                    className="rounded-2xl border border-slate-700 px-6 py-4 text-center font-bold text-white transition hover:border-slate-400"
                >
                  View Features
                </a>
              </div>
            </div>

            <div
                id="demo"
                className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6 shadow-2xl shadow-cyan-950/40"
            >
              <div className="mb-6 flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-400">Today&apos;s focus</p>
                  <h2 className="text-2xl font-bold">Math IA Progress</h2>
                </div>

                <span className="rounded-full bg-amber-400/10 px-4 py-2 text-sm font-semibold text-amber-300">
                Medium Risk
              </span>
              </div>

              <div className="space-y-4">
                <div className="rounded-2xl bg-slate-800 p-4">
                  <div className="mb-2 flex justify-between text-sm">
                    <span>Research question draft</span>
                    <span className="text-cyan-300">Done</span>
                  </div>
                  <div className="h-2 rounded-full bg-slate-700">
                    <div className="h-2 w-full rounded-full bg-cyan-400" />
                  </div>
                </div>

                <div className="rounded-2xl bg-slate-800 p-4">
                  <div className="mb-2 flex justify-between text-sm">
                    <span>Collect 3 data sources</span>
                    <span className="text-slate-300">Today</span>
                  </div>
                  <div className="h-2 rounded-full bg-slate-700">
                    <div className="h-2 w-2/3 rounded-full bg-cyan-400" />
                  </div>
                </div>

                <div className="rounded-2xl bg-slate-800 p-4">
                  <div className="mb-2 flex justify-between text-sm">
                    <span>Write methodology outline</span>
                    <span className="text-slate-300">Tomorrow</span>
                  </div>
                  <div className="h-2 rounded-full bg-slate-700">
                    <div className="h-2 w-1/3 rounded-full bg-cyan-400" />
                  </div>
                </div>
              </div>

              <div className="mt-6 rounded-2xl border border-slate-800 bg-slate-950 p-4">
                <p className="text-sm text-slate-400">Deadline</p>
                <p className="text-3xl font-black">23 days left</p>
              </div>
            </div>
          </div>
        </section>

        <section
            id="features"
            className="mx-auto grid max-w-6xl gap-6 px-6 pb-20 md:grid-cols-3"
        >
          <div className="rounded-3xl border border-slate-800 bg-slate-900 p-6">
            <h3 className="mb-3 text-xl font-bold">Smart Breakdown</h3>
            <p className="text-slate-300">
              Split large coursework into research, drafting, feedback, and final
              polish stages.
            </p>
          </div>

          <div className="rounded-3xl border border-slate-800 bg-slate-900 p-6">
            <h3 className="mb-3 text-xl font-bold">Daily Focus</h3>
            <p className="text-slate-300">
              Show what matters today instead of drowning students in a giant
              task list.
            </p>
          </div>

          <div className="rounded-3xl border border-slate-800 bg-slate-900 p-6">
            <h3 className="mb-3 text-xl font-bold">Risk Signals</h3>
            <p className="text-slate-300">
              Warn students early when their deadline is getting too close for
              comfort.
            </p>
          </div>
        </section>

        <section
            id="workflow"
            className="mx-auto max-w-6xl px-6 pb-20 text-slate-300"
        >
          <h2 className="mb-6 text-3xl font-black text-white">
            From chaos to checklist.
          </h2>

          <div className="grid gap-4 md:grid-cols-4">
            {["Create project", "Set deadline", "Generate plan", "Track progress"].map(
                (step, index) => (
                    <div
                        key={step}
                        className="rounded-2xl border border-slate-800 bg-slate-900 p-5"
                    >
                      <p className="mb-3 text-sm text-cyan-300">
                        Step {index + 1}
                      </p>
                      <p className="font-bold text-white">{step}</p>
                    </div>
                ),
            )}
          </div>
        </section>

        <section
            id="pricing"
            className="mx-auto max-w-6xl px-6 pb-20"
        >
          <div className="rounded-3xl border border-cyan-400/30 bg-cyan-400/10 p-8">
            <p className="mb-2 text-sm font-bold text-cyan-300">
              Planned pricing
            </p>
            <h2 className="mb-4 text-3xl font-black">
              Free to start. Pro for serious coursework survival.
            </h2>
            <p className="text-slate-300">
              The MVP will start free. Later, Pro features may include unlimited
              projects, cloud sync, export, AI planning, and advanced progress
              analytics.
            </p>
          </div>
        </section>
      </main>
  );
}