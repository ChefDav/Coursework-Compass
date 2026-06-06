type ErrorNoticeProps = {
    title?: string;
    message: string;
    tone?: "error" | "warning";
};

export default function ErrorNotice({
                                        title = "Something needs attention",
                                        message,
                                        tone = "error",
                                    }: ErrorNoticeProps) {
    const toneClasses =
        tone === "warning"
            ? "border-amber-400/30 bg-amber-400/10 text-amber-200"
            : "border-red-400/30 bg-red-400/10 text-red-200";

    const iconClasses =
        tone === "warning"
            ? "border-amber-400/30 bg-amber-400/10 text-amber-300"
            : "border-red-400/30 bg-red-400/10 text-red-300";

    return (
        <div className={`rounded-2xl border p-4 ${toneClasses}`} role="alert">
            <div className="flex gap-3">
                <div
                    className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border text-sm font-black ${iconClasses}`}
                >
                    !
                </div>

                <div className="min-w-0">
                    <p className="text-sm font-black">{title}</p>
                    <p className="mt-1 text-sm leading-6 text-slate-300">{message}</p>
                </div>
            </div>
        </div>
    );
}