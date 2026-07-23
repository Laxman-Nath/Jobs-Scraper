"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { resetPassword, forgotPassword } from "@/lib/api/auth";
import { AuthCard } from "../../components/auth/AuthCard";
import { FormField } from "../../components/common/FormField";

const resetPasswordSchema = z
  .object({
    code: z.string().length(6, "Enter the 6-digit code"),
    newPassword: z.string().min(6, "At least 6 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

type ResetPasswordValues = z.infer<typeof resetPasswordSchema>;

function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const email = searchParams.get("email") ?? "";

  const [serverError, setServerError] = useState("");
  const [resendCooldown, setResendCooldown] = useState(0);
  const [resendStatus, setResendStatus] = useState<"idle" | "sending" | "sent">("idle");

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<ResetPasswordValues>({
    resolver: zodResolver(resetPasswordSchema),
  });

  useEffect(() => {
    if (resendCooldown <= 0) return;
    const timer = setInterval(() => setResendCooldown((s) => s - 1), 1000);
    return () => clearInterval(timer);
  }, [resendCooldown]);

  async function onSubmit(data: ResetPasswordValues) {
    setServerError("");
    try {
      await resetPassword(email, data.code, data.newPassword);
      router.push("/login?reset=true");
    } catch (e: unknown) {
      console.error("Reset password error:", e);
      const error = e as { response?: { data?: { message?: string } } };
      setServerError(error.response?.data?.message ?? "Invalid or expired code.");
    }
  }

  async function handleResend() {
    setResendStatus("sending");
    try {
      await forgotPassword(email);
      setResendStatus("sent");
      setResendCooldown(60);
    } catch (e: unknown) {
      console.error("Resend code error:", e);
      const error = e as { response?: { data?: { message?: string } } };
      setServerError(error.response?.data?.message ?? "Couldn't resend code. Try again shortly.");
      setResendStatus("idle");
  
    }
  }

  if (!email) {
    return (
      <AuthCard title="Reset password" subtitle="Missing email address.">
        <p className="text-muted text-sm">
          We couldn't find an email to reset. Please{" "}
          <a href="/forgot-password" className="underline">start over</a>.
        </p>
      </AuthCard>
    );
  }

  return (
    <AuthCard
      title="Reset your password"
      subtitle={`Enter the code sent to ${email} and choose a new password.`}
      footerText="Remembered it?"
      footerLinkText="Log in"
      footerLinkHref="/login"
    >
      <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-4">
        <input
          {...register("code")}
          inputMode="numeric"
          maxLength={6}
          autoFocus
          placeholder="000000"
          className="h-14 rounded-xl border border-line px-4 text-center text-2xl tracking-[0.5em] font-mono focus:outline-none focus:ring-2 focus:ring-ink/20"
        />
        {errors.code && <p className="text-rust text-xs -mt-2">{errors.code.message}</p>}

        <FormField
          label="New password"
          type="password"
          placeholder="At least 6 characters"
          registration={register("newPassword")}
          error={errors.newPassword?.message}
        />
        <FormField
          label="Confirm new password"
          type="password"
          placeholder="Re-enter password"
          registration={register("confirmPassword")}
          error={errors.confirmPassword?.message}
        />

        {serverError && (
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-rust text-sm bg-rust/5 border border-rust/20 rounded-lg px-3 py-2">
            {serverError}
          </motion.p>
        )}

        <Button type="submit" disabled={isSubmitting} className="h-12 rounded-xl bg-ink text-base hover:bg-ink/90 mt-2 group">
          {isSubmitting ? "Resetting..." : "Reset password"}
          {!isSubmitting && <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />}
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

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={null}>
      <ResetPasswordForm />
    </Suspense>
  );
}