"use client";

import { useQuery } from "@tanstack/react-query";
import { Sparkles } from "lucide-react";
import { getRecommendations } from "@/lib/api/profile";
import { JobList } from "@/components/jobs/JobList";

export function RecommendedJobs({ enabled }: { enabled: boolean }) {
  const { data: recommendations, isLoading } = useQuery({
    queryKey: ["recommendations"],
    queryFn: getRecommendations,
    enabled,
  });

  return (
    <div>
      <div className="flex items-center gap-2 mb-6">
        <Sparkles className="h-4 w-4 text-signal" />
        <h2 className="font-display font-semibold text-xl text-ink">Recommended for you</h2>
      </div>

      {isLoading ? (
        <div className="grid gap-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-20 rounded-2xl bg-white border border-line animate-pulse" />
          ))}
        </div>
      ) : (
        <JobList
          jobs={recommendations ?? []}
          emptyMessage="Complete your profile to see personalized recommendations."
          linkPrefix="/jobs"
        />
      )}
    </div>
  );
}