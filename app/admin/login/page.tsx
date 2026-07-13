"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const login = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      if (!res.ok) {
        setError("Invalid password");
        return;
      }

      const data = await res.json();
      localStorage.setItem("admin_token", data.token);
      router.push("/admin/media");
    } catch {
      setError("Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <form
        onSubmit={login}
        className="bg-card border border-border rounded-xl p-8 w-full max-w-sm"
      >
        <h1 className="text-xl font-bold mb-6">Admin Login</h1>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full border border-border rounded-lg px-4 py-2 text-sm bg-card mb-4"
          placeholder="Password"
          autoFocus
        />
        {error && <p className="text-sm text-destructive mb-4">{error}</p>}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-foreground text-background rounded-lg px-4 py-2 text-sm font-medium disabled:opacity-50"
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
    </div>
  );
}
