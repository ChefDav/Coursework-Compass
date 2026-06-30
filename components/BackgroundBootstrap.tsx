"use client";

import { useEffect } from "react";
import {
    applyBackgroundToDocument,
    getStoredBackground,
    listenForBackgroundChange,
} from "@/lib/background";

export default function BackgroundBootstrap() {
    useEffect(() => {
        applyBackgroundToDocument(getStoredBackground());

        return listenForBackgroundChange((background) => {
            applyBackgroundToDocument(background);
        });
    }, []);

    return null;
}
