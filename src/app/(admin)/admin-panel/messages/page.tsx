"use client";

import { useCallback, useEffect, useState } from "react";
import { Loader2, Trash2 } from "lucide-react";

type Message = {
  _id: string;
  name: string;
  email: string;
  message: string;
  createdAt?: string;
};

export default function MessagesAdminPage() {
  const [items, setItems] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/contact");
      const data = await res.json();
      setItems(Array.isArray(data) ? data : []);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function remove(id: string) {
    if (!confirm("Delete this message?")) return;
    await fetch(`/api/contact/${id}`, { method: "DELETE" });
    await load();
  }

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold">Messages</h1>
      {loading ? (
        <div className="flex items-center gap-2 text-sm text-zinc-500">
          <Loader2 size={16} className="animate-spin" /> Loading…
        </div>
      ) : items.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-zinc-300 p-8 text-center text-sm text-zinc-500 dark:border-zinc-700">
          No messages yet.
        </p>
      ) : (
        <ul className="flex flex-col gap-3">
          {items.map((m) => (
            <li
              key={m._id}
              className="rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="font-medium">{m.name}</p>
                  <a
                    href={`mailto:${m.email}`}
                    className="text-sm text-blue-600 hover:underline dark:text-blue-400"
                  >
                    {m.email}
                  </a>
                </div>
                <button
                  onClick={() => remove(m._id)}
                  className="rounded-md p-2 text-zinc-500 transition hover:bg-zinc-100 hover:text-red-600 dark:hover:bg-zinc-800"
                  aria-label="Delete"
                >
                  <Trash2 size={16} />
                </button>
              </div>
              <p className="mt-2 whitespace-pre-wrap text-sm text-zinc-600 dark:text-zinc-400">
                {m.message}
              </p>
              {m.createdAt && (
                <p className="mt-2 text-xs text-zinc-400">
                  {new Date(m.createdAt).toLocaleString()}
                </p>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
