import Link from "next/link";

const sections = [
  { href: "/admin-panel/intro", label: "Intro / Hero", desc: "Name, roles, bio, links, CV" },
  { href: "/admin-panel/about", label: "About", desc: "About paragraph & contact info" },
  { href: "/admin-panel/skill", label: "Skills", desc: "Skills grouped by category" },
  { href: "/admin-panel/project", label: "Projects", desc: "Featured projects" },
  { href: "/admin-panel/experience", label: "Experience", desc: "Work & internships" },
  { href: "/admin-panel/education", label: "Education", desc: "Academic background" },
  { href: "/admin-panel/award", label: "Awards", desc: "Honors & prizes" },
  { href: "/admin-panel/publication", label: "Publications", desc: "Research output" },
  { href: "/admin-panel/messages", label: "Messages", desc: "Contact form submissions" },
];

export default function AdminDashboard() {
  return (
    <div>
      <h1 className="mb-2 text-2xl font-bold">Dashboard</h1>
      <p className="mb-6 text-sm text-zinc-500">
        Manage every section of your portfolio.
      </p>
      <div className="grid gap-4 sm:grid-cols-2">
        {sections.map((s) => (
          <Link
            key={s.href}
            href={s.href}
            className="rounded-2xl border border-zinc-200 bg-white p-5 transition hover:border-blue-500/50 hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900"
          >
            <p className="font-semibold">{s.label}</p>
            <p className="mt-1 text-sm text-zinc-500">{s.desc}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
