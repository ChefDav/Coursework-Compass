"use client";

import { useEffect } from "react";
import {
    applyThemeToDocument,
    getStoredTheme,
    listenForThemeChange,
} from "@/lib/theme";

export default function ThemeBootstrap() {
    useEffect(() => {
        applyThemeToDocument(getStoredTheme());

        return listenForThemeChange((theme) => {
            applyThemeToDocument(theme);
        });
    }, []);

    return null;
}
