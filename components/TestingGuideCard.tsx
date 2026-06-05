export default function TestingGuideCard() {
    return (
        <section className="rounded-[2rem] border border-emerald-400/30 bg-emerald-400/10 p-5 shadow-2xl shadow-emerald-950/20 sm:p-6">
            <div className="mb-5">
                <p className="mb-2 text-sm font-bold text-emerald-300">
                    Student testing guide
                </p>
                <h2 className="text-2xl font-black sm:text-3xl">
                    Testing Coursework Compass should take about 10 minutes.
                </h2>
                <p className="mt-3 text-sm leading-6 text-slate-300">
                    Thank you for helping test this early version. Your feedback will
                    directly shape the next iteration of the product.
                </p>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
                <div className="rounded-3xl border border-slate-800 bg-slate-950/70 p-4">
                    <p className="mb-2 text-sm font-black text-cyan-300">01</p>
                    <h3 className="mb-2 font-bold text-white">Create a sample project</h3>
                    <p className="text-sm leading-6 text-slate-400">
                        Choose a template that matches your subject, add a deadline, and
                        generate a task plan.
                    </p>
                </div>

                <div className="rounded-3xl border border-slate-800 bg-slate-950/70 p-4">
                    <p className="mb-2 text-sm font-black text-cyan-300">02</p>
                    <h3 className="mb-2 font-bold text-white">Try the main workflow</h3>
                    <p className="text-sm leading-6 text-slate-400">
                        Check the Dashboard, Today page, Project Details page, and try
                        marking a task as done.
                    </p>
                </div>

                <div className="rounded-3xl border border-slate-800 bg-slate-950/70 p-4">
                    <p className="mb-2 text-sm font-black text-cyan-300">03</p>
                    <h3 className="mb-2 font-bold text-white">Send honest feedback</h3>
                    <p className="text-sm leading-6 text-slate-400">
                        Use the Feedback button or email your comments. Short, honest
                        feedback is more useful than perfect wording.
                    </p>
                </div>
            </div>

            <div className="mt-5 rounded-3xl border border-amber-400/30 bg-amber-400/10 p-4">
                <p className="mb-2 text-sm font-bold text-amber-300">
                    Privacy note
                </p>
                <p className="text-sm leading-6 text-slate-300">
                    Please do not enter private or sensitive information. This early MVP
                    stores project data locally in your browser and does not require an
                    account.
                </p>
            </div>

            <div className="mt-5">
                <p className="mb-2 text-sm font-bold text-slate-300">
                    Helpful feedback could include:
                </p>
                <ul className="space-y-2 text-sm leading-6 text-slate-400">
                    <li>• What felt useful?</li>
                    <li>• What was confusing?</li>
                    <li>• Which subject templates would you want next?</li>
                    <li>• Would you use this during real coursework?</li>
                    <li>• What would make it worth returning to?</li>
                </ul>
            </div>
        </section>
    );
}