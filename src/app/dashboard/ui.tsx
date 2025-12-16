"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { signOut } from "next-auth/react";
import { Container, Card, Button, NavLink } from "@/components/ui";

type TaskStatus = "TODO" | "DOING" | "DONE";

type Task = {
  id: string;
  title: string;
  description: string | null;
  status: TaskStatus;
  dueDate: string | null;
  createdAt: string;
  updatedAt: string;
};

function fmtDate(d: string | null) {
  if (!d) return "";
  const date = new Date(d);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleDateString();
}

export default function DashboardClient({ userEmail }: { userEmail: string }) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");

  async function refresh() {
    setErr(null);
    setLoading(true);
    try {
      const res = await fetch("/api/tasks");
      if (!res.ok) throw new Error("Failed to load tasks.");
      const j = await res.json();
      setTasks(j.tasks ?? []);
    } catch (e: any) {
      setErr(e?.message ?? "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    refresh();
  }, []);

  const grouped = useMemo(() => {
    const g: Record<TaskStatus, Task[]> = { TODO: [], DOING: [], DONE: [] };
    for (const t of tasks) g[t.status].push(t);
    return g;
  }, [tasks]);

  async function createTask(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    const res = await fetch("/api/tasks", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        title,
        description: description || undefined,
        dueDate: dueDate ? new Date(dueDate).toISOString() : undefined,
      }),
    });
    if (!res.ok) {
      const j = await res.json().catch(() => ({}));
      setErr(j?.error?.formErrors?.[0] ?? j?.error ?? "Failed to create task.");
      return;
    }
    setTitle("");
    setDescription("");
    setDueDate("");
    await refresh();
  }

  async function setStatus(id: string, status: TaskStatus) {
    const res = await fetch(`/api/tasks/${id}`, {
      method: "PATCH",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ status }),
    });
    if (!res.ok) {
      setErr("Failed to update status.");
      return;
    }
    await refresh();
  }

  async function removeTask(id: string) {
    const res = await fetch(`/api/tasks/${id}`, { method: "DELETE" });
    if (!res.ok) {
      setErr("Failed to delete.");
      return;
    }
    await refresh();
  }

  return (
    <Container>
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <p className="text-sm text-gray-600">Signed in as {userEmail}</p>
        </div>
        <div className="flex items-center gap-2">
          <Link href="/"><Button variant="ghost">Home</Button></Link>
          <Button variant="ghost" onClick={() => signOut({ callbackUrl: "/" })}>Sign out</Button>
        </div>
      </div>

      <div className="grid gap-6">
        <Card>
          <h2 className="text-lg font-semibold">Create a task</h2>
          <form onSubmit={createTask} className="mt-4 grid gap-3">
            <label className="grid gap-1">
              <span className="text-sm font-medium">Title</span>
              <input className="rounded-xl border px-3 py-2" value={title} onChange={(e) => setTitle(e.target.value)} required />
            </label>

            <label className="grid gap-1">
              <span className="text-sm font-medium">Description (optional)</span>
              <textarea className="rounded-xl border px-3 py-2" rows={3} value={description} onChange={(e) => setDescription(e.target.value)} />
            </label>

            <label className="grid gap-1">
              <span className="text-sm font-medium">Due date (optional)</span>
              <input className="rounded-xl border px-3 py-2" type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
            </label>

            {err ? <p className="text-sm text-red-700">{err}</p> : null}

            <div className="flex items-center gap-2">
              <Button type="submit">Add task</Button>
              <button type="button" onClick={refresh} className="text-sm text-gray-600 hover:underline">
                Refresh
              </button>
            </div>
          </form>
        </Card>

        <div className="grid gap-4 md:grid-cols-3">
          {(["TODO", "DOING", "DONE"] as TaskStatus[]).map((col) => (
            <Card key={col}>
              <div className="mb-3 flex items-center justify-between">
                <h3 className="font-semibold">{col === "TODO" ? "To do" : col === "DOING" ? "Doing" : "Done"}</h3>
                <span className="text-xs text-gray-500">{grouped[col].length}</span>
              </div>

              {loading ? (
                <p className="text-sm text-gray-600">Loading…</p>
              ) : grouped[col].length === 0 ? (
                <p className="text-sm text-gray-600">No tasks.</p>
              ) : (
                <ul className="grid gap-2">
                  {grouped[col].map((t) => (
                    <li key={t.id} className="rounded-xl border bg-gray-50 p-3">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <p className="font-medium">{t.title}</p>
                          {t.description ? <p className="mt-1 text-sm text-gray-600">{t.description}</p> : null}
                          {t.dueDate ? <p className="mt-2 text-xs text-gray-500">Due: {fmtDate(t.dueDate)}</p> : null}
                        </div>
                        <button onClick={() => removeTask(t.id)} className="text-xs text-gray-500 hover:text-red-600">
                          Delete
                        </button>
                      </div>

                      <div className="mt-3 flex flex-wrap gap-2">
                        {(["TODO", "DOING", "DONE"] as TaskStatus[]).map((s) => (
                          <button
                            key={s}
                            onClick={() => setStatus(t.id, s)}
                            className={`rounded-lg px-2 py-1 text-xs ${
                              t.status === s ? "bg-black text-white" : "bg-white text-gray-700 border"
                            }`}
                          >
                            {s}
                          </button>
                        ))}
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </Card>
          ))}
        </div>
      </div>
    </Container>
  );
}
