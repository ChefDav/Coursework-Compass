"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
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
];

export default function AppNav() {
    const pathname = usePathname();

    return (
        <nav className="mb-10 flex flex-col gap-5 sm:mb-12 sm:flex-row sm:items-center sm:justify-between">
            <Link href="/" className="text-xl font-black tracking-tight">
                Coursework Compass
            </Link>

            <div className="flex flex-wrap gap-3 text-sm text-slate-300">
                {navItems.map((item) => {
                    const isActive =
                        pathname === item.href || pathname.startsWith(`${item.href}/`);

                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`rounded-full px-3 py-2 font-bold transition ${
                                isActive
                                    ? "bg-cyan-400/10 text-cyan-300"
                                    : "hover:bg-slate-800 hover:text-white"
                            }`}
                        >
                            {item.label}
                        </Link>
                    );
                })}
            </div>
        </nav>
    );
}