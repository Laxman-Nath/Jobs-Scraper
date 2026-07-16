"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowRight } from "lucide-react";

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.5, ease: "easeOut" as const },
  }),
};

export function AnimatedHero({ totalJobs }: { totalJobs: number }) {
  const [query, setQuery] = useState("");
  const router = useRouter();

  function handleSearch() {
    router.push(query.trim() ? `/jobs?q=${encodeURIComponent(query.trim())}` : "/jobs");
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter") handleSearch();
  }

  return (
    <section className="px-6 md:px-12 pt-20 md:pt-28 pb-16">
      <div className="max-w-5xl mx-auto">
        <motion.div
          custom={0}
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          className="inline-flex items-center gap-2 border border-line rounded-full px-3 py-1 mb-8"
        >
          <motion.span
            className="w-1.5 h-1.5 rounded-full bg-signal"
            animate={{ opacity: [1, 0.3, 1] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          />
          <span className="font-mono text-xs text-muted">Refreshed every 30 minutes</span>
        </motion.div>

        <motion.h1
          custom={1}
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          className="font-display font-semibold text-5xl md:text-7xl leading-[1.02] text-ink max-w-3xl tracking-tight"
        >
          Jobs that are<br />
          <span className="text-signal">actually</span> still open.
        </motion.h1>

        <motion.p
          custom={2}
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          className="text-muted text-lg md:text-xl mt-6 max-w-xl leading-relaxed"
        >
          We track every listing's history — when it appeared, where else it's posted,
          and whether it's still real. No ghost jobs, no stale postings.
        </motion.p>

        <motion.div
          custom={3}
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          className="flex flex-col sm:flex-row gap-3 mt-10 max-w-xl"
        >
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Search by title, company, or location..."
            className="h-14 bg-white border-line text-black rounded-xl px-5"
          />
          <Button
            onClick={handleSearch}
            size="lg"
            className="h-14 px-8 rounded-xl bg-ink cursor-pointer hover:bg-ink/90 text-white group"
          >
            Search
            <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Button>
        </motion.div>

        <motion.div
          custom={4}
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          className="flex gap-10 mt-14 font-mono"
        >
          <div>
            <CountUp target={totalJobs} />
            <span className="text-muted text-sm mt-2 block">jobs tracked</span>
          </div>
          <div>
            <span className="text-3xl md:text-4xl text-ink font-semibold block leading-none">4</span>
            <span className="text-muted text-sm mt-2 block">sources monitored</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function CountUp({ target }: { target: number }) {
  return (
    <motion.span
      className="text-3xl md:text-4xl text-ink font-semibold block leading-none"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.5 }}
    >
      {target}
    </motion.span>
  );
}