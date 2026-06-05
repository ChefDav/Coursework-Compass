import AppNav from "@/components/AppNav";
import BetaNotice from "@/components/BetaNotice";
import ExamCountdownCard from "@/components/ExamCountdownCard";
import FeedbackLink from "@/components/FeedbackLink";
import FeedbackPanel from "@/components/FeedbackPanel";
import TesterQuickGuide from "@/components/TesterQuickGuide";
import TestingGuideCard from "@/components/TestingGuideCard";

const templateHighlights = [
  "Math IA",
  "Computer Science IA",
  "Biology IA",
  "Chemistry IA",
  "Physics IA",
  "Business IA",
  "TOK Essay",
  "Extended Essay",
  "English Essay",
  "Economics Commentary",
  "EPQ",
  "University Personal Statement",
];

const workflowSteps = [
  {
    number: "01",
    title: "Choose your coursework type",
    description:
        "Pick a template for IA, EE, TOK, essays, EPQ, personal statement, or another major academic project.",
  },
  {
    number: "02",
    title: "Set your deadline",
    description:
        "Use the calendar picker to choose a real deadline. Coursework Compass turns it into a structured plan.",
  },
  {
    number: "03",
    title: "Generate and edit your plan",
    description:
        "Create tasks, add your own custom work, edit task details, delete tasks, and track progress from Dashboard and Today.",
  },
];

const featureCards = [
  {
    title: "Deadline-aware planning",
    description:
        "Your project plan is generated around the deadline, so the work feels less like a fog bank and more like a route map.",
  },
  {
    title: "Editable task workspace",
    description:
        "Add, edit, delete, complete, and restore tasks. The v1.1 beta is designed for real coursework changes.",
  },
  {
    title: "Student-first interface",
    description:
        "Built for students managing IA, EE, TOK, essays, mock season, revision pressure, and shifting teacher feedback.",
  },
];

export default function HomePage() {
  return (
      <main className="min-h-screen bg-slate-950 text-white">
        <section className="mx-auto max-w-6xl px-4 py-6 sm:px-6 sm:py-8">
          <AppNav />

          <section className="grid gap-10 py-12 md:grid-cols-[1.2fr_0.8fr] md:items-center md:py-20">
            <div>
              <div className="mb-5 inline-flex rounded-full border border-cyan-400/30 bg-cyan-400/10 px-4 py-2 text-xs font-black uppercase tracking-[0.2em] text-cyan-300">
                Coursework Compass v1.1 Editable Planner
              </div>

              <h1 className="text-5xl font-black tracking-tight sm:text-6xl md:text-7xl">
                Turn coursework chaos into a clear daily plan.
              </h1>

              <p className="mt-6 max-w-2xl text-base leading-8 text-slate-300 sm:text-lg">
                Coursework Compass helps IB and A-Level students break major
                projects into manageable tasks, deadlines, progress, and daily
                execution. Create a plan, edit it, and keep moving.
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

              <div className="mt-8">
                <FeedbackLink />
              </div>
            </div>

            <div className="rounded-[2rem] border border-cyan-400/20 bg-slate-900/80 p-5 shadow-2xl shadow-cyan-950/30 sm:p-6">
              <div className="mb-5">
                <p className="mb-2 text-sm font-bold text-cyan-300">
                  Today&apos;s mission
                </p>
                <h2 className="text-2xl font-black">
                  Know exactly what to do next.
                </h2>
                <p className="mt-2 text-sm leading-6 text-slate-300">
                  A coursework plan should not sit in your head like a storm. It
                  should be visible, editable, and calm enough to act on.
                </p>
              </div>

              <div className="space-y-4">
                <div className="rounded-3xl border border-slate-800 bg-slate-950/70 p-4">
                  <div className="mb-3 flex items-center justify-between">
                    <p className="font-bold text-white">Math IA Exploration</p>
                    <span className="rounded-full bg-cyan-400/10 px-3 py-1 text-xs font-bold text-cyan-300">
                    Active
                  </span>
                  </div>

                  <div className="h-3 overflow-hidden rounded-full bg-slate-800">
                    <div className="h-full w-[72%] rounded-full bg-cyan-400" />
                  </div>

                  <p className="mt-2 text-xs text-slate-400">
                    72% complete · deadline approaching
                  </p>
                </div>

                <div className="rounded-3xl border border-slate-800 bg-slate-950/70 p-4">
                  <p className="mb-3 text-sm font-bold text-slate-300">
                    Generated task plan
                  </p>

                  <div className="space-y-3">
                    <div className="rounded-2xl bg-slate-900 px-4 py-3">
                      <p className="font-bold text-white">
                        Refine research question
                      </p>
                      <p className="mt-1 text-xs text-slate-400">
                        High priority · 45 min
                      </p>
                    </div>

                    <div className="rounded-2xl bg-slate-900 px-4 py-3">
                      <p className="font-bold text-white">
                        Create data collection table
                      </p>
                      <p className="mt-1 text-xs text-slate-400">
                        Medium priority · 30 min
                      </p>
                    </div>

                    <div className="rounded-2xl bg-emerald-400/10 px-4 py-3">
                      <p className="font-bold text-emerald-200 line-through">
                        Draft method section
                      </p>
                      <p className="mt-1 text-xs text-emerald-300">Done</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="rounded-[2rem] border border-emerald-400/30 bg-emerald-400/10 p-6 shadow-2xl shadow-emerald-950/20 sm:p-8">
            <div className="grid gap-8 md:grid-cols-[1.2fr_0.8fr] md:items-center">
              <div>
                <p className="mb-2 text-sm font-bold text-emerald-300">
                  Student testing route
                </p>
                <h2 className="text-3xl font-black tracking-tight sm:text-4xl">
                  Joining the test? Start from the guided tutorial.
                </h2>
                <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-300">
                  The main website stays as the normal product experience. The
                  test route is now separated into an independent tutorial, so
                  students can try the workflow safely without touching real
                  project data.
                </p>
              </div>

              <div className="flex flex-col gap-4">
                <a
                    href="/test"
                    className="rounded-[1.75rem] bg-emerald-400 px-8 py-6 text-center text-lg font-black text-slate-950 shadow-2xl shadow-emerald-950/40 transition hover:bg-emerald-300"
                >
                  Join student test
                </a>

                <a
                    href="/updates"
                    className="rounded-2xl border border-slate-700 px-6 py-4 text-center font-bold text-white transition hover:border-slate-400"
                >
                  View release notes
                </a>
              </div>
            </div>
          </section>

          <div className="mt-10">
            <BetaNotice />
          </div>

          <div className="mt-10">
            <TesterQuickGuide />
          </div>

          <div className="mt-10">
            <TestingGuideCard />
          </div>

          <div className="mt-10">
            <FeedbackPanel />
          </div>

          <section className="mt-20">
            <div className="mb-8">
              <p className="mb-2 text-sm font-bold text-cyan-300">
                Countdown pressure
              </p>
              <h2 className="text-3xl font-black tracking-tight sm:text-4xl">
                Deadlines become clearer when time is visible.
              </h2>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-300">
                Coursework Compass includes countdown-oriented planning so major
                projects feel less invisible.
              </p>
            </div>

            <ExamCountdownCard />
          </section>

          <section className="mt-20">
            <div className="mb-8">
              <p className="mb-2 text-sm font-bold text-cyan-300">
                How it works
              </p>
              <h2 className="text-3xl font-black tracking-tight sm:text-4xl">
                From vague coursework to visible progress.
              </h2>
            </div>

            <div className="grid gap-5 md:grid-cols-3">
              {workflowSteps.map((step) => (
                  <div
                      key={step.number}
                      className="rounded-[2rem] border border-slate-800 bg-slate-900 p-5 sm:p-6"
                  >
                    <p className="mb-4 text-sm font-black text-cyan-300">
                      {step.number}
                    </p>
                    <h3 className="mb-3 text-xl font-black text-white">
                      {step.title}
                    </h3>
                    <p className="text-sm leading-6 text-slate-400">
                      {step.description}
                    </p>
                  </div>
              ))}
            </div>
          </section>

          <section className="mt-20">
            <div className="mb-8">
              <p className="mb-2 text-sm font-bold text-cyan-300">
                v1.1 features
              </p>
              <h2 className="text-3xl font-black tracking-tight sm:text-4xl">
                Built for real student workflows.
              </h2>
            </div>

            <div className="grid gap-5 md:grid-cols-3">
              {featureCards.map((feature) => (
                  <div
                      key={feature.title}
                      className="rounded-[2rem] border border-cyan-400/20 bg-cyan-400/10 p-5 sm:p-6"
                  >
                    <h3 className="mb-3 text-xl font-black text-white">
                      {feature.title}
                    </h3>
                    <p className="text-sm leading-6 text-slate-300">
                      {feature.description}
                    </p>
                  </div>
              ))}
            </div>
          </section>

          <section className="mt-20">
            <div className="mb-8">
              <p className="mb-2 text-sm font-bold text-cyan-300">
                Supported templates
              </p>
              <h2 className="text-3xl font-black tracking-tight sm:text-4xl">
                Start with a subject-specific structure.
              </h2>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-300">
                The current template library covers common IB and A-Level
                coursework formats. More templates will be added through student
                feedback.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              {templateHighlights.map((template) => (
                  <span
                      key={template}
                      className="rounded-full border border-slate-700 bg-slate-900 px-4 py-2 text-sm font-bold text-slate-200"
                  >
                {template}
              </span>
              ))}
            </div>
          </section>

          <section className="mt-20 rounded-[2rem] border border-emerald-400/30 bg-emerald-400/10 p-6 sm:p-8">
            <div className="grid gap-8 md:grid-cols-[1.2fr_0.8fr] md:items-center">
              <div>
                <p className="mb-2 text-sm font-bold text-emerald-300">
                  Ready to plan?
                </p>
                <h2 className="text-3xl font-black tracking-tight sm:text-4xl">
                  Create your first coursework plan.
                </h2>
                <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-300">
                  Use the normal planner if you want to create a real project, or
                  use the guided test route if you are joining the student testing
                  session.
                </p>
              </div>

              <div className="flex flex-col gap-4">
                <a
                    href="/projects/new"
                    className="rounded-2xl bg-emerald-400 px-6 py-4 text-center font-bold text-slate-950 transition hover:bg-emerald-300"
                >
                  Create project
                </a>

                <a
                    href="/test"
                    className="rounded-2xl border border-slate-700 px-6 py-4 text-center font-bold text-white transition hover:border-emerald-400 hover:text-emerald-300"
                >
                  Join student test
                </a>
              </div>
            </div>
          </section>
        </section>
      </main>
  );
}