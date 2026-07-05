"use client";

import { useCallback, useEffect, useState } from "react";
import { Loader2, Pencil, Plus, Trash2, X } from "lucide-react";

export type Field = {
  name: string;
  label: string;
  type?: "text" | "textarea" | "number" | "list";
  placeholder?: string;
};

type Item = Record<string, unknown> & { _id: string };

export default function CrudManager({
  title,
  endpoint,
  fields,
  primaryKey = "name",
  secondaryKey,
}: {
  title: string;
  endpoint: string;
  fields: Field[];
  primaryKey?: string;
  secondaryKey?: string;
}) {
  const [items, setItems] = useState<Item[]>([]);
  const [form, setForm] = useState<Record<string, string>>({});
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/${endpoint}`);
      const data = await res.json();
      setItems(Array.isArray(data) ? data : []);
    } catch {
      setError("Failed to load data. Is MongoDB running?");
    } finally {
      setLoading(false);
    }
  }, [endpoint]);

  useEffect(() => {
    load();
  }, [load]);

  function resetForm() {
    setForm({});
    setEditingId(null);
    setShowForm(false);
    setError("");
  }

  function startCreate() {
    setForm({});
    setEditingId(null);
    setShowForm(true);
  }

  function startEdit(item: Item) {
    const next: Record<string, string> = {};
    for (const f of fields) {
      const value = item[f.name];
      next[f.name] = Array.isArray(value)
        ? value.join(", ")
        : value === undefined || value === null
          ? ""
          : String(value);
    }
    setForm(next);
    setEditingId(item._id);
    setShowForm(true);
  }

  function buildPayload() {
    const payload: Record<string, unknown> = {};
    for (const f of fields) {
      const raw = form[f.name] ?? "";
      if (f.type === "number") payload[f.name] = Number(raw) || 0;
      else if (f.type === "list")
        payload[f.name] = raw
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean);
      else payload[f.name] = raw;
    }
    return payload;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      const url = editingId ? `/api/${endpoint}/${editingId}` : `/api/${endpoint}`;
      const method = editingId ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(buildPayload()),
      });
      if (!res.ok) throw new Error();
      resetForm();
      await load();
    } catch {
      setError("Save failed. Check that you are logged in and MongoDB is running.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this item?")) return;
    await fetch(`/api/${endpoint}/${id}`, { method: "DELETE" });
    await load();
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">{title}</h1>
        <button
          onClick={startCreate}
          className="inline-flex items-center gap-2 rounded-md bg-zinc-900 px-3 py-2 text-sm font-semibold text-white transition hover:opacity-90 dark:bg-white dark:text-zinc-900"
        >
          <Plus size={16} /> Add new
        </button>
      </div>

      {error && (
        <p className="mb-4 rounded-md bg-red-500/10 px-3 py-2 text-sm text-red-600 dark:text-red-400">
          {error}
        </p>
      )}

      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="mb-6 rounded-2xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900"
        >
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-semibold">{editingId ? "Edit item" : "New item"}</h2>
            <button type="button" onClick={resetForm} aria-label="Close">
              <X size={18} />
            </button>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
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
                    type={f.type === "number" ? "number" : "text"}
                    value={form[f.name] ?? ""}
                    onChange={(e) => setForm({ ...form, [f.name]: e.target.value })}
                    placeholder={f.placeholder}
                    className="h-10 rounded-md border border-zinc-300 bg-transparent px-3 text-sm outline-none focus:border-blue-500 dark:border-zinc-700"
                  />
                )}
              </div>
            ))}
          </div>
          <div className="mt-4 flex gap-3">
            <button
              type="submit"
              disabled={saving}
              className="inline-flex h-10 items-center gap-2 rounded-md bg-zinc-900 px-4 text-sm font-semibold text-white transition hover:opacity-90 disabled:opacity-60 dark:bg-white dark:text-zinc-900"
            >
              {saving && <Loader2 size={16} className="animate-spin" />}
              {editingId ? "Update" : "Create"}
            </button>
            <button
              type="button"
              onClick={resetForm}
              className="h-10 rounded-md border border-zinc-300 px-4 text-sm font-medium dark:border-zinc-700"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {loading ? (
        <div className="flex items-center gap-2 text-sm text-zinc-500">
          <Loader2 size={16} className="animate-spin" /> Loading…
        </div>
      ) : items.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-zinc-300 p-8 text-center text-sm text-zinc-500 dark:border-zinc-700">
          No items yet. Click “Add new” to create one.
        </p>
      ) : (
        <ul className="flex flex-col gap-2">
          {items.map((item) => (
            <li
              key={item._id}
              className="flex items-center justify-between gap-3 rounded-xl border border-zinc-200 bg-white px-4 py-3 dark:border-zinc-800 dark:bg-zinc-900"
            >
              <div className="min-w-0">
                <p className="truncate font-medium">{String(item[primaryKey] ?? "—")}</p>
                {secondaryKey && (
                  <p className="truncate text-sm text-zinc-500">
                    {String(item[secondaryKey] ?? "")}
                  </p>
                )}
              </div>
              <div className="flex shrink-0 items-center gap-1">
                <button
                  onClick={() => startEdit(item)}
                  className="rounded-md p-2 text-zinc-500 transition hover:bg-zinc-100 hover:text-blue-600 dark:hover:bg-zinc-800"
                  aria-label="Edit"
                >
                  <Pencil size={16} />
                </button>
                <button
                  onClick={() => handleDelete(item._id)}
                  className="rounded-md p-2 text-zinc-500 transition hover:bg-zinc-100 hover:text-red-600 dark:hover:bg-zinc-800"
                  aria-label="Delete"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
