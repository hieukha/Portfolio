import Link from "next/link";
import { auth } from "@/auth";
import SignOutButton from "@/components/admin/SignOutButton";

const navItems = [
  { href: "/admin-panel", label: "Dashboard" },
  { href: "/admin-panel/intro", label: "Intro / Hero" },
  { href: "/admin-panel/about", label: "About" },
  { href: "/admin-panel/skill", label: "Skills" },
  { href: "/admin-panel/project", label: "Projects" },
  { href: "/admin-panel/blog", label: "Blog" },
  { href: "/admin-panel/experience", label: "Experience" },
  { href: "/admin-panel/education", label: "Education" },
  { href: "/admin-panel/award", label: "Awards" },
  { href: "/admin-panel/publication", label: "Publications" },
  { href: "/admin-panel/messages", label: "Messages" },
];

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  // Unauthenticated users only reach the login page (middleware guards the rest).
  if (!session?.user) return <>{children}</>;

  return (
    <div className="flex min-h-screen">
      <aside className="hidden w-60 shrink-0 flex-col border-r border-zinc-200 p-4 dark:border-zinc-800 md:flex">
        <div className="mb-6 px-3">
          <p className="text-sm font-bold">Portfolio Admin</p>
          <p className="truncate text-xs text-zinc-500">{session.user.email}</p>
        </div>
        <nav className="flex flex-1 flex-col gap-1">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-md px-3 py-2 text-sm font-medium text-zinc-600 transition hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800 dark:hover:text-white"
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <SignOutButton />
      </aside>

      <div className="flex-1">
        <header className="flex items-center justify-between border-b border-zinc-200 px-6 py-4 dark:border-zinc-800 md:hidden">
          <span className="text-sm font-bold">Portfolio Admin</span>
          <SignOutButton />
        </header>
        <main className="mx-auto w-full max-w-4xl px-6 py-8">{children}</main>
      </div>
    </div>
  );
}
