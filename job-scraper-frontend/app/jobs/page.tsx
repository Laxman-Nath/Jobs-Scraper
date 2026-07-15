"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getJobs } from "@/lib/api/jobs";

import Pagination from "../components/Pagination";
import { JobSearchInput } from "../components/JobSearchInput";
import { JobList } from "../components/JobList";

export default function JobsPage() {
  const [search, setSearch] = useState("");
  const [pageNo, setPageNo] = useState(1);
  const pageSize = 20;

  const { data: jobsPage, isLoading, isError } = useQuery({
    queryKey: ["jobs", pageNo],
    queryFn: () => getJobs(pageNo, pageSize),
  });

  const filteredJobs = jobsPage?.content.filter((job) => {
    const query = search.toLowerCase();
    return (
      job.title.toLowerCase().includes(query) ||
      job.company.toLowerCase().includes(query) ||
      (job.location ?? "").toLowerCase().includes(query)
    );
  }) ?? [];

  return (
    <main className="min-h-screen">
      <header className="px-6 md:px-12 pt-14 pb-8">
        <div className="max-w-5xl mx-auto">
          <h1 className="font-display font-semibold text-4xl text-ink mb-6">All jobs</h1>
          <JobSearchInput value={search} onChange={setSearch} className="max-w-xl" />
          {jobsPage && (
            <p className="font-mono text-xs text-muted mt-3">{jobsPage.totalElements} jobs tracked</p>
          )}
        </div>
      </header>

      <section className="max-w-5xl mx-auto px-6 md:px-12 pb-16">
        {isLoading && <JobListSkeleton />}

        {isError && (
          <div className="border border-dashed border-rust/30 rounded-2xl py-16 text-center bg-rust/5">
            <p className="text-rust font-mono text-sm">Couldn't load jobs. Is the backend running?</p>
          </div>
        )}

        {!isLoading && !isError && (
          <>
            <JobList jobs={filteredJobs} emptyMessage="No jobs match your search." />
            {jobsPage && (
              <div className="mt-8">
                <Pagination
                  page={jobsPage.page}
                  totalPages={jobsPage.totalPages}
                  onPageChange={(newPageNo) => setPageNo(newPageNo)}
                />
              </div>
            )}
          </>
        )}
      </section>
    </main>
  );
}

function JobListSkeleton() {
  return (
    <div className="grid gap-3">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="p-5 rounded-2xl bg-white border border-line animate-pulse">
          <div className="h-4 w-2/3 bg-line rounded mb-2" />
          <div className="h-3 w-1/3 bg-line rounded" />
        </div>
      ))}
    </div>
  );
}