import { apiClient } from "./client";
import { Job } from "../types/job";

export type Profile = {
  email: string;
  preferredTitles: string[];
  skills: string[];
  preferredLocations: string[];
  emailNotificationsEnabled: boolean;
  emailVerified: boolean;
  profileComplete: boolean;
};

export async function getProfile(): Promise<Profile> {
  const { data } = await apiClient.get<Profile>("/me");
  return data;
}

export async function updateProfile(payload: Partial<Profile>): Promise<Profile> {
  const { data } = await apiClient.patch<Profile>("/me", payload);
  return data;
}

export async function getRecommendations(): Promise<Job[]> {
  const { data } = await apiClient.get<Job[]>("/me/recommendations");
  return data;
}