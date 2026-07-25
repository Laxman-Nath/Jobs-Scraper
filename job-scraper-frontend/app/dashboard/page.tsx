"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Mail, User as UserIcon } from "lucide-react";
import { useAuth } from "@/lib/context/AuthContext";
import { RecommendedJobs } from "@/components/jobs/RecommendedJobs";
import { getProfile, Profile } from "@/lib/api/profile";

export default function DashboardPage() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);

  useEffect(() => {
    if (user) {
      getProfile()
        .then(setProfile)
        .catch((error) => {
          console.error("Error fetching profile:", error);
        });
    }
  }, [user]);

  const needsVerification = !!profile && !profile.emailVerified;
  const needsProfileCompletion = !!profile && !profile.profileComplete;

  return (
    <main className="max-w-5xl mx-auto px-6 md:px-12 py-12">
      <div className="mb-10 flex items-start justify-between">
        <div>
          <h1 className="font-display font-semibold text-3xl text-ink mb-1">
            Welcome back
          </h1>
          <p className="text-muted text-sm">{user?.email}</p>
        </div>
        <Link
          href="/companies"
          className="font-mono text-xs uppercase tracking-wide border border-line px-3 py-1.5 rounded-full hover:bg-ink hover:text-base transition-colors shrink-0"
        >
          Browse companies
        </Link>
      </div>

      {/* Email verification banner */}
      {needsVerification && (
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
            href={`/verify-email?email=${encodeURIComponent(user?.email || "")}`}
            className="font-mono text-xs uppercase tracking-wide border border-signal px-3 py-1.5 rounded-full hover:bg-signal hover:text-base transition-colors shrink-0"
          >
            Verify now
          </Link>
        </motion.div>
      )}

      {/* Profile incomplete prompt */}
      {needsProfileCompletion && (
        <motion.div
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
        </motion.div>
      )}

      <RecommendedJobs enabled={!!user} />
    </main>
  );
}