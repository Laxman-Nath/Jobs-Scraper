"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Briefcase } from "lucide-react";

type AuthCardProps = {
  title: string;
  subtitle: string;
  children: React.ReactNode;
  footerText: string;
  footerLinkText: string;
  footerLinkHref: string;
};

export function AuthCard({
  title,
  subtitle,
  children,
  footerText,
  footerLinkText,
  footerLinkHref,
}: AuthCardProps) {
  return (
    <main className="min-h-[85vh] flex items-center justify-center px-6">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="w-full max-w-sm"
      >
        <div className="flex items-center gap-2 mb-8">
          <div className="w-9 h-9 rounded-lg bg-ink flex items-center justify-center">
            <Briefcase className="h-4 w-4 text-base" strokeWidth={2} />
          </div>
          <span className="font-display font-semibold text-lg text-ink">JobFinder</span>
        </div>

        <h1 className="font-display font-semibold text-3xl text-ink mb-1">{title}</h1>
        <p className="text-muted text-sm mb-8">{subtitle}</p>

        {children}

        <p className="text-muted text-sm mt-6 text-center">
          {footerText}{" "}
          <Link href={footerLinkHref} className="text-ink font-medium hover:text-signal transition-colors">
            {footerLinkText}
          </Link>
        </p>
      </motion.div>
    </main>
  );
}