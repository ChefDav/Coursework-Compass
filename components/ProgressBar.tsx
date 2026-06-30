type ProgressBarProps = {
    value: number;
};

export default function ProgressBar({ value }: ProgressBarProps) {
    const safeValue = Math.min(Math.max(value, 0), 100);

    return (
        <div className="cc-progress-track h-3 overflow-hidden rounded-full">
            <div
                className="cc-progress-fill h-3 rounded-full bg-cyan-400"
                style={{ width: `${safeValue}%` }}
            />
        </div>
    );
}
