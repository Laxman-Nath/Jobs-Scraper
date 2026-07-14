import Link from "next/link";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen">
      <div className="border-b border-line px-6 md:px-12 py-4 flex items-center gap-6">
        <span className="font-mono text-xs uppercase tracking-wide text-muted">Admin</span>
        <nav className="flex gap-4 font-mono text-sm">
          <Link href="/admin" className="text-ink hover:underline underline-offset-4">
            Overview
          </Link>
          <Link href="/admin/sources" className="text-ink hover:underline underline-offset-4">
            Sources
          </Link>
        </nav>
      </div>
      {children}
    </div>
  );
}