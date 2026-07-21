"use client";

import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { getRecommendations } from "@/lib/api/profile";
import Link from "next/link";
import { Mail, User as UserIcon, Sparkles } from "lucide-react";
import { useAuth } from "@/lib/context/AuthContext";
import { JobList } from "../../components/jobs/JobList";
import { User } from "@/lib/types/auth";

export default function DashboardPage() {
  const { user } = useAuth();
  console.log('User :', user);

  const { data: recommendations, isLoading } = useQuery({
    queryKey: ["recommendations"],
    queryFn: getRecommendations,
    enabled: !!user,
  });

  return (
    <main className="max-w-5xl mx-auto px-6 md:px-12 py-12">
      <div className="mb-10">
        <h1 className="font-display font-semibold text-3xl text-ink mb-1">
          Welcome back
        </h1>
        <p className="text-muted text-sm">{user?.email}</p>
      </div>

      {/* Email verification banner */}
   {user && !(user as User).emailVerified && (
  <motion.div
    initial={{ opacity: 0, y: -8 }}
    animate={{ opacity: 1, y: 0 }}
    className="flex items-center gap-3 bg-signal/5 border border-signal/20 rounded-2xl px-5 py-4 mb-6"
  >
    <Mail className="h-5 w-5 text-signal shrink-0" />
    <div className="flex-1">
      <p className="text-sm text-ink font-medium">Verify your email</p>
      <p className="text-muted text-xs mt-0.5">
        Check your inbox to confirm your address and start receiving job match alerts.
      </p>
    </div>
    <Link
      href={`/verify-email?email=${encodeURIComponent(user.email)}`}
      className="font-mono text-xs uppercase tracking-wide border border-signal px-3 py-1.5 rounded-full hover:bg-signal hover:text-base transition-colors shrink-0"
    >
      Verify now
    </Link>
  </motion.div>
)}
      {/* Profile incomplete prompt */}
   { user && !(user as User).profileComplete &&  <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
        className="flex items-center gap-3 bg-white border border-line rounded-2xl px-5 py-4 mb-10"
      >
        <UserIcon className="h-5 w-5 text-muted shrink-0" />
        <div className="flex-1">
          <p className="text-sm text-ink font-medium">Complete your profile</p>
          <p className="text-muted text-xs mt-0.5">
            Add your preferred job titles and skills to get better recommendations.
          </p>
        </div>
        <Link
          href="/dashboard/profile"
          className="font-mono text-xs uppercase tracking-wide border border-ink px-3 py-1.5 rounded-full hover:bg-ink hover:text-base transition-colors shrink-0"
        >
          Edit profile
        </Link>
      </motion.div>}

      {/* Recommendations */}
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
    </main>
  );
}