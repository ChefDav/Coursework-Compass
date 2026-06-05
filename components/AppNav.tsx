"use client";

import { usePathname } from "next/navigation";

const navItems = [
    {
        label: "Main menu",
        href: "/",
    },
    {
        label: "Dashboard",
        href: "/dashboard",
    },
    {
        label: "Projects",
        href: "/projects",
    },
    {
        label: "Today",
        href: "/today",
    },
    {
        label: "New Project",
        href: "/projects/new",
    },
    {
        label: "Updates",
        href: "/updates",
    },
];

const storageKeysToClear = [
    "coursework-compass-projects",
    "coursework-compass-plans",
    "coursework-compass-project-plans",
    "courseworkCompassProjects",
    "courseworkCompassProjectPlans",
    "generatedProjectPlans",
    "projectPlans",
];

function isActivePath(pathname: string, href: string) {
    if (href === "/") {
        return pathname === "/";
    }

    if (href === "/projects") {
        return pathname === "/projects";
    }

    return pathname === href || pathname.startsWith(`${href}/`);
}

function clearCourseworkCompassData() {
    const confirmed = window.confirm(
        "Reset all local Coursework Compass data in this browser? This will remove saved projects and tasks.",
    );

    if (!confirmed) {
        return;
    }

    storageKeysToClear.forEach((key) => {
        window.localStorage.removeItem(key);
    });

    Object.keys(window.localStorage).forEach((key) => {
        const normalisedKey = key.toLowerCase();

        if (
            normalisedKey.includes("coursework-compass") ||
            normalisedKey.includes("courseworkcompass")
        ) {
            window.localStorage.removeItem(key);
        }
    });

    window.location.href = "/";
}

export default function AppNav() {
    const pathname = usePathname();

    return (
        <header className="mb-10 rounded-[2rem] border border-slate-800 bg-slate-900/80 p-4 shadow-2xl shadow-cyan-950/20 sm:p-5">
            <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                <a href="/" className="group">
                    <p className="text-xl font-black tracking-tight text-white transition group-hover:text-cyan-300">
                        Coursework Compass
                    </p>
                    <p className="mt-1 text-xs font-bold uppercase tracking-[0.2em] text-slate-500 transition group-hover:text-cyan-400">
                        v1.2 Student Testing Polish
                    </p>
                </a>

                <nav className="flex flex-wrap gap-2">
                    {navItems.map((item) => {
                        const isActive = isActivePath(pathname, item.href);

                        return (
                            <a
                                key={item.href}
                                href={item.href}
                                className={`rounded-2xl px-4 py-3 text-sm font-bold transition ${
                                    isActive
                                        ? "bg-cyan-400 text-slate-950"
                                        : item.href === "/"
                                            ? "border border-emerald-400/30 bg-emerald-400/10 text-emerald-300 hover:bg-emerald-400/20"
                                            : "border border-slate-800 bg-slate-950/70 text-slate-300 hover:border-cyan-400 hover:text-cyan-300"
                                }`}
                            >
                                {item.label}
                            </a>
                        );
                    })}

                    <button
                        type="button"
                        onClick={clearCourseworkCompassData}
                        className="rounded-2xl border border-red-400/30 bg-red-400/10 px-4 py-3 text-sm font-bold text-red-300 transition hover:bg-red-400/20"
                    >
                        Reset data
                    </button>
                </nav>
            </div>
        </header>
    );
}