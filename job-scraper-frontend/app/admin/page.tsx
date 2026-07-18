"use client";

import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { getStats } from "@/lib/api/admin";
import { Briefcase, Database, CheckCircle2, AlertCircle } from "lucide-react";

export default function AdminOverviewPage() {
  const { data: stats, isLoading } = useQuery({
    queryKey: ["admin-stats"],
    queryFn: getStats,
    refetchInterval: 30000,
  });

  return (
    <main className="px-6 md:px-12 py-10 max-w-5xl">
      <h1 className="font-display font-semibold text-3xl text-ink mb-1">Overview</h1>
      <p className="text-muted text-sm mb-8">Live snapshot of your crawl pipeline.</p>

      {isLoading ? (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-28 rounded-2xl bg-white border border-line animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard label="Total jobs" value={stats?.totalJobs ?? 0} icon={Briefcase} />
          <StatCard label="Total sources" value={stats?.totalSources ?? 0} icon={Database} />
          <StatCard label="Active" value={stats?.activeSources ?? 0} icon={CheckCircle2} accent="signal" />
          <StatCard label="Failing" value={stats?.failingSources ?? 0} icon={AlertCircle} accent="rust" />
        </div>
      )}
    </main>
  );
}

function StatCard({
  label,
  value,
  icon: Icon,
  accent,
}: {
  label: string;
  value: number;
  icon: React.ElementType;
  accent?: "signal" | "rust";
}) {
  const accentColor = accent === "signal" ? "text-signal" : accent === "rust" ? "text-rust" : "text-ink";
  const accentBg = accent === "signal" ? "bg-signal/10" : accent === "rust" ? "bg-rust/10" : "bg-ink/5";

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="rounded-2xl bg-white border border-line p-5"
    >
      <div className={`w-9 h-9 rounded-lg ${accentBg} flex items-center justify-center mb-4`}>
        <Icon className={`h-4 w-4 ${accentColor}`} strokeWidth={2} />
      </div>
      <p className={`font-mono text-3xl font-semibold ${accentColor}`}>{value}</p>
      <p className="text-muted text-sm mt-1">{label}</p>
    </motion.div>
  );
}