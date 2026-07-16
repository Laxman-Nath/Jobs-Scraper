"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { useAuth } from "@/lib/context/AuthContext";
import { LoginFormValues, loginSchema } from "@/lib/validations/authSchema";
import { AuthCard } from "../components/auth/AuthCard";
import { AuthFormField } from "../components/auth/AuthFormField";


export default function LoginPage() {
  const { login } = useAuth();
  const router = useRouter();
  const [serverError, setServerError] = useState("");

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  async function onSubmit(data: LoginFormValues) {
    setServerError("");
    try {
      await login(data.email, data.password);
      router.push("/");
    } catch {
      setServerError("Invalid email or password.");
    }
  }

  return (
    <AuthCard
      title="Welcome back"
      subtitle="Log in to continue."
      footerText="No account?"
      footerLinkText="Sign up"
      footerLinkHref="/register"
    >
      <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-4">
        <AuthFormField label="Email" type="email" placeholder="you@example.com" registration={register("email")} error={errors.email?.message} />
        <AuthFormField label="Password" type="password" placeholder="••••••••" registration={register("password")} error={errors.password?.message} />

        {serverError && (
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-rust text-sm bg-rust/5 border border-rust/20 rounded-lg px-3 py-2">
            {serverError}
          </motion.p>
        )}

        <Button type="submit" disabled={isSubmitting} className="h-12 rounded-xl bg-ink text-base hover:bg-ink/90 mt-2 group cursor-pointer">
          {isSubmitting ? "Logging in..." : "Log in"}
          {!isSubmitting && <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />}
        </Button>
      </form>
    </AuthCard>
  );
}