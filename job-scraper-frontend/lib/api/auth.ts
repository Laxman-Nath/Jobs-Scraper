import { AuthResponse } from "../types/auth";
import { apiClient } from "./client";

export async function register(
  email: string,
  password: string,
  profile?: { preferredTitles?: string[]; skills?: string[]; preferredLocations?: string[] }
): Promise<AuthResponse> {
  const { data } = await apiClient.post<AuthResponse>("/auth/register", { email, password, ...profile });
  return data;
}

export async function login(email: string, password: string): Promise<AuthResponse> {
  const { data } = await apiClient.post<AuthResponse>("/auth/login", { email, password });
  return data;
}

export async function refreshAccessToken(): Promise<AuthResponse> {
  const { data } = await apiClient.post<AuthResponse>("/auth/refresh");
  return data;
}

export async function logout(): Promise<void> {
  await apiClient.post("/auth/logout");
}

export async function verifyEmail(email: string, code: string): Promise<void> {
  await apiClient.post("/email/verify", { email, code });
}

export async function resendVerificationCode(email: string): Promise<void> {
  await apiClient.post("/email/resend", { email });
}
