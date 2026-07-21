"use client";

import { JobDetailContent } from "@/components/jobs/JobDetailContent";
import { useParams } from "next/navigation";

export default function JobDetailPage() {
  const params = useParams();
  const id = Number(params.id);

  return <JobDetailContent jobId={id} backHref="/jobs" backLabel="All jobs" />;
}