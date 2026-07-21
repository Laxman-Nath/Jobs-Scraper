import axios from "axios";
import { refreshAccessToken } from "./auth";
import { getAccessToken, setAccessToken } from "../utils/tokenStore";

export const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

apiClient.interceptors.request.use((config) => {
  const token = getAccessToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

let isRefreshing = false;

// Endpoints where a 401 should NOT trigger a silent refresh + redirect —
// these are auth flows themselves, not protected resources.
const AUTH_ENDPOINTS = ["/auth/login", "/auth/register", "/auth/refresh", "/password/", "/email/"];

function isAuthEndpoint(url?: string): boolean {
  if (!url) return false;
  return AUTH_ENDPOINTS.some((path) => url.includes(path));
}

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !isRefreshing &&
      !isAuthEndpoint(originalRequest.url)
    ) {
      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const res = await refreshAccessToken();
        setAccessToken(res.accessToken);
        originalRequest.headers.Authorization = `Bearer ${res.accessToken}`;
        isRefreshing = false;
        return apiClient(originalRequest);
      } catch {
        setAccessToken(null);
        window.location.href = "/login";
        isRefreshing = false;
        return Promise.reject(error);
      }
    }

    return Promise.reject(error);
  }
);