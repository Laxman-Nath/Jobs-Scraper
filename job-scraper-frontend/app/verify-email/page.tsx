"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { verifyEmail, resendVerificationCode } from "@/lib/api/auth";
import { AuthCard } from "../../components/auth/AuthCard";

function VerifyEmailForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const email = searchParams.get("email") ?? "";

  const [code, setCode] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
  const [error, setError] = useState("");
  const [resendCooldown, setResendCooldown] = useState(0);
  const [resendStatus, setResendStatus] = useState<"idle" | "sending" | "sent">("idle");

  useEffect(() => {
    if (resendCooldown <= 0) return;
    const timer = setInterval(() => setResendCooldown((s) => s - 1), 1000);
    return () => clearInterval(timer);
  }, [resendCooldown]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    setError("");
    try {
      await verifyEmail(email, code);
      router.push("/dashboard");
    } catch (err: unknown) {
      console.error("Verify email error:", err);
      const error = err as { response?: { data?: { message?: string } } };
      setStatus("error");
      setError(error.response?.data?.message ?? "Invalid or expired code.");
    }
  }

  async function handleResend() {
    setResendStatus("sending");
    try {
      await resendVerificationCode(email);
      setResendStatus("sent");
      setResendCooldown(60);
    } catch (e: unknown) {
      console.error("Resend verification code error:", e);
      const error = e as { response?: { data?: { message?: string } } };
      setResendStatus("idle");
      setError(error.response?.data?.message ?? "Couldn't resend code. Try again shortly.");
    }
  }

  if (!email) {
    return (
      <AuthCard title="Verify your email" subtitle="Missing email address.">
        <div className="text-muted text-sm">
          We couldn't find an email to verify. Please{" "}
          <a href="/register" className="underline">sign up again</a> or{" "}
          <a href="/login" className="underline">log in</a>.
        </div>
      </AuthCard>
    );
  }

  return (
    <AuthCard
      title="Verify your email"
      subtitle={`Enter the 6-digit code we sent to ${email}`}
      footerText="Wrong email?"
      footerLinkText="Sign up again"
      footerLinkHref="/register"
    >
      <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
        <input
          value={code}
          onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
          inputMode="numeric"
          maxLength={6}
          autoFocus
          placeholder="000000"
          className="h-14 rounded-xl border border-line px-4 text-center text-2xl tracking-[0.5em] font-mono focus:outline-none focus:ring-2 focus:ring-ink/20"
        />

        {error && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-rust text-sm bg-rust/5 border border-rust/20 rounded-lg px-3 py-2"
          >
            {error}
          </motion.p>
        )}

        <Button
          type="submit"
          disabled={status === "loading" || code.length !== 6}
          className="h-12 rounded-xl bg-ink text-base hover:bg-ink/90 mt-2 group"
        >
          {status === "loading" ? "Verifying..." : "Verify email"}
          {status !== "loading" && (
            <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
          )}
        </Button>

        <button
          type="button"
          onClick={handleResend}
          disabled={resendCooldown > 0 || resendStatus === "sending"}
          className="text-muted text-xs mt-1 hover:text-ink transition-colors disabled:opacity-50"
        >
          {resendCooldown > 0
            ? `Resend code in ${resendCooldown}s`
            : resendStatus === "sending"
            ? "Sending..."
            : "Didn't get a code? Resend"}
        </button>
      </form>
    </AuthCard>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={null}>
      <VerifyEmailForm />
    </Suspense>
  );
}