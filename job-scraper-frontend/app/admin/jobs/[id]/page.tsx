"use client";

import { JobDetailContent } from "@/app/components/JobDetailContent";
import { useParams } from "next/navigation";

export default function AdminJobDetailPage() {
  const params = useParams();
  const id = Number(params.id);

  return <JobDetailContent jobId={id} backHref="/admin/sources" backLabel="Back to sources" />;
}