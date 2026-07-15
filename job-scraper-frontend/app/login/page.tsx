"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/lib/context/AuthContext";
import { getUserRole } from "@/lib/utils/tokenStore";

export default function LoginPage() {
  const { login } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(email, password);
      if (getUserRole()?.toLowerCase() === "admin") {
        router.push("/admin");
      } else {
        router.push("/");
      }
    } catch {
      setError("Invalid email or password.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center px-6">
      <div className="w-full max-w-sm">
        <h1 className="font-display text-3xl text-ink mb-8">Log in</h1>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="bg-transparent border-b border-line focus:border-ink outline-none py-2 text-sm"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="bg-transparent border-b border-line focus:border-ink outline-none py-2 text-sm"
            required
          />

          {error && <p className="text-rust text-sm font-mono">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="font-mono text-xs uppercase tracking-wide border border-ink px-4 py-3 hover:bg-ink hover:text-base transition-colors disabled:opacity-40 mt-2"
          >
            {loading ? "Logging in..." : "Log in"}
          </button>
        </form>

        <p className="text-muted text-sm mt-6">
          No account?{" "}
          <Link href="/register" className="text-ink underline underline-offset-4">
            Register
          </Link>
        </p>
      </div>
    </main>
  );
}