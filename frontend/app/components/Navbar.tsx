"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ShieldCheck } from "lucide-react";
import { Show, SignInButton, SignUpButton, UserButton } from "@clerk/nextjs";

export default function Navbar() {
    const pathname = usePathname();

    const links = [
        { href: "/", label: "Home" },
        { href: "/scanner", label: "Scanner" },
        { href: "/admin", label: "Admin" },
    ];

    return (
        <nav className="flex items-center justify-between px-8 py-4 border-b border-zinc-800">
            <Link href="/" className="flex items-center gap-2 font-bold text-lg">
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-orange-500 text-white">
                    <ShieldCheck size={18} />
                </span>
                PhishGuard<span className="text-orange-500">AI</span>
            </Link>

            <div className="hidden gap-8 text-sm md:flex">
                {links.map(({ href, label }) => {
                    const active = pathname === href;
                    return (
                        <Link
                            key={href}
                            href={href}
                            className={`border-b-2 pb-1 transition-colors ${active
                                ? "border-orange-500 text-white"
                                : "border-transparent text-zinc-300"
                                }`}
                        >
                            {label}
                        </Link>
                    );
                })}
            </div>

            <div className="flex items-center gap-4">
                <Show when="signed-out">
                    <SignInButton fallbackRedirectUrl="/">
                        <button className="text-sm text-zinc-300">Sign in</button>
                    </SignInButton>
                    <SignUpButton fallbackRedirectUrl="/">
                        <button className="rounded-full bg-orange-500 px-4 py-2 text-sm font-medium text-white">
                            Get started
                        </button>
                    </SignUpButton>
                </Show>
                <Show when="signed-in">
                    <UserButton />
                </Show>
            </div>
        </nav>
    );
}