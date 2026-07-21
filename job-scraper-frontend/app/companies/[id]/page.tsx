"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { getJobsBySource } from "@/lib/api/jobs";
import { ArrowLeft } from "lucide-react";
import Pagination from "@/components/common/Pagination";
import { JobList } from "@/components/jobs/JobList";

export default function SourceDetailPage() {
  const params = useParams();
  const sourceId = Number(params.id);
  const [pageNo, setPageNo] = useState(1);

  const { data: jobsPage, isLoading } = useQuery({
    queryKey: ["jobs-by-source", sourceId, pageNo],
    queryFn: () => getJobsBySource(sourceId, pageNo, 20),
  });

  function handlePageChange(page: number) {
    setPageNo(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <main className="px-6 md:px-12 py-10 max-w-4xl">
      <Link
        href="/companies"
        className="inline-flex items-center gap-1.5 text-muted hover:text-ink transition-colors text-sm font-medium mb-6"
      >
        <ArrowLeft className="h-4 w-4" />
        All companies
      </Link>

      <h1 className="font-display font-semibold text-3xl text-ink mb-1">
        Jobs from this company
      </h1>
      {jobsPage && (
        <p className="text-muted text-sm mb-8">
          {jobsPage.totalElements} jobs found
        </p>
      )}

      {isLoading ? (
        <div className="grid gap-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="h-20 rounded-2xl bg-white border border-line animate-pulse"
            />
          ))}
        </div>
      ) : (
        <>
          <JobList
            jobs={jobsPage?.content ?? []}
            emptyMessage="No jobs found for this company yet."
            linkPrefix="/jobs"
          />
          {jobsPage && (
            <div className="mt-8">
              <Pagination
                page={jobsPage.page}
                totalPages={jobsPage.totalPages}
                onPageChange={handlePageChange}
              />
            </div>
          )}
        </>
      )}
    </main>
  );
}