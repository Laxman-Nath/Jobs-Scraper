"use client";

import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import Link from "next/link";
import { getJobById } from "@/lib/api/jobs";
import { getErrorStatus, getErrorMessage } from "@/lib/types/error";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowUpRight, FileQuestion, MapPin, Building2 } from "lucide-react";

type JobDetailContentProps = {
  jobId: number;
  backHref: string;
  backLabel: string;
};

export function JobDetailContent({ jobId, backHref, backLabel }: JobDetailContentProps) {
  const {
    data: job,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["job", jobId],
    queryFn: () => getJobById(jobId),
    retry: (failureCount, err) => getErrorStatus(err) !== 404 && failureCount < 2,
  });

  if (isLoading) {
    return (
      <div className="max-w-3xl mx-auto px-6 md:px-12 py-16">
        <div className="h-4 w-24 bg-line rounded animate-pulse mb-8" />
        <div className="h-10 w-2/3 bg-line rounded animate-pulse mb-3" />
        <div className="h-4 w-1/3 bg-line rounded animate-pulse mb-10" />
        <div className="space-y-3">
          <div className="h-4 w-full bg-line rounded animate-pulse" />
          <div className="h-4 w-full bg-line rounded animate-pulse" />
          <div className="h-4 w-2/3 bg-line rounded animate-pulse" />
        </div>
      </div>
    );
  }

  if (error) {
    const status = getErrorStatus(error);
    return (
      <div className="min-h-[70vh] flex items-center justify-center px-6">
        <div className="text-center max-w-sm">
          <div className="w-12 h-12 rounded-2xl bg-ink/5 flex items-center justify-center mx-auto mb-4">
            <FileQuestion className="h-5 w-5 text-muted" strokeWidth={2} />
          </div>
          <h2 className="font-display font-semibold text-xl text-ink mb-2">
            {status === 404 ? "Job not found" : "Something went wrong"}
          </h2>
          <p className="text-muted text-sm mb-6">
            {status === 404
              ? "This listing may have been removed, or the link is incorrect."
              : getErrorMessage(error)}
          </p>
          <Link
            href={backHref}
            className="inline-flex items-center gap-1.5 text-ink font-medium text-sm hover:text-signal transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            {backLabel}
          </Link>
        </div>
      </div>
    );
  }

  if (!job) return null;

  return (
    <div className="max-w-3xl mx-auto px-6 md:px-12 py-16">
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <Link
          href={backHref}
          className="inline-flex items-center gap-1.5 text-muted hover:text-ink transition-colors text-sm font-medium mb-8"
        >
          <ArrowLeft className="h-4 w-4" />
          {backLabel}
        </Link>

        <h1 className="font-display font-semibold text-3xl md:text-4xl text-ink leading-tight mb-4">
          {job.title}
        </h1>

        <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-muted text-sm mb-6">
          <span className="flex items-center gap-1.5">
            <Building2 className="h-4 w-4" />
            {job.company}
          </span>
          {job.location && (
            <span className="flex items-center gap-1.5">
              <MapPin className="h-4 w-4" />
              {job.location}
            </span>
          )}
        </div>

        <div className="flex items-center gap-3 mb-10">
          <Badge variant="outline" className="rounded-full text-xs border-line text-muted">
            via {job.source}
          </Badge>
          {job.postedAt && (
            <span className="font-mono text-xs text-muted">Posted {job.postedAt}</span>
          )}
        </div>

        {job.description ? (
          <div className="text-ink leading-relaxed whitespace-pre-line mb-12 text-[15px]">
            {job.description}
          </div>
        ) : (
          <p className="text-muted text-sm mb-12 italic">No description available for this listing.</p>
        )}

        <Button asChild size="lg" className="h-12 px-8 rounded-xl bg-ink text-base hover:bg-ink/90">
          <a href={job.url} target="_blank" rel="noopener noreferrer">
            View original posting
            <ArrowUpRight className="ml-2 h-4 w-4" />
          </a>
        </Button>
      </motion.div>
    </div>
  );
}