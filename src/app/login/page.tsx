"use client";

import { useState } from "react";
import Link from "next/link";
import { Container, Card, Button } from "@/components/ui";
import { signIn } from "next-auth/react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMsg(null);
    setLoading(true);
    try {
      const res = await signIn("credentials", { email, password, redirect: false });
      if (res?.error) setMsg("Invalid email/password.");
      else window.location.href = "/dashboard";
    } finally {
      setLoading(false);
    }
  }

  return (
    <Container>
      <div className="mb-6">
        <Link href="/" className="text-sm text-gray-600 hover:underline">← Back</Link>
      </div>

      <Card>
        <h1 className="text-2xl font-bold">Login</h1>
        <p className="mt-1 text-sm text-gray-600">Sign in to manage your tasks.</p>

        <form onSubmit={onSubmit} className="mt-6 grid gap-3">
          <label className="grid gap-1">
            <span className="text-sm font-medium">Email</span>
            <input className="rounded-xl border px-3 py-2" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </label>

          <label className="grid gap-1">
            <span className="text-sm font-medium">Password</span>
            <input className="rounded-xl border px-3 py-2" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </label>

          {msg ? <p className="text-sm text-red-700">{msg}</p> : null}

          <div className="mt-2 flex items-center gap-2">
            <Button type="submit" disabled={loading}>{loading ? "Signing in..." : "Sign in"}</Button>
            <Link href="/register" className="text-sm text-gray-600 hover:underline">Create account</Link>
          </div>
        </form>
      </Card>
    </Container>
  );
}
