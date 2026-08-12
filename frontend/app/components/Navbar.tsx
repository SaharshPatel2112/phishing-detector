"use client";
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ShieldCheck, Menu, X } from "lucide-react";
import {
  Show,
  SignInButton,
  SignUpButton,
  UserButton,
  useUser,
} from "@clerk/nextjs";

const ADMIN_EMAIL = "1patelsaharsh2112@gmail.com";

export default function Navbar() {
  const pathname = usePathname();
  const { user } = useUser();
  const [menuOpen, setMenuOpen] = useState(false);

  const isAdmin =
    user?.primaryEmailAddress?.emailAddress?.toLowerCase() === ADMIN_EMAIL;

  const links = [
    { href: "/", label: "Home" },
    { href: "/scanner", label: "Scanner" },
    { href: "/reports", label: "Reports" },
    { href: "/about", label: "About" },
    ...(isAdmin ? [{ href: "/admin", label: "Admin" }] : []),
  ];

  return (
    <>
      <nav className="sticky top-0 z-40 flex items-center justify-between border-b border-zinc-800 bg-background/95 px-4 py-4 backdrop-blur md:px-8">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setMenuOpen(true)}
            className="text-zinc-300 md:hidden"
            aria-label="Open menu"
          >
            <Menu size={22} />
          </button>
          <Link href="/" className="flex items-center gap-2 font-bold text-lg">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-orange-500 text-white">
              <ShieldCheck size={18} />
            </span>
            PhishGuard<span className="text-orange-500">AI</span>
          </Link>
        </div>

        <div className="hidden gap-8 text-sm md:flex">
          {links.map(({ href, label }) => {
            const active = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                className={`border-b-2 pb-1 transition-colors ${
                  active
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

      {menuOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div
            className="absolute inset-0 bg-black/70"
            onClick={() => setMenuOpen(false)}
          />
          <div className="absolute left-0 top-0 h-full w-64 border-r border-border bg-card p-6">
            <div className="mb-8 flex items-center justify-between">
              <span className="flex items-center gap-2 font-bold">
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-orange-500 text-white">
                  <ShieldCheck size={18} />
                </span>
                PhishGuard<span className="text-orange-500">AI</span>
              </span>
              <button
                onClick={() => setMenuOpen(false)}
                aria-label="Close menu"
              >
                <X size={20} className="text-zinc-300" />
              </button>
            </div>
            <div className="flex flex-col gap-1">
              {links.map(({ href, label }) => {
                const active = pathname === href;
                return (
                  <Link
                    key={href}
                    href={href}
                    onClick={() => setMenuOpen(false)}
                    className={`rounded-lg px-3 py-3 text-sm font-medium ${
                      active
                        ? "bg-primary/10 text-primary"
                        : "text-zinc-300 hover:bg-background"
                    }`}
                  >
                    {label}
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
