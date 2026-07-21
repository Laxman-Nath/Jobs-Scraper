"use client";

import Pagination from "@/components/common/Pagination";
import { MuteCompanyToggle } from "@/components/source/MuteCompanyToggle";
import { getSourcesForUsers } from "@/lib/api/sources";
import { useAuth } from "@/lib/context/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";

import { Building2 } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function CompaniesPage() {
  const { user } = useAuth();
  const [pageNo, setPageNo] = useState(1);

  const { data: companiesPage, isLoading } = useQuery({
    queryKey: ["companies", pageNo],
    queryFn: () => getSourcesForUsers(pageNo, 10),
  });

  function handlePageChange(page: number) {
    setPageNo(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <main className="max-w-4xl mx-auto px-6 md:px-12 py-12">
      <h1 className="font-display font-semibold text-3xl text-ink mb-1">
        Companies
      </h1>
      <p className="text-muted text-sm mb-8">
        Every company we're tracking. Mute any you don't want notifications for.
      </p>

      {!user && (
        <div className="bg-ink/5 border border-line rounded-2xl px-5 py-4 mb-6">
          <p className="text-sm text-ink">
            <Link
              href="/login"
              className="font-medium underline underline-offset-4"
            >
              Log in
            </Link>{" "}
            to control notifications per company.
          </p>
        </div>
      )}

      {isLoading ? (
        <div className="grid gap-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className="h-16 rounded-2xl bg-white border border-line animate-pulse"
            />
          ))}
        </div>
      ) : companiesPage && companiesPage.content.length > 0 ? (
        <div className="grid gap-3">
          {companiesPage.content.map((company, i) => (
            <motion.div
              key={company.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.03 }}
              className="flex items-center justify-between gap-4 p-5 rounded-2xl bg-white border border-line"
            >
              <Link
                href={`/companies/${company.id}`}
                className="flex items-center gap-3 min-w-0 group flex-1"
              >
                <div className="w-9 h-9 rounded-lg bg-ink/5 flex items-center justify-center shrink-0">
                  <Building2 className="h-4 w-4 text-muted" />
                </div>
                <div className="min-w-0">
                  <p className="text-ink font-semibold truncate group-hover:text-signal transition-colors">
                    {company.companyName}
                  </p>
                </div>
              </Link>

              {user && <MuteCompanyToggle companyName={company.companyName} />}
            </motion.div>
          ))}

          <div className="mt-8">
            <Pagination
              page={companiesPage.page}
              totalPages={companiesPage.totalPages}
              onPageChange={handlePageChange}
            />
          </div>
        </div>
      ) : (
        <div className="border border-dashed border-line rounded-2xl py-16 text-center bg-white/40">
          <p className="text-muted font-mono text-sm">
            No companies tracked yet.
          </p>
        </div>
      )}
    </main>
  );
}