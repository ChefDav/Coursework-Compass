type EmptyStateAction = {
    label: string;
    href: string;
    variant?: "primary" | "secondary";
};

type EmptyStateProps = {
    eyebrow: string;
    title: string;
    description: string;
    icon?: string;
    actions?: EmptyStateAction[];
    tips?: string[];
};

export default function EmptyState({
                                       eyebrow,
                                       title,
                                       description,
                                       icon = "✦",
                                       actions = [],
                                       tips = [],
                                   }: EmptyStateProps) {
    return (
        <section className="relative overflow-hidden rounded-[1.5rem] border border-cyan-400/30 bg-cyan-400/10 p-5 shadow-2xl shadow-cyan-950/20 sm:rounded-[2rem] sm:p-8">
            <div className="absolute -right-16 -top-16 h-40 w-40 rounded-full bg-cyan-400/20 blur-3xl" />
            <div className="absolute -bottom-20 -left-20 h-48 w-48 rounded-full bg-emerald-400/20 blur-3xl" />

            <div className="relative z-10">
                <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl border border-cyan-400/30 bg-slate-950/70 text-xl shadow-xl shadow-cyan-950/30 sm:h-14 sm:w-14 sm:rounded-3xl sm:text-2xl">
                    {icon}
                </div>

                <p className="mb-2 text-sm font-bold text-cyan-300">{eyebrow}</p>

                <h2 className="max-w-3xl text-2xl font-black tracking-tight text-white sm:text-4xl">
                    {title}
                </h2>

                <p className="mt-4 max-w-3xl text-sm leading-6 text-slate-300">
                    {description}
                </p>

                {tips.length > 0 ? (
                    <div className="mt-6 grid gap-3 sm:grid-cols-2">
                        {tips.map((tip) => (
                            <div
                                key={tip}
                                className="rounded-2xl border border-slate-800 bg-slate-950/70 p-4"
                            >
                                <p className="text-sm font-bold leading-6 text-slate-300">
                                    {tip}
                                </p>
                            </div>
                        ))}
                    </div>
                ) : null}

                {actions.length > 0 ? (
                    <div className="mt-7 grid gap-3 sm:flex sm:flex-wrap">
                        {actions.map((action) => {
                            const isPrimary = action.variant !== "secondary";

                            return (
                                <a
                                    key={action.href + action.label}
                                    href={action.href}
                                    className={
                                        isPrimary
                                            ? "rounded-2xl bg-cyan-400 px-5 py-4 text-center text-sm font-bold text-slate-950 transition hover:bg-cyan-300 sm:px-6"
                                            : "rounded-2xl border border-slate-700 px-5 py-4 text-center text-sm font-bold text-white transition hover:border-slate-400 sm:px-6"
                                    }
                                >
                                    {action.label}
                                </a>
                            );
                        })}
                    </div>
                ) : null}
            </div>
        </section>
    );
}