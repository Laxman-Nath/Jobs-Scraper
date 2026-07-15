import { JobCard } from "./JobCard";
import { Job } from "@/lib/types/job";

type JobListProps = {
  jobs: Job[];
  emptyMessage?: string;
};

export function JobList({ jobs, emptyMessage = "No jobs found." }: JobListProps) {
  if (jobs.length === 0) {
    return (
      <div className="border border-dashed border-line rounded-2xl py-16 text-center bg-white/40">
        <p className="text-muted font-mono text-sm">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="grid gap-3">
      {jobs.map((job, i) => (
        <JobCard key={job.id} job={job} index={i} />
      ))}
    </div>
  );
}