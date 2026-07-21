"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { forgotPassword } from "@/lib/api/auth";
import { AuthCard } from "../../components/auth/AuthCard";
import { FormField } from "../../components/common/FormField";

const forgotPasswordSchema = z.object({
  email: z.string().email("Enter a valid email"),
});

type ForgotPasswordValues = z.infer<typeof forgotPasswordSchema>;

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [serverError, setServerError] = useState("");

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<ForgotPasswordValues>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  async function onSubmit(data: ForgotPasswordValues) {
    setServerError("");
    try {
      await forgotPassword(data.email);
      router.push(`/reset-password?email=${encodeURIComponent(data.email)}`);
    } catch (e: any) {
      // Still redirect even on error — never reveal whether the email exists
      router.push(`/reset-password?email=${encodeURIComponent(data.email)}`);
    }
  }

  return (
    <AuthCard
      title="Forgot your password?"
      subtitle="Enter your email and we'll send you a reset code."
      footerText="Remembered it?"
      footerLinkText="Log in"
      footerLinkHref="/login"
    >
      <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-4">
        <FormField
          label="Email"
          type="email"
          placeholder="you@example.com"
          registration={register("email")}
          error={errors.email?.message}
        />

        {serverError && (
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-rust text-sm bg-rust/5 border border-rust/20 rounded-lg px-3 py-2">
            {serverError}
          </motion.p>
        )}

        <Button type="submit" disabled={isSubmitting} className="h-12 rounded-xl bg-ink text-base hover:bg-ink/90 mt-2 group">
          {isSubmitting ? "Sending code..." : "Send reset code"}
          {!isSubmitting && <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />}
        </Button>
      </form>
    </AuthCard>
  );
}