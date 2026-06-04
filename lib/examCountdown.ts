const IB_MAY_EXAM_TARGET_DATE = "2026-05-01";

const millisecondsPerDay = 1000 * 60 * 60 * 24;

function getStartOfDay(date: Date) {
    return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

export function getIbExamCountdown() {
    const today = getStartOfDay(new Date());
    const targetDate = getStartOfDay(new Date(`${IB_MAY_EXAM_TARGET_DATE}T00:00:00`));

    const differenceInMilliseconds = targetDate.getTime() - today.getTime();
    const daysLeft = Math.ceil(differenceInMilliseconds / millisecondsPerDay);

    if (daysLeft > 1) {
        return {
            daysLeft,
            label: "IB May 2026 Exam Season",
            targetDateLabel: "May 1, 2026",
            status: "counting",
            message: "days left until the target start of IB May exam season.",
        };
    }

    if (daysLeft === 1) {
        return {
            daysLeft,
            label: "IB May 2026 Exam Season",
            targetDateLabel: "May 1, 2026",
            status: "tomorrow",
            message: "day left until the target start of IB May exam season.",
        };
    }

    if (daysLeft === 0) {
        return {
            daysLeft,
            label: "IB May 2026 Exam Season",
            targetDateLabel: "May 1, 2026",
            status: "today",
            message: "The target IB May exam season start date is today.",
        };
    }

    return {
        daysLeft: Math.abs(daysLeft),
        label: "IB May 2026 Exam Season",
        targetDateLabel: "May 1, 2026",
        status: "started",
        message: "days since the target IB May exam season start date.",
    };
}