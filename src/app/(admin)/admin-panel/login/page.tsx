"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Loader2, Lock } from "lucide-react";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    const res = await signIn("credentials", { email, password, redirect: false });
    setLoading(false);
    if (res?.error) {
      setError("Invalid email or password.");
      return;
    }
    router.push("/admin-panel");
    router.refresh();
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900"
      >
        <div className="mb-6 flex flex-col items-center gap-2 text-center">
          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-zinc-100 dark:bg-zinc-800">
            <Lock size={18} />
          </div>
          <h1 className="text-xl font-bold">Admin Login</h1>
          <p className="text-sm text-zinc-500">Sign in to manage your portfolio.</p>
        </div>

        {error && (
          <p className="mb-4 rounded-md bg-red-500/10 px-3 py-2 text-sm text-red-600 dark:text-red-400">
            {error}
          </p>
        )}

        <label className="mb-1 block text-sm font-medium">Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="mb-4 h-11 w-full rounded-md border border-zinc-300 bg-transparent px-3 text-sm outline-none focus:border-blue-500 dark:border-zinc-700"
        />

        <label className="mb-1 block text-sm font-medium">Password</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="mb-6 h-11 w-full rounded-md border border-zinc-300 bg-transparent px-3 text-sm outline-none focus:border-blue-500 dark:border-zinc-700"
        />

        <button
          type="submit"
          disabled={loading}
          className="flex h-11 w-full items-center justify-center gap-2 rounded-md bg-zinc-900 text-sm font-semibold text-white transition hover:opacity-90 disabled:opacity-60 dark:bg-white dark:text-zinc-900"
        >
          {loading && <Loader2 size={16} className="animate-spin" />}
          Sign in
        </button>
      </form>
    </div>
  );
}
