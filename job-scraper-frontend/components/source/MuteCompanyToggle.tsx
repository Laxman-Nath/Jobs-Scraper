"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getProfile, toggleMuteCompany } from "@/lib/api/profile";
import { BellOff, Bell } from "lucide-react";
import { useAuth } from "@/lib/context/AuthContext";

export function MuteCompanyToggle({ companyName }: { companyName: string }) {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: profile } = useQuery({
    queryKey: ["profile"],
    queryFn: getProfile,
    enabled: !!user,
  });

  const mutation = useMutation({
    mutationFn: () => toggleMuteCompany(companyName),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["profile"] }),
  });

  if (!user) return null;

  const isMuted = profile?.mutedCompanies?.includes(companyName) ?? false;

  return (
    <button
      onClick={(e) => {
        e.preventDefault(); // prevent triggering the parent job card's Link navigation
        e.stopPropagation();
        mutation.mutate();
      }}
      disabled={mutation.isPending}
      title={isMuted ? `Unmute notifications for ${companyName}` : `Mute notifications for ${companyName}`}
      className="p-1.5 rounded-lg text-muted hover:text-ink hover:bg-ink/5 transition-colors disabled:opacity-40"
    >
      {isMuted ? <BellOff className="h-3.5 w-3.5" /> : <Bell className="h-3.5 w-3.5" />}
    </button>
  );
}