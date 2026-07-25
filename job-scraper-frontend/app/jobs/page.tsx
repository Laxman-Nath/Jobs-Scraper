"use client";

import { useState, Suspense } from "react";
import { useQuery } from "@tanstack/react-query";
import { useRouter, useSearchParams } from "next/navigation";
import { useDebouncedCallback } from "use-debounce";
import { getJobs } from "@/lib/api/jobs";

import Pagination from "../../components/common/Pagination";
import { JobSearchInput } from "../../components/auth/JobSearchInput";
import { JobList } from "../../components/jobs/JobList";

export default function JobsPage() {
  return (
    <Suspense fallback={<div className="p-12 font-mono text-sm text-muted">Loading...</div>}>
      <JobsPageContent />
    </Suspense>
  );
}

function JobsPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // These are read fresh from the URL on every render — no separate state, nothing to sync
  const search = searchParams.get("q") ?? "";
  const pageNo = Number(searchParams.get("pageNo") ?? "1");
  const pageSize =10;
  console.log("Search params:", { search, pageNo, pageSize });
  // Only the input's displayed text needs local state, for instant typing feedback
  const [searchInput, setSearchInput] = useState(search);

  const debouncedUpdateUrl = useDebouncedCallback((value: string) => {
    const params = new URLSearchParams();
    if (value) params.set("q", value);
    router.replace(`/jobs?${params.toString()}`);
  }, 400);

  function handleSearchChange(value: string) {
    setSearchInput(value);
    debouncedUpdateUrl(value);
  }

  function handlePageChange(newPageNo: number) {
    const params = new URLSearchParams();
    if (search) params.set("q", search);
    params.set("pageNo", String(newPageNo));
    router.replace(`/jobs?${params.toString()}`);
  }

  const { data: jobsPage, isLoading, isError } = useQuery({
    queryKey: ["jobs", pageNo, search],
    queryFn: () => getJobs(pageNo, pageSize, search),
  });
  console.log("jobsPage", jobsPage);

  return (
    <main className="min-h-screen">
      <header className="px-6 md:px-12 pt-14 pb-8">
        <div className="max-w-5xl mx-auto">
          <h1 className="font-display font-semibold text-4xl text-ink mb-6">All jobs</h1>
          <JobSearchInput value={searchInput} onChange={handleSearchChange} className="max-w-xl" />
          {jobsPage && (
            <p className="font-mono text-xs text-muted mt-3">
              {jobsPage.totalElements} {search ? "matching" : "total"} jobs
            </p>
          )}
        </div>
      </header>

      <section className="max-w-5xl mx-auto px-6 md:px-12 pb-16">
        {isLoading && <JobListSkeleton />}
        {isError && (
          <div className="border border-dashed border-rust/30 rounded-2xl py-16 text-center bg-rust/5">
            <p className="text-rust font-mono text-sm">Couldn't load jobs.</p>
          </div>
        )}
        {!isLoading && !isError && jobsPage && (
          <>
            <JobList
              jobs={jobsPage.content}
              emptyMessage={search ? "No jobs match your search." : "No jobs found yet."}
            />
            <div className="mt-8">
              <Pagination page={jobsPage.page} totalPages={jobsPage.totalPages} onPageChange={handlePageChange} />
            </div>
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