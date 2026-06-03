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
        <nav className="mb-12 flex items-center justify-between">
            <Link href="/" className="text-xl font-bold">
                Coursework Compass
            </Link>

            <div className="flex gap-4 text-sm text-slate-300">
                {navItems.map((item) => {
                    const isActive = pathname === item.href;

                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={isActive ? "text-cyan-300" : "hover:text-white"}
                        >
                            {item.label}
                        </Link>
                    );
                })}
            </div>
        </nav>
    );
}