"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Briefcase, LogOut } from "lucide-react";
import { useAuth } from "@/lib/context/AuthContext";
import { usePathname } from "next/navigation";
import { Logo } from "./Logo";





export function Header() {
  const { user, logout, loading } = useAuth();
  const pathname = usePathname();

  const links = [
    ...(user?.role === "ADMIN" ? [{ href: "/admin", label: "Admin" }] : []),
  ];

  return (
    <header className="border-b border-line bg-base/90 backdrop-blur sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-6 md:px-12 h-16 flex items-center justify-between">
 <Link href="/" className="flex items-center gap-2 shrink-0">
  <Logo size="sm" />
</Link>
        

        <nav className="hidden md:flex items-center gap-1">
          {links.map((link) => {
            const isActive = pathname === link.href || pathname.startsWith(link.href + "/");
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`relative px-4 py-2 text-sm font-medium rounded-full transition-colors ${
                  isActive
                    ? "text-ink bg-ink/[0.06]"
                    : "text-muted hover:text-ink hover:bg-ink/[0.04]"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          {loading ? (
            <div className="h-9 w-24" />
          ) : user ? (
            <div className="flex items-center gap-3">
              <span className="hidden sm:inline text-sm text-muted">{user.email}</span>
              <button
                onClick={logout}
                className="flex items-center gap-1.5 text-sm font-medium text-muted hover:text-rust transition-colors px-3 py-2 rounded-full hover:bg-rust/5"
              >
                <LogOut className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Log out</span>
              </button>
            </div>
          ) : (
            <>
              <Button
                asChild
                variant="ghost"
                className="rounded-full text-sm font-medium text-ink hover:bg-ink/5"
              >
                <Link href="/login">Log in</Link>
              </Button>
              <Button
                asChild
                className="rounded-full text-sm font-medium bg-ink text-base hover:bg-ink/90 px-5"
              >
                <Link href="/register">Sign up</Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}