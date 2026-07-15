"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Job } from "@/lib/types/job";

export function AnimatedJobList({ jobs }: { jobs: Job[] }) {
  return (
    <div className="grid gap-3">
      {jobs.map((job, i) => (
        <motion.div
          key={job.id}
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ delay: i * 0.05, duration: 0.4, ease: "easeOut" }}
        >
          <Link
            href={`/jobs/${job.id}`}
            className="group flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-5 rounded-2xl bg-white border border-line hover:border-signal/40 hover:shadow-md transition-all duration-300"
          >
            <div className="min-w-0">
              <h3 className="text-ink font-semibold text-base group-hover:text-signal transition-colors truncate">
                {job.title}
              </h3>
              <p className="text-muted text-sm mt-1">
                {job.company}
                {job.location && <span> · {job.location}</span>}
              </p>
            </div>

            <Badge
              variant="outline"
              className="font-mono text-xs text-muted border-line rounded-full shrink-0 self-start sm:self-center"
            >
              via {job.source}
            </Badge>
          </Link>
        </motion.div>
      ))}
    </div>
  );
}