"use client";

import { Bricolage_Grotesque, Plus_Jakarta_Sans, IBM_Plex_Mono } from "next/font/google";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import "./globals.css";
import Providers from "./providers";

import { useAuth } from "@/lib/context/AuthContext";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";

const bricolage = Bricolage_Grotesque({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["500", "600", "700"],
});

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-body",
  weight: ["400", "500", "600"],
});

const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  weight: ["400", "500"],
});

const PROTECTED_PREFIXES = ["/dashboard", "/admin"];

function AuthGuard({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  const isProtectedRoute = PROTECTED_PREFIXES.some((prefix) => pathname?.startsWith(prefix));

  useEffect(() => {
    if (isProtectedRoute && !loading && !user) {
      router.push("/login");
    }
  }, [isProtectedRoute, user, loading, router]);

  if (isProtectedRoute && (loading || !user)) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <p className="font-mono text-sm text-muted">Checking access...</p>
      </div>
    );
  }

  return <>{children}</>;
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdminRoute = pathname?.startsWith("/admin");

  return (
    <html lang="en">
      <body
        className={`${bricolage.variable} ${jakarta.variable} ${plexMono.variable} font-body bg-base text-ink flex flex-col min-h-screen`}
      >
        <Providers>
          {!isAdminRoute && <Header />}
          <div className="flex-1">
            <AuthGuard>{children}</AuthGuard>
          </div>
          {!isAdminRoute && <Footer />}
        </Providers>
      </body>
    </html>
  );
}