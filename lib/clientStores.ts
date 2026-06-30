"use client";

import { useSyncExternalStore } from "react";
import {
    getStoredLanguage,
    listenForLanguageChange,
    type Language,
} from "@/lib/i18n";
import {
    findCompletedPlanWaitingForPrompt,
    listenForProjectPlanUpdates,
    loadProjectPlans,
    PROJECT_STORAGE_KEYS,
    type GeneratedProjectPlan,
} from "@/lib/localStorage";

const EMPTY_PROJECT_PLANS: GeneratedProjectPlan[] = [];
const NO_COMPLETED_PLAN: GeneratedProjectPlan | null = null;

let cachedProjectSignature = "";
let cachedProjectPlans: GeneratedProjectPlan[] = EMPTY_PROJECT_PLANS;

function subscribeToMount(callback: () => void) {
    callback();
    return () => {};
}

function getMountedSnapshot() {
    return true;
}

function getServerMountedSnapshot() {
    return false;
}

function subscribeToLanguage(callback: () => void) {
    return listenForLanguageChange(callback);
}

function getServerLanguageSnapshot(): Language {
    return "en";
}

function readProjectStorageSignature() {
    if (typeof window === "undefined") {
        return "";
    }

    return PROJECT_STORAGE_KEYS.map((key) => {
        return `${key}:${window.localStorage.getItem(key) ?? ""}`;
    }).join("\n");
}

function getProjectPlansSnapshot() {
    if (typeof window === "undefined") {
        return EMPTY_PROJECT_PLANS;
    }

    const nextSignature = readProjectStorageSignature();

    if (nextSignature !== cachedProjectSignature) {
        cachedProjectSignature = nextSignature;
        cachedProjectPlans = loadProjectPlans();
    }

    return cachedProjectPlans;
}

function getServerProjectPlansSnapshot() {
    return EMPTY_PROJECT_PLANS;
}

function getCompletedPlanSnapshot() {
    return findCompletedPlanWaitingForPrompt() ?? NO_COMPLETED_PLAN;
}

function getServerCompletedPlanSnapshot() {
    return NO_COMPLETED_PLAN;
}

export function useHasMounted() {
    return useSyncExternalStore(
        subscribeToMount,
        getMountedSnapshot,
        getServerMountedSnapshot,
    );
}

export function useStoredLanguage() {
    return useSyncExternalStore(
        subscribeToLanguage,
        getStoredLanguage,
        getServerLanguageSnapshot,
    );
}

export function useProjectPlans() {
    return useSyncExternalStore(
        listenForProjectPlanUpdates,
        getProjectPlansSnapshot,
        getServerProjectPlansSnapshot,
    );
}

export function useCompletedPlanWaitingForPrompt() {
    return useSyncExternalStore(
        listenForProjectPlanUpdates,
        getCompletedPlanSnapshot,
        getServerCompletedPlanSnapshot,
    );
}
