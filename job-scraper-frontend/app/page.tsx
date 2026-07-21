import { getJobs } from "@/lib/api/jobs";
import Link from "next/link";

import { ArrowRight } from "lucide-react";
import { AnimatedHero } from "../components/layout/AnimatedHero";
import { JobList } from "../components/jobs/JobList";

export default async function Home() {
  const jobsPage = await getJobs(1, 6);
  const jobs = jobsPage.content;

  return (
    <main className="min-h-screen">
      <AnimatedHero totalJobs={jobsPage.totalElements} />

      <section className="max-w-5xl mx-auto px-6 md:px-12 pb-24">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-display font-semibold text-2xl text-ink">Recently posted</h2>
          <Link
            href="/jobs"
            className="font-mono text-xs uppercase tracking-wide text-muted hover:text-ink transition-colors flex items-center gap-1"
          >
            View all
            <ArrowRight className="h-3 w-3" />
          </Link>
        </div>

        <JobList jobs={jobs} emptyMessage="No jobs indexed yet — trigger a crawl from the admin panel." />
      </section>
    </main>
  );
}