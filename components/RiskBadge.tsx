import type { PriorityLevel, RiskLevel } from "@/types/coursework";

type BadgeLevel = RiskLevel | PriorityLevel;

type RiskBadgeProps = {
    level: BadgeLevel;
    label?: string;
};

function getBadgeStyle(level: BadgeLevel) {
    if (level === "High") {
        return "cc-badge-danger";
    }

    if (level === "Medium") {
        return "cc-badge-warning";
    }

    return "cc-badge-success";
}

export default function RiskBadge({ level, label }: RiskBadgeProps) {
    return (
        <span className={getBadgeStyle(level)}>
      {label ?? level}
    </span>
    );
}
