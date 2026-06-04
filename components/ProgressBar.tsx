type ProgressBarProps = {
    value: number;
};

export default function ProgressBar({ value }: ProgressBarProps) {
    const safeValue = Math.min(Math.max(value, 0), 100);

    return (
        <div className="h-3 rounded-full bg-slate-800">
            <div
                className="h-3 rounded-full bg-cyan-400"
                style={{ width: `${safeValue}%` }}
            />
        </div>
    );
}