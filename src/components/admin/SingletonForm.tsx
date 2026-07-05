"use client";

import { useCallback, useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import type { Field } from "@/components/admin/CrudManager";

export default function SingletonForm({
  title,
  endpoint,
  fields,
}: {
  title: string;
  endpoint: string;
  fields: Field[];
}) {
  const [form, setForm] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/${endpoint}`);
      const data = await res.json();
      const next: Record<string, string> = {};
      for (const f of fields) {
        const value = data?.[f.name];
        next[f.name] = Array.isArray(value)
          ? value.join(", ")
          : value === undefined || value === null
            ? ""
            : String(value);
      }
      setForm(next);
    } catch {
      setMessage("Failed to load. Is MongoDB running?");
    } finally {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [endpoint]);

  useEffect(() => {
    load();
  }, [load]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setMessage("");
    const payload: Record<string, unknown> = {};
    for (const f of fields) {
      const raw = form[f.name] ?? "";
      payload[f.name] =
        f.type === "list"
          ? raw.split(",").map((s) => s.trim()).filter(Boolean)
          : raw;
    }
    try {
      const res = await fetch(`/api/${endpoint}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error();
      setMessage("Saved successfully.");
    } catch {
      setMessage("Save failed. Check login and MongoDB.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold">{title}</h1>
      {message && (
        <p className="mb-4 rounded-md bg-zinc-500/10 px-3 py-2 text-sm">{message}</p>
      )}
      {loading ? (
        <div className="flex items-center gap-2 text-sm text-zinc-500">
          <Loader2 size={16} className="animate-spin" /> Loading…
        </div>
      ) : (
        <form
          onSubmit={handleSubmit}
          className="grid gap-4 rounded-2xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900 md:grid-cols-2"
        >
          {fields.map((f) => (
            <div
              key={f.name}
              className={`flex flex-col gap-1 ${f.type === "textarea" ? "md:col-span-2" : ""}`}
            >
              <label className="text-sm font-medium">
                {f.label}
                {f.type === "list" && (
                  <span className="ml-1 text-xs text-zinc-500">(comma separated)</span>
                )}
              </label>
              {f.type === "textarea" ? (
                <textarea
                  value={form[f.name] ?? ""}
                  onChange={(e) => setForm({ ...form, [f.name]: e.target.value })}
                  placeholder={f.placeholder}
                  rows={4}
                  className="rounded-md border border-zinc-300 bg-transparent px-3 py-2 text-sm outline-none focus:border-blue-500 dark:border-zinc-700"
                />
              ) : (
                <input
                  type="text"
                  value={form[f.name] ?? ""}
                  onChange={(e) => setForm({ ...form, [f.name]: e.target.value })}
                  placeholder={f.placeholder}
                  className="h-10 rounded-md border border-zinc-300 bg-transparent px-3 text-sm outline-none focus:border-blue-500 dark:border-zinc-700"
                />
              )}
            </div>
          ))}
          <div className="md:col-span-2">
            <button
              type="submit"
              disabled={saving}
              className="inline-flex h-10 items-center gap-2 rounded-md bg-zinc-900 px-4 text-sm font-semibold text-white transition hover:opacity-90 disabled:opacity-60 dark:bg-white dark:text-zinc-900"
            >
              {saving && <Loader2 size={16} className="animate-spin" />}
              Save
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
