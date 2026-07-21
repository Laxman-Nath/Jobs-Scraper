
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { getProfile, updateProfile } from "@/lib/api/profile";
import { profileUpdateSchema, ProfileUpdateFormValues } from "@/lib/validations/profileSchema";
import { AuthCard } from "@/components/auth/AuthCard";
import { FormField } from "@/components/common/FormField";

function splitCommaList(value?: string): string[] {
  if (!value) return [];
  return value.split(",").map((v) => v.trim()).filter(Boolean);
}

function joinList(value?: string[]): string {
  return value?.join(", ") ?? "";
}

export default function EditProfilePage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [serverError, setServerError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const { data: profile, isLoading } = useQuery({
    queryKey: ["profile"],
    queryFn: getProfile,
  });

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<ProfileUpdateFormValues>({
    resolver: zodResolver(profileUpdateSchema),
    defaultValues: {
      emailNotificationsEnabled: true,
    },
  });

  // Pre-fill the form once profile data arrives
  useEffect(() => {
    if (!profile) return;
    reset({
      preferredTitles: joinList(profile.preferredTitles),
      skills: joinList(profile.skills),
      preferredLocations: joinList(profile.preferredLocations),
      mutedCompanies: joinList(profile.mutedCompanies),
      emailNotificationsEnabled: profile.emailNotificationsEnabled,
    });
  }, [profile, reset]);

  const mutation = useMutation({
    mutationFn: updateProfile,
    onSuccess: () => {
      setSuccessMessage("Profile updated.");
      queryClient.invalidateQueries({ queryKey: ["profile"] });
    },
    onError: (e: any) => {
      setServerError(e?.response?.data?.message ?? "Couldn't update profile. Please try again.");
    },
  });

  async function onSubmit(data: ProfileUpdateFormValues) {
    setServerError("");
    setSuccessMessage("");
    mutation.mutate({
      preferredTitles: splitCommaList(data.preferredTitles),
      skills: splitCommaList(data.skills),
      preferredLocations: splitCommaList(data.preferredLocations),
      mutedCompanies: splitCommaList(data.mutedCompanies),
      emailNotificationsEnabled: data.emailNotificationsEnabled,
    });
  }

  const emailNotificationsEnabled = watch("emailNotificationsEnabled");

  if (isLoading) {
    return (
      <AuthCard title="Edit profile" subtitle="Loading your details...">
        <div className="grid gap-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-12 rounded-xl bg-white border border-line animate-pulse" />
          ))}
        </div>
      </AuthCard>
    );
  }

  return (
    <AuthCard
      title="Edit your profile"
      subtitle="Update your preferences to get better recommendations."
      footerText="Done editing?"
      footerLinkText="Back to dashboard"
      footerLinkHref="/dashboard"
    >
      <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-4">
        <FormField
          label="Job titles you're interested in"
          type="text"
          placeholder="e.g. Backend Engineer, Full Stack Developer"
          registration={register("preferredTitles")}
          error={errors.preferredTitles?.message}
        />
        <FormField
          label="Skills"
          type="text"
          placeholder="e.g. Java, Spring Boot, React"
          registration={register("skills")}
          error={errors.skills?.message}
        />
        <FormField
          label="Preferred locations"
          type="text"
          placeholder="e.g. Kathmandu, Remote"
          registration={register("preferredLocations")}
          error={errors.preferredLocations?.message}
        />
        <FormField
          label="Muted companies"
          type="text"
          placeholder="e.g. CompanyA, CompanyB"
          registration={register("mutedCompanies")}
          error={errors.mutedCompanies?.message}
        />

        <label className="flex items-center gap-2 text-sm text-ink mt-1 cursor-pointer">
          <input
            type="checkbox"
            checked={emailNotificationsEnabled}
            onChange={(e) => setValue("emailNotificationsEnabled", e.target.checked)}
            className="h-4 w-4 rounded border-line accent-ink"
          />
          Receive job match email notifications
        </label>

        {serverError && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-rust text-sm bg-rust/5 border border-rust/20 rounded-lg px-3 py-2"
          >
            {serverError}
          </motion.p>
        )}

        {successMessage && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-green-700 text-sm bg-green-50 border border-green-200 rounded-lg px-3 py-2"
          >
            {successMessage}
          </motion.p>
        )}

        <Button
          type="submit"
          disabled={isSubmitting || mutation.isPending}
          className="h-12 rounded-xl bg-ink text-base hover:bg-ink/90 mt-2 group"
        >
          {mutation.isPending ? "Saving..." : "Save changes"}
          {!mutation.isPending && (
            <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
          )}
        </Button>
      </form>
    </AuthCard>
  );
}