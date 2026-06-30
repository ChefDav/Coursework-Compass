export type BackgroundPreset =
    | "default"
    | "deep-ocean"
    | "paper-light"
    | "aurora"
    | "minimal-slate"
    | "exam-focus";

export const BACKGROUND_STORAGE_KEY = "coursework-compass-background";
export const BACKGROUND_CHANGED_EVENT = "coursework-compass-background-changed";

const DEFAULT_BACKGROUND: BackgroundPreset = "default";

export const BACKGROUND_PRESETS: BackgroundPreset[] = [
    "default",
    "deep-ocean",
    "paper-light",
    "aurora",
    "minimal-slate",
    "exam-focus",
];

export function isBackgroundPreset(value: unknown): value is BackgroundPreset {
    return (
        value === "default" ||
        value === "deep-ocean" ||
        value === "paper-light" ||
        value === "aurora" ||
        value === "minimal-slate" ||
        value === "exam-focus"
    );
}

export function getStoredBackground(): BackgroundPreset {
    if (typeof window === "undefined") {
        return DEFAULT_BACKGROUND;
    }

    try {
        const savedBackground = window.localStorage.getItem(BACKGROUND_STORAGE_KEY);

        if (isBackgroundPreset(savedBackground)) {
            return savedBackground;
        }
    } catch {
        return DEFAULT_BACKGROUND;
    }

    return DEFAULT_BACKGROUND;
}

export function saveStoredBackground(background: BackgroundPreset): void {
    if (typeof window === "undefined") {
        return;
    }

    try {
        window.localStorage.setItem(BACKGROUND_STORAGE_KEY, background);
    } catch {
        // Keep the in-page event path working even if localStorage is unavailable.
    }

    window.dispatchEvent(
        new CustomEvent(BACKGROUND_CHANGED_EVENT, {
            detail: {
                background,
            },
        }),
    );
}

export function applyBackgroundToDocument(background: BackgroundPreset): void {
    if (typeof document === "undefined") {
        return;
    }

    document.documentElement.dataset.background = background;
}

export function setStoredBackground(background: BackgroundPreset): void {
    saveStoredBackground(background);
    applyBackgroundToDocument(background);
}

export function listenForBackgroundChange(
    callback: (background: BackgroundPreset) => void,
): () => void {
    if (typeof window === "undefined") {
        return () => {};
    }

    function handleBackgroundChange(event: Event) {
        const customEvent = event as CustomEvent<{ background?: unknown }>;
        const nextBackground = customEvent.detail?.background;

        if (isBackgroundPreset(nextBackground)) {
            callback(nextBackground);
            return;
        }

        callback(getStoredBackground());
    }

    function handleStorageChange(event: StorageEvent) {
        if (event.key !== BACKGROUND_STORAGE_KEY) {
            return;
        }

        callback(
            isBackgroundPreset(event.newValue)
                ? event.newValue
                : DEFAULT_BACKGROUND,
        );
    }

    window.addEventListener(BACKGROUND_CHANGED_EVENT, handleBackgroundChange);
    window.addEventListener("storage", handleStorageChange);

    return () => {
        window.removeEventListener(
            BACKGROUND_CHANGED_EVENT,
            handleBackgroundChange,
        );
        window.removeEventListener("storage", handleStorageChange);
    };
}
