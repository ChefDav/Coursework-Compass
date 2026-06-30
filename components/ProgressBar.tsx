type ProgressBarProps = {
    value: number;
};

export default function ProgressBar({ value }: ProgressBarProps) {
    const safeValue = Math.min(Math.max(value, 0), 100);

    return (
        <div className="cc-progress-track h-3 overflow-hidden rounded-full">
            <div
                className={`cc-progress-fill cc-progress-fill-updated h-3 rounded-full ${
                    safeValue >= 100 ? "cc-progress-fill-complete" : ""
                }`}
                style={{ width: `${safeValue}%` }}
            />
        </div>
    );
}
