import Link from "next/link";
import { Briefcase } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-line mt-24">
      <div className="max-w-6xl mx-auto px-6 md:px-12 py-12">
        <div className="flex flex-col md:flex-row justify-between gap-8">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Briefcase className="h-4 w-4 text-signal" strokeWidth={1.5} />
              <span className="font-display text-base text-ink">JobFinder</span>
            </div>
            <p className="text-muted text-sm max-w-xs leading-relaxed">
              A live, deduplicated feed of job postings across company career pages,
              ATS platforms, and job boards.
            </p>
          </div>

          <div className="flex gap-16">
            <div>
              <p className="font-mono text-xs uppercase tracking-wide text-ink mb-3">Product</p>
              <ul className="space-y-2 font-mono text-xs text-muted">
                <li><Link href="/jobs" className="hover:text-ink transition-colors">All jobs</Link></li>
                <li><Link href="/register" className="hover:text-ink transition-colors">Sign up</Link></li>
              </ul>
            </div>
            <div>
              <p className="font-mono text-xs uppercase tracking-wide text-ink mb-3">Account</p>
              <ul className="space-y-2 font-mono text-xs text-muted">
                <li><Link href="/login" className="hover:text-ink transition-colors">Log in</Link></li>
              </ul>
            </div>
          </div>
        </div>

        <div className="border-t border-line mt-10 pt-6 flex flex-col sm:flex-row justify-between gap-2">
          <p className="font-mono text-xs text-muted">© {new Date().getFullYear()} JobFinder</p>
          <p className="font-mono text-xs text-muted">Built with real crawl data, updated every 30 minutes.</p>
        </div>
      </div>
    </footer>
  );
}