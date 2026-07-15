"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

import { useAuth } from "@/lib/context/AuthContext";
export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, loading, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && (!user || user.role !== "ADMIN")) {
      router.push("/login");
    }
  }, [user, loading, router]);

  if (loading || !user || user.role !== "ADMIN") {
    return <p className="font-mono text-sm text-muted p-12">Checking access...</p>;
  }

  return (
    <div className="min-h-screen">
      <div className="border-b border-line px-6 md:px-12 py-4 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <span className="font-mono text-xs uppercase tracking-wide text-muted">Admin</span>
          <nav className="flex gap-4 font-mono text-sm">
            <Link href="/admin" className="text-ink hover:underline underline-offset-4">Overview</Link>
            <Link href="/admin/sources" className="text-ink hover:underline underline-offset-4">Sources</Link>
          </nav>
        </div>
        <button onClick={logout} className="font-mono text-xs text-muted hover:text-rust transition-colors">
          Log out
        </button>
      </div>
      {children}
    </div>
  );
}