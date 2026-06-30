export type Theme = "dark" | "light";

export const THEME_STORAGE_KEY = "coursework-compass-theme";
export const THEME_CHANGED_EVENT = "coursework-compass-theme-changed";

const DEFAULT_THEME: Theme = "dark";

export function isTheme(value: unknown): value is Theme {
    return value === "dark" || value === "light";
}

export function getStoredTheme(): Theme {
    if (typeof window === "undefined") {
        return DEFAULT_THEME;
    }

    try {
        const savedTheme = window.localStorage.getItem(THEME_STORAGE_KEY);

        if (isTheme(savedTheme)) {
            return savedTheme;
        }
    } catch {
        return DEFAULT_THEME;
    }

    return DEFAULT_THEME;
}

export function saveStoredTheme(theme: Theme): void {
    if (typeof window === "undefined") {
        return;
    }

    try {
        window.localStorage.setItem(THEME_STORAGE_KEY, theme);
    } catch {
        // Keep the in-page event path working even if localStorage is unavailable.
    }

    window.dispatchEvent(
        new CustomEvent(THEME_CHANGED_EVENT, {
            detail: {
                theme,
            },
        }),
    );
}

export function applyThemeToDocument(theme: Theme): void {
    if (typeof document === "undefined") {
        return;
    }

    document.documentElement.dataset.theme = theme;
    document.documentElement.style.colorScheme = theme;
}

export function setStoredTheme(theme: Theme): void {
    saveStoredTheme(theme);
    applyThemeToDocument(theme);
}

export function listenForThemeChange(
    callback: (theme: Theme) => void,
): () => void {
    if (typeof window === "undefined") {
        return () => {};
    }

    function handleThemeChange(event: Event) {
        const customEvent = event as CustomEvent<{ theme?: unknown }>;
        const nextTheme = customEvent.detail?.theme;

        if (isTheme(nextTheme)) {
            callback(nextTheme);
            return;
        }

        callback(getStoredTheme());
    }

    function handleStorageChange(event: StorageEvent) {
        if (event.key !== THEME_STORAGE_KEY) {
            return;
        }

        callback(isTheme(event.newValue) ? event.newValue : DEFAULT_THEME);
    }

    window.addEventListener(THEME_CHANGED_EVENT, handleThemeChange);
    window.addEventListener("storage", handleStorageChange);

    return () => {
        window.removeEventListener(THEME_CHANGED_EVENT, handleThemeChange);
        window.removeEventListener("storage", handleStorageChange);
    };
}
