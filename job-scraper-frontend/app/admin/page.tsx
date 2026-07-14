"use client";

import { useQuery } from "@tanstack/react-query";
import { getStats } from "@/lib/api/admin";

export default function AdminOverviewPage() {
  const { data: stats, isLoading } = useQuery({
    queryKey: ["admin-stats"],
    queryFn: getStats,
    refetchInterval: 30000,
  });

  return (
    <main className="max-w-4xl mx-auto px-6 md:px-12 py-8">
      <h1 className="font-display text-3xl text-ink mb-8">Overview</h1>

      {isLoading ? (
        <p className="font-mono text-sm text-muted">Loading...</p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <StatCard label="Total jobs" value={stats?.totalJobs ?? 0} />
          <StatCard label="Total sources" value={stats?.totalSources ?? 0} />
          <StatCard label="Active" value={stats?.activeSources ?? 0} accent="signal" />
          <StatCard label="Failing" value={stats?.failingSources ?? 0} accent="rust" />
        </div>
      )}
    </main>
  );
}

function StatCard({
  label,
  value,
  accent,
}: {
  label: string;
  value: number;
  accent?: "signal" | "rust";
}) {
  return (
    <div className="border border-line p-5">
      <p
        className={`font-mono text-3xl ${
          accent === "signal" ? "text-signal" : accent === "rust" ? "text-rust" : "text-ink"
        }`}
      >
        {value}
      </p>
      <p className="text-muted text-sm mt-1">{label}</p>
    </div>
  );
}