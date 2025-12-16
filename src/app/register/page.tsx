"use client";

import { useState } from "react";
import Link from "next/link";
import { Container, Card, Button } from "@/components/ui";
import { signIn } from "next-auth/react";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMsg(null);
    setLoading(true);
    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ email, password, name: name || undefined }),
      });

      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        setMsg(j?.error?.formErrors?.[0] ?? j?.error ?? "Registration failed.");
        return;
      }

      // auto-login
      const r = await signIn("credentials", { email, password, callbackUrl: "/dashboard" });
      if (r?.error) setMsg("Registered, but login failed. Try logging in.");
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
        <h1 className="text-2xl font-bold">Create account</h1>
        <p className="mt-1 text-sm text-gray-600">Use any email/password. Password must be 8+ chars.</p>

        <form onSubmit={onSubmit} className="mt-6 grid gap-3">
          <label className="grid gap-1">
            <span className="text-sm font-medium">Name (optional)</span>
            <input className="rounded-xl border px-3 py-2" value={name} onChange={(e) => setName(e.target.value)} />
          </label>

          <label className="grid gap-1">
            <span className="text-sm font-medium">Email</span>
            <input className="rounded-xl border px-3 py-2" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </label>

          <label className="grid gap-1">
            <span className="text-sm font-medium">Password</span>
            <input className="rounded-xl border px-3 py-2" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={8} />
          </label>

          {msg ? <p className="text-sm text-red-700">{msg}</p> : null}

          <div className="mt-2 flex items-center gap-2">
            <Button type="submit" disabled={loading}>{loading ? "Creating..." : "Create account"}</Button>
            <Link href="/login" className="text-sm text-gray-600 hover:underline">Already have an account?</Link>
          </div>
        </form>
      </Card>
    </Container>
  );
}
