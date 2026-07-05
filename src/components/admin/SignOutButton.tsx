"use client";

import { signOut } from "next-auth/react";
import { LogOut } from "lucide-react";

export default function SignOutButton() {
  return (
    <button
      type="button"
      onClick={() => signOut({ callbackUrl: "/admin-panel/login" })}
      className="flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-zinc-600 transition hover:bg-zinc-100 hover:text-red-600 dark:text-zinc-300 dark:hover:bg-zinc-800"
    >
      <LogOut size={16} />
      Sign out
    </button>
  );
}
