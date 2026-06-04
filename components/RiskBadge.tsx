import type { PriorityLevel, RiskLevel } from "@/types/coursework";

type BadgeLevel = RiskLevel | PriorityLevel;

type RiskBadgeProps = {
    level: BadgeLevel;
    label?: string;
};

function getBadgeStyle(level: BadgeLevel) {
    if (level === "High") {
        return "bg-red-400/10 text-red-300";
    }

    if (level === "Medium") {
        return "bg-amber-400/10 text-amber-300";
    }

    return "bg-emerald-400/10 text-emerald-300";
}

export default function RiskBadge({ level, label }: RiskBadgeProps) {
    return (
        <span
            className={`rounded-full px-4 py-2 text-sm font-bold ${getBadgeStyle(
                level,
            )}`}
        >
      {label ?? level}
    </span>
    );
}