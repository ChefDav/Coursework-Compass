import type { RiskLevel } from "@/types/coursework";

export function createProjectId(title: string) {
    return title
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");
}

export function isValidDeadlineFormat(deadline: string) {
    const deadlinePattern = /^(\d{4})\/(\d{2})\/(\d{2})$/;
    const match = deadline.match(deadlinePattern);

    if (!match) {
        return false;
    }

    const year = Number(match[1]);
    const month = Number(match[2]);
    const day = Number(match[3]);

    if (year < 2026) {
        return false;
    }

    const date = new Date(year, month - 1, day);

    const isRealDate =
        date.getFullYear() === year &&
        date.getMonth() === month - 1 &&
        date.getDate() === day;

    return isRealDate;
}

export function normalizeDeadline(deadline: string) {
    return deadline.replaceAll("/", "-");
}

export function calculateDaysLeft(deadline: string) {
    const normalizedDeadline = normalizeDeadline(deadline);
    const today = new Date();
    const deadlineDate = new Date(`${normalizedDeadline}T23:59:59`);

    const differenceInMilliseconds = deadlineDate.getTime() - today.getTime();
    const daysLeft = Math.ceil(differenceInMilliseconds / (1000 * 60 * 60 * 24));

    return Math.max(daysLeft, 0);
}

export function calculateRisk(daysLeft: number): RiskLevel {
    if (daysLeft <= 14) {
        return "High";
    }

    if (daysLeft <= 30) {
        return "Medium";
    }

    return "Low";
}