"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { LayoutDashboard, Database, LogOut, Briefcase, Menu, X } from "lucide-react";
import { useAuth } from "@/lib/context/AuthContext";

const navItems = [
  { href: "/admin", label: "Overview", icon: LayoutDashboard },
  { href: "/admin/sources", label: "Sources", icon: Database },
];

function NavLinks({ pathname }: { pathname: string }) {
  return (
    <>
      {navItems.map((item) => {
        const isActive = pathname === item.href;
        const Icon = item.icon;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
              isActive
                ? "bg-ink text-base"
                : "text-muted hover:text-ink hover:bg-ink/[0.04]"
            }`}
          >
            <Icon className="h-4 w-4" strokeWidth={2} />
            {item.label}
          </Link>
        );
      })}
    </>
  );
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, loading, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [prevPathname, setPrevPathname] = useState(pathname);

  useEffect(() => {
    if (!loading && (!user || user.role !== "ADMIN")) {
      router.push("/login");
    }
  }, [user, loading, router]);

  // Close mobile menu when route changes - adjusting state during render, not in an effect
  if (pathname !== prevPathname) {
    setPrevPathname(pathname);
    setMobileOpen(false);
  }

  if (loading || !user || user.role !== "ADMIN") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="font-mono text-sm text-muted">Checking access...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Mobile top bar - only visible below md */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-line bg-white/50 md:hidden">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-ink flex items-center justify-center">
            <Briefcase className="h-4 w-4 text-base" strokeWidth={2} />
          </div>
          <span className="font-display font-semibold text-ink">JobFinder</span>
        </Link>
        <button
          onClick={() => setMobileOpen((o) => !o)}
          aria-label="Toggle menu"
          aria-expanded={mobileOpen}
          className="flex h-9 w-9 items-center justify-center rounded-lg border border-line"
        >
          {mobileOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
        </button>
      </div>

      {/* Mobile dropdown menu */}
      {mobileOpen && (
        <div className="border-b border-line bg-white/50 px-3 py-3 space-y-1 md:hidden">
          <NavLinks pathname={pathname} />
          <div className="pt-2 mt-2 border-t border-line">
            <p className="px-3 py-1 text-sm text-ink font-medium truncate">{user.email}</p>
            <p className="px-3 font-mono text-xs text-muted">Administrator</p>
            <button
              onClick={logout}
              className="flex items-center gap-3 px-3 py-2.5 mt-1 rounded-xl text-sm font-medium text-muted hover:text-rust hover:bg-rust/5 transition-colors w-full"
            >
              <LogOut className="h-4 w-4" strokeWidth={2} />
              Log out
            </button>
          </div>
        </div>
      )}

      {/* Desktop sidebar - unchanged, still hidden on mobile */}
      <aside className="w-64 shrink-0 border-r border-line bg-white/50 hidden md:flex flex-col">
        <div className="px-6 py-5 border-b border-line">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-ink flex items-center justify-center">
              <Briefcase className="h-4 w-4 text-base" strokeWidth={2} />
            </div>
            <span className="font-display font-semibold text-ink">JobFinder</span>
          </Link>
          <span className="font-mono text-xs text-muted uppercase tracking-wide mt-1 block">
            Admin panel
          </span>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1">
          <NavLinks pathname={pathname} />
        </nav>

        <div className="px-3 py-4 border-t border-line">
          <div className="px-3 py-2 mb-2">
            <p className="text-sm text-ink font-medium truncate">{user.email}</p>
            <p className="font-mono text-xs text-muted">Administrator</p>
          </div>
          <button
            onClick={logout}
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-muted hover:text-rust hover:bg-rust/5 transition-colors w-full"
          >
            <LogOut className="h-4 w-4" strokeWidth={2} />
            Log out
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 min-w-0">{children}</div>
    </div>
  );
}