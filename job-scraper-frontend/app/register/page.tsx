"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Briefcase, ArrowRight } from "lucide-react";
import { useAuth } from "@/lib/context/AuthContext";
import { RegisterFormValues, registerSchema } from "@/lib/validations/authSchema";

export default function RegisterPage() {
  const { register: registerUser } = useAuth();
  const router = useRouter();
  const [serverError, setServerError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
  });

  async function onSubmit(data: RegisterFormValues) {
    setServerError("");
    try {
      await registerUser(data.email, data.password);
      router.push("/");
    } catch {
      setServerError("Registration failed. Email may already be in use.");
    }
  }

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

        <h1 className="font-display font-semibold text-3xl text-ink mb-1">Create your account</h1>
        <p className="text-muted text-sm mb-8">Start tracking jobs that matter to you.</p>

        <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-4">
          <div>
            <label className="text-xs font-mono text-muted mb-1.5 block">Email</label>
            <Input
              type="email"
              placeholder="you@example.com"
              {...register("email")}
              className={`h-12 bg-white rounded-xl text-black ${
                errors.email ? "border-rust focus-visible:ring-rust/30" : "border-line"
              }`}
            />
            {errors.email && <p className="text-rust text-xs mt-1.5">{errors.email.message}</p>}
          </div>

          <div>
            <label className="text-xs font-mono text-muted mb-1.5 block">Password</label>
            <Input
              type="password"
              placeholder="At least 6 characters"
              {...register("password")}
              className={`h-12 bg-white rounded-xl text-black ${
                errors.password ? "border-rust focus-visible:ring-rust/30" : "border-line"
              }`}
            />
            {errors.password && <p className="text-rust text-xs mt-1.5">{errors.password.message}</p>}
          </div>

          {serverError && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-rust text-sm bg-rust/5 border border-rust/20 rounded-lg px-3 py-2"
            >
              {serverError}
            </motion.p>
          )}

          <Button
            type="submit"
            disabled={isSubmitting}
            className="h-12 rounded-xl bg-ink text-base hover:bg-ink/90 mt-2 group"
          >
            {isSubmitting ? "Creating account..." : "Create account"}
            {!isSubmitting && <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />}
          </Button>
        </form>

        <p className="text-muted text-sm mt-6 text-center">
          Already have an account?{" "}
          <Link href="/login" className="text-ink font-medium hover:text-signal transition-colors">
            Log in
          </Link>
        </p>
      </motion.div>
    </main>
  );
}