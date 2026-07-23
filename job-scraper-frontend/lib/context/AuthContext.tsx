"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { User } from "../types/auth";
import * as authApi from "../api/auth";
import { refreshAccessToken } from "../api/auth";
import { setAccessToken, setUserRole } from "../utils/tokenStore";
import { getProfile } from "../api/profile";

type AuthContextType = {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (
    email: string,
    password: string,
    profile?: {
      preferredTitles?: string[];
      skills?: string[];
      preferredLocations?: string[];
    }
  ) => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // On page load, try silent refresh using the httpOnly cookie
    refreshAccessToken()
      .then((res) => {
        setAccessToken(res.accessToken);
        
        setUser({ email: res.email, role: res.role });
        setUserRole(res.role);
      })
      .catch(() => {
        setAccessToken(null);
        setUser(null);
        setUserRole(null);
      })
      .finally(() => setLoading(false));
  }, []);

 async function login(email: string, password: string) {
  const res = await authApi.login(email, password);
  setAccessToken(res.accessToken);
  const profile = await getProfile(); // GET /me
  console.log('Profile after login:', profile);
  setUser({ email: profile.email, role: res.role, emailVerified: profile.emailVerified, profileComplete: profile.profileComplete });
  setUserRole(res.role);
}

async function register(
  email: string,
  password: string,
  profile?: { preferredTitles?: string[]; skills?: string[]; preferredLocations?: string[] }
) {
  const res = await authApi.register(email, password, profile);
  setAccessToken(res.accessToken);
  setUser({ email: res.email, role: res.role });
}

  async function logout() {
    await authApi.logout().catch(() => {});
    setAccessToken(null);
    setUser(null);
    setUserRole(null);
    router.push("/login");
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}