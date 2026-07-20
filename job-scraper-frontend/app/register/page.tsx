"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { useAuth } from "@/lib/context/AuthContext";
import { RegisterFormValues, registerSchema } from "@/lib/validations/authSchema";
import { AuthCard } from "../components/auth/AuthCard";
import { FormField } from "../components/FormField";


export default function RegisterPage() {
  const { register: registerUser } = useAuth();
  const router = useRouter();
  const [serverError, setServerError] = useState("");

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
  });

async function onSubmit(data: RegisterFormValues) {
  setServerError("");
  try {
    await registerUser(data.email, data.password, {
      preferredTitles: splitCommaList(data.preferredTitles),
      skills: splitCommaList(data.skills),
      preferredLocations: splitCommaList(data.preferredLocations),
    });
    router.push(`/verify-email?email=${encodeURIComponent(data.email)}`);
  } catch {
    setServerError("Registration failed. Email may already be in use.");
  }
}

  function splitCommaList(value?: string): string[] {
    if (!value) return [];
    return value.split(",").map((v) => v.trim()).filter(Boolean);
  }

  return (
    <AuthCard
      title="Create your account"
      subtitle="Tell us what you're looking for, and we'll surface matching jobs."
      footerText="Already have an account?"
      footerLinkText="Log in"
      footerLinkHref="/login"
    >
      <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-4">
        <FormField label="Email" type="email" placeholder="you@example.com" registration={register("email")} error={errors.email?.message} />
        <FormField label="Password" type="password" placeholder="At least 6 characters" registration={register("password")} error={errors.password?.message} />
        <FormField label="Job titles you're interested in" type="text" placeholder="e.g. Backend Engineer, Full Stack Developer" registration={register("preferredTitles")} error={errors.preferredTitles?.message} />
        <FormField label="Skills (optional)" type="text" placeholder="e.g. Java, Spring Boot, React" registration={register("skills")} error={errors.skills?.message} />
        <FormField label="Preferred locations (optional)" type="text" placeholder="e.g. Kathmandu, Remote" registration={register("preferredLocations")} error={errors.preferredLocations?.message} />

        {serverError && (
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-rust text-sm bg-rust/5 border border-rust/20 rounded-lg px-3 py-2">
            {serverError}
          </motion.p>
        )}

        <Button type="submit" disabled={isSubmitting} className="h-12 rounded-xl bg-ink text-base hover:bg-ink/90 mt-2 group">
          {isSubmitting ? "Creating account..." : "Create account"}
          {!isSubmitting && <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />}
        </Button>
      </form>
    </AuthCard>
  );
}