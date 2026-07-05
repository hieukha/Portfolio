"use client";

import { useEffect, useMemo, useState, type CSSProperties, type ElementType } from "react";
import { useTheme } from "next-themes";
import { motion, type Variants } from "framer-motion";
import {
  ArrowRight,
  BookOpen,
  BriefcaseBusiness,
  Code2,
  Database,
  FileText,
  Github,
  Globe,
  GraduationCap,
  Languages,
  Linkedin,
  Mail,
  MapPin,
  Menu,
  Moon,
  Phone,
  Send,
  Sun,
  X,
  type LucideIcon,
} from "lucide-react";
import {
  SiC,
  SiCplusplus,
  SiDocker,
  SiFastapi,
  SiFlask,
  SiGit,
  SiJavascript,
  SiLangchain,
  SiMeta,
  SiOpenjdk,
  SiPostgresql,
  SiPython,
  SiPytorch,
  SiQdrant,
  SiTensorflow,
} from "react-icons/si";
import Link from "next/link";
import TypewriterClient from "@/components/TypewriterClient";
import GithubActivity from "@/components/GithubActivity";
import type { PortfolioData } from "@/lib/portfolio-data";

const navLinks = [
  { title: "About", href: "#about" },
  { title: "Skills", href: "#skills" },
  { title: "Projects", href: "#projects" },
  { title: "Blog", href: "#blog" },
  { title: "Experience", href: "#experience" },
  { title: "Contact", href: "#contact" },
];

const categoryOrder = [
  "language",
  "ai/ml",
  "frontend",
  "backend",
  "database",
  "tools",
  "other",
];

const container: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.3 } },
};

const item: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 50 } },
};

function SectionTitle({ eyebrow, title }: { eyebrow: string; title: string }) {
  return (
    <div className="mb-6 flex flex-col">
      <p className="text-sm text-gray-700 dark:text-gray-400">{eyebrow}</p>
      <h2 className="text-xl font-bold md:text-xl">{title}</h2>
    </div>
  );
}

function IconTile({
  icon: Icon,
  tone = "text-blue-600 dark:text-blue-300",
  box = "border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900",
}: {
  icon: LucideIcon;
  tone?: string;
  box?: string;
}) {
  return (
    <div
      className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-lg border ${box} ${tone}`}
    >
      <Icon size={22} strokeWidth={1.6} />
    </div>
  );
}

type SkillIcon = ElementType;

const skillBrandIcons: [RegExp, SkillIcon, string][] = [
  [/c\+\+/i, SiCplusplus, "#00599C"],
  [/\bc\b/i, SiC, "#A8B9CC"],
  [/python/i, SiPython, "#3776AB"],
  [/java(?!script)/i, SiOpenjdk, "#ED8B00"],
  [/javascript/i, SiJavascript, "#F7DF1E"],
  [/pytorch/i, SiPytorch, "#EE4C2C"],
  [/tensorflow/i, SiTensorflow, "#FF6F00"],
  [/langchain/i, SiLangchain, "#2E7D5B"],
  [/llama/i, SiMeta, "#0866FF"],
  [/flask/i, SiFlask, "#94A3B8"],
  [/fastapi/i, SiFastapi, "#009688"],
  [/postgres/i, SiPostgresql, "#4169E1"],
  [/docker/i, SiDocker, "#2496ED"],
  [/qdrant/i, SiQdrant, "#DC244C"],
  [/git/i, SiGit, "#F05032"],
];

const skillCategoryColors: Record<string, { icon: SkillIcon; color: string }> = {
  language: { icon: Code2, color: "#EAB308" },
  "ai/ml": { icon: Code2, color: "#A855F7" },
  frontend: { icon: Code2, color: "#38BDF8" },
  backend: { icon: Code2, color: "#22C55E" },
  database: { icon: Database, color: "#06B6D4" },
  tools: { icon: Code2, color: "#F97316" },
  other: { icon: Languages, color: "#6366F1" },
};

function skillVisual(name: string, category: string): { icon: SkillIcon; color: string } {
  const match = skillBrandIcons.find(([pattern]) => pattern.test(name));
  if (match) return { icon: match[1], color: match[2] };
  return skillCategoryColors[category] ?? { icon: Code2, color: "#71717A" };
}

function TrophyIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" className="shrink-0">
      <path d="M8 4h8v3a4 4 0 0 1-8 0V4Z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
      <path d="M8 6H5.5A2.5 2.5 0 0 0 8 8.5M16 6h2.5A2.5 2.5 0 0 1 16 8.5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
      <path d="M12 11v4M9.5 19h5M10 15h4v4h-4v-4Z" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

type AwardRank = {
  label: string;
  icon: ElementType;
  shape: string;
  text: string;
  bg: string;
  border: string;
};

const awardRanks: Record<"gold" | "silver" | "bronze", AwardRank> = {
  gold: {
    label: "Champagne Gold",
    icon: TrophyIcon,
    shape: "rounded-2xl",
    text: "#D4AF37",
    bg: "rgba(212, 175, 55, 0.10)",
    border: "rgba(212, 175, 55, 0.35)",
  },
  silver: {
    label: "Silver",
    icon: TrophyIcon,
    shape: "rounded-2xl",
    text: "#A1A1AA",
    bg: "rgba(161, 161, 170, 0.10)",
    border: "rgba(161, 161, 170, 0.35)",
  },
  bronze: {
    label: "Bronze / Amber",
    icon: TrophyIcon,
    shape: "rounded-2xl",
    text: "#B45309",
    bg: "rgba(180, 83, 9, 0.11)",
    border: "rgba(180, 83, 9, 0.35)",
  },
};

function trophyRank(title: string): AwardRank {
  if (/potential/i.test(title)) return awardRanks.silver;
  if (/consolation/i.test(title)) return awardRanks.bronze;
  return awardRanks.gold;
}

function NavBar({ avatar, hasBlog }: { avatar: string; hasBlog: boolean }) {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const links = hasBlog ? navLinks : navLinks.filter((link) => link.href !== "#blog");

  useEffect(() => {
    const frame = requestAnimationFrame(() => setMounted(true));
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  const toggleTheme = (event: React.MouseEvent<HTMLButtonElement>) => {
    const nextTheme = theme === "dark" ? "light" : "dark";
    const documentWithTransition = document as Document & {
      startViewTransition?: (callback: () => void) => { ready: Promise<void> };
    };

    if (!documentWithTransition.startViewTransition) {
      setTheme(nextTheme);
      return;
    }

    const x = event.clientX;
    const y = event.clientY;
    const maxRadius = Math.hypot(
      Math.max(x, window.innerWidth - x),
      Math.max(y, window.innerHeight - y)
    );

    const transition = documentWithTransition.startViewTransition(() => {
      setTheme(nextTheme);
    });

    transition.ready.then(() => {
      document.documentElement.animate(
        {
          clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${maxRadius}px at ${x}px ${y}px)`],
        },
        { duration: 800, easing: "ease-in-out", pseudoElement: "::view-transition-new(root)" }
      );
    });
  };

  if (!mounted) return null;

  return (
    <header
      className={`fixed left-1/2 top-4 z-50 w-[calc(100%-2rem)] max-w-3xl -translate-x-1/2 rounded-2xl border px-4 py-3 transition-all duration-300 ${
        scrolled
          ? "border-zinc-300/40 bg-white/70 shadow-md backdrop-blur-md dark:border-zinc-700/50 dark:bg-zinc-900/70"
          : "border-transparent bg-transparent"
      }`}
    >
      <div className="flex items-center justify-between">
        <a href="#home" className="flex items-center gap-3" aria-label="Go to home">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={avatar}
            alt="avatar"
            width={40}
            height={40}
            className="h-10 w-10 rounded-full object-cover"
          />
        </a>

        <div className="flex items-center gap-4">
          <nav className="hidden items-center gap-6 text-sm font-medium md:flex">
            {links.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-zinc-700 transition hover:text-black dark:text-zinc-200 dark:hover:text-white"
              >
                {link.title}
              </a>
            ))}
          </nav>

          <button
            type="button"
            onClick={toggleTheme}
            className="flex items-center justify-center px-1 text-zinc-700 transition dark:text-zinc-200"
            aria-label="Toggle theme"
          >
            <motion.span
              initial={{ rotate: 0 }}
              animate={{ rotate: theme === "dark" ? 0 : 180 }}
              transition={{ duration: 0.6 }}
            >
              {theme === "dark" ? <Moon size={17} /> : <Sun size={17} />}
            </motion.span>
          </button>

          <button
            type="button"
            className="text-zinc-700 transition dark:text-zinc-200 md:hidden"
            onClick={() => setOpen((value) => !value)}
            aria-label="Toggle navigation"
          >
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {open && (
        <nav className="mt-3 flex flex-col items-center gap-1 text-sm font-medium md:hidden">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className="w-full rounded-md py-2 text-center text-zinc-700 transition hover:bg-zinc-300/30 dark:text-zinc-200 dark:hover:bg-zinc-800/50"
            >
              {link.title}
            </a>
          ))}
        </nav>
      )}
    </header>
  );
}

function githubUsername(url: string): string {
  try {
    const path = new URL(url).pathname.replace(/^\/|\/$/g, "");
    return path.split("/")[0] ?? "";
  } catch {
    return "";
  }
}

function excerpt(content: string, length = 160): string {
  const plain = content.replace(/[#*_`>\[\]]/g, "").replace(/\s+/g, " ").trim();
  return plain.length > length ? `${plain.slice(0, length).trimEnd()}…` : plain;
}

export default function PortfolioPage({ data }: { data: PortfolioData }) {
  const { intro, about, skills, projects, experiences, education, awards, publications, blogs } =
    data;
  const githubHandle = intro.github ? githubUsername(intro.github) : "";

  const groupedSkills = useMemo(() => {
    const cats = Array.from(new Set(skills.map((s) => s.category)));
    cats.sort((a, b) => {
      const ia = categoryOrder.indexOf(a);
      const ib = categoryOrder.indexOf(b);
      if (ia === -1 && ib === -1) return a.localeCompare(b);
      if (ia === -1) return 1;
      if (ib === -1) return -1;
      return ia - ib;
    });
    return cats.map((category) => ({
      category,
      items: skills.filter((s) => s.category === category),
    }));
  }, [skills]);

  const socialLinks = [
    intro.github && { href: intro.github, icon: Github, label: "GitHub" },
    intro.linkedin && { href: intro.linkedin, icon: Linkedin, label: "LinkedIn" },
    intro.email && { href: `mailto:${intro.email}`, icon: Mail, label: "Email" },
    intro.phone && { href: `tel:${intro.phone}`, icon: Phone, label: "Phone" },
  ].filter(Boolean) as { href: string; icon: LucideIcon; label: string }[];

  return (
    <main id="home" className="relative min-h-screen">
      <NavBar avatar={intro.image} hasBlog={blogs.length > 0} />

      <div className="mx-auto w-full max-w-3xl space-y-16 px-4 pb-16 pt-28 sm:px-6 lg:px-8">
        {/* ===== HERO ===== */}
        <motion.section variants={container} initial="hidden" animate="show" className="flex flex-col gap-4">
          <motion.div
            variants={item}
            className="relative h-32 w-32 overflow-hidden rounded-full border-2 border-zinc-200 bg-zinc-100 shadow-md dark:border-zinc-800 dark:bg-zinc-900"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={intro.image} alt={intro.name} className="h-full w-full object-cover" />
          </motion.div>

          <motion.div variants={item}>
            <h1 className="text-4xl font-semibold md:text-6xl">Hi, I&apos;m {intro.name}</h1>
          </motion.div>

          <motion.div
            variants={item}
            className="flex min-h-[28px] flex-wrap items-baseline gap-2 md:min-h-[36px]"
          >
            <span className="text-base font-bold text-zinc-500 dark:text-zinc-400 md:text-2xl">
              I&apos;m an AI Engineer building
            </span>
            <TypewriterClient words={intro.roles} />
          </motion.div>

          <motion.div variants={item} className="flex flex-wrap items-center gap-4">
            {intro.cvFile && (
              <a
                href={intro.cvFile}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-11 items-center gap-2 rounded-md border border-zinc-300 bg-transparent px-5 text-sm font-medium transition hover:bg-zinc-100 dark:border-zinc-700 dark:hover:bg-zinc-800"
              >
                <FileText size={18} />
                Resume / CV
              </a>
            )}
            <a
              href="#contact"
              className="inline-flex h-11 items-center gap-2 rounded-md bg-zinc-900 px-5 text-sm font-medium text-white transition hover:opacity-90 dark:bg-white dark:text-zinc-900"
            >
              <Send size={16} />
              Get in touch
            </a>
          </motion.div>

          <motion.div variants={item} className="flex flex-row gap-3">
            {socialLinks.map(({ href, icon: Icon, label }) => (
              <a
                key={label}
                href={href}
                target={href.startsWith("http") ? "_blank" : undefined}
                rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
                aria-label={label}
                title={label}
                className="rounded-full border border-zinc-200 bg-zinc-100 p-3 text-zinc-600 transition-colors hover:text-zinc-900 dark:border-zinc-700/50 dark:bg-zinc-800/50 dark:text-zinc-400 dark:hover:text-white"
              >
                <Icon size={20} />
              </a>
            ))}
          </motion.div>
        </motion.section>

        {/* ===== ABOUT ===== */}
        <motion.section
          id="about"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <SectionTitle eyebrow="About" title="Me" />
          <p className="leading-relaxed opacity-80 md:text-lg">{about.desc}</p>
          <div className="mt-6 flex flex-col gap-3 text-sm sm:flex-row sm:flex-wrap sm:gap-6">
            {about.email && (
              <a href={`mailto:${about.email}`} className="flex items-center gap-2 text-zinc-700 dark:text-zinc-300">
                <Mail size={16} /> {about.email}
              </a>
            )}
            {about.phone && (
              <a href={`tel:${about.phone}`} className="flex items-center gap-2 text-zinc-700 dark:text-zinc-300">
                <Phone size={16} /> {about.phone}
              </a>
            )}
            {about.location && (
              <span className="flex items-center gap-2 text-zinc-700 dark:text-zinc-300">
                <MapPin size={16} /> {about.location}
              </span>
            )}
          </div>
        </motion.section>

        {/* ===== SKILLS ===== */}
        <section id="skills">
          <SectionTitle eyebrow="Featured" title="Skills" />
          {groupedSkills.map(({ category, items }, categoryIndex) => (
            <motion.div
              key={category}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: categoryIndex * 0.1 }}
              className="mb-8"
            >
              <h3 className="mb-6 text-lg font-bold capitalize text-zinc-800 dark:text-white md:text-xl">
                {category}
              </h3>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
                {items.map((skill) => {
                  const { icon: Icon, color } = skillVisual(skill.name, skill.category);
                  return (
                    <div
                      key={skill.name}
                      className="group flex cursor-pointer items-center justify-start gap-3 rounded-xl border border-dashed border-zinc-200 bg-white px-4 py-3 shadow-sm transition-all duration-300 hover:scale-105 hover:border-[color:var(--skill-color)] hover:shadow-lg dark:border-zinc-800/50 dark:bg-zinc-900/50 dark:hover:bg-zinc-800/80"
                      style={{ "--skill-color": color } as CSSProperties}
                    >
                      <div
                        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg transition-transform duration-300 group-hover:scale-110"
                        style={{ backgroundColor: `${color}1F` }}
                      >
                        <Icon size={16} color={color} />
                      </div>
                      <span className="truncate text-sm font-medium text-zinc-700 transition-colors group-hover:text-[color:var(--skill-color)] dark:text-zinc-300">
                        {skill.name}
                      </span>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          ))}
        </section>

        {/* ===== GITHUB ACTIVITY ===== */}
        {githubHandle && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <GithubActivity username={githubHandle} />
          </motion.div>
        )}

        {/* ===== EDUCATION ===== */}
        <section id="education">
          <SectionTitle eyebrow="Academic" title="Education" />
          <div className="flex flex-col gap-4">
            {education.map((edu) => (
              <motion.div
                key={`${edu.degree}-${edu.school}`}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-[#1e2939] dark:bg-[#171717]"
              >
                <div className="flex flex-col gap-4 md:flex-row md:items-start">
                  <IconTile icon={GraduationCap} tone="text-zinc-700 dark:text-zinc-300" />
                  <div>
                    <h3 className="text-xl font-bold">{edu.degree}</h3>
                    <p className="mt-1 text-zinc-600 dark:text-zinc-400">{edu.school}</p>
                    {edu.time && (
                      <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">{edu.time}</p>
                    )}
                    {edu.detail && (
                      <p className="mt-3 text-sm font-medium text-zinc-700 dark:text-zinc-300">
                        {edu.detail}
                      </p>
                    )}
                    {edu.language && (
                      <p className="mt-2 text-sm font-medium text-zinc-700 dark:text-zinc-300">
                        {edu.language}
                      </p>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* ===== PROJECTS ===== */}
        <section id="projects">
          <SectionTitle eyebrow="Featured" title="Projects" />
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {projects.map((project) => (
              <motion.article
                key={project.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                whileHover={{ y: -5 }}
                className="group flex h-full flex-col overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-md transition-all duration-300 hover:shadow-xl dark:border-[#1e2939] dark:bg-[#171717] dark:shadow-none"
              >
                {project.image ? (
                  <div className="relative h-48 w-full overflow-hidden bg-zinc-100 dark:bg-zinc-900">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={project.image}
                      alt={project.name}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                ) : (
                  <div className={`flex h-48 items-center justify-center bg-gradient-to-br ${project.tone}`}>
                    <Code2 className="text-white transition duration-500 group-hover:scale-110" size={58} strokeWidth={1.5} />
                  </div>
                )}
                <div className="flex flex-1 flex-col gap-2 p-3">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="text-xl font-bold tracking-tight text-zinc-900 dark:text-white">
                      {project.name}
                    </h3>
                    <div className="flex items-center gap-2 text-zinc-500 dark:text-zinc-400">
                      {project.live && (
                        <a
                          href={project.live}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="transition-colors hover:text-blue-500 dark:hover:text-blue-400"
                          aria-label={`${project.name} live preview`}
                        >
                          <Globe size={20} strokeWidth={1.5} />
                        </a>
                      )}
                      {project.repo && (
                        <a
                          href={project.repo}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="transition-colors hover:text-blue-500 dark:hover:text-blue-400"
                          aria-label={`${project.name} GitHub repository`}
                        >
                          <Github size={20} strokeWidth={1.5} />
                        </a>
                      )}
                    </div>
                  </div>
                  <p className="line-clamp-3 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
                    {project.desc}
                  </p>
                  {project.tech.length > 0 && (
                    <div className="mt-2">
                      <h4 className="mb-2 text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-500">
                        Technologies
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {project.tech.map((tech) => (
                          <span
                            key={tech}
                            className="rounded-md border border-zinc-200 bg-zinc-100 px-2.5 py-1 text-xs font-medium text-zinc-700 dark:border-zinc-700/50 dark:bg-zinc-800/50 dark:text-zinc-300"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  <div className="mt-auto flex items-center justify-between pt-4">
                    <div className="flex items-center gap-2 rounded-full border border-green-500/20 bg-green-500/10 px-2 py-1">
                      <div className="h-1.5 w-1.5 animate-pulse rounded-full bg-green-500" />
                      <span className="text-[10px] font-medium uppercase tracking-wide text-green-700 dark:text-green-400">
                        Built
                      </span>
                    </div>
                    {project.repo && (
                      <a
                        href={project.repo}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 text-sm font-medium text-zinc-600 transition-colors hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white"
                      >
                        View Code
                        <ArrowRight size={16} />
                      </a>
                    )}
                  </div>
                </div>
              </motion.article>
            ))}
          </div>
        </section>

        {/* ===== BLOG ===== */}
        {blogs.length > 0 && (
          <section id="blog">
            <SectionTitle eyebrow="Journal" title="Blog" />
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {blogs.map((post) => (
                <motion.article
                  key={post._id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5 }}
                  whileHover={{ y: -5 }}
                  className="group flex h-full flex-col overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-md transition-all duration-300 hover:shadow-xl dark:border-[#1e2939] dark:bg-[#171717] dark:shadow-none"
                >
                  {post.image ? (
                    <div className="relative h-48 w-full overflow-hidden bg-zinc-100 dark:bg-zinc-900">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={post.image}
                        alt={post.title}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    </div>
                  ) : (
                    <div className="flex h-48 items-center justify-center bg-gradient-to-br from-indigo-500 to-purple-400">
                      <BookOpen className="text-white transition duration-500 group-hover:scale-110" size={58} strokeWidth={1.5} />
                    </div>
                  )}
                  <div className="flex flex-1 flex-col gap-2 p-3">
                    <p className="text-xs text-zinc-500 dark:text-zinc-400">
                      {new Date(post.createdAt).toLocaleDateString(undefined, {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                    <h3 className="text-xl font-bold tracking-tight text-zinc-900 dark:text-white">
                      {post.title}
                    </h3>
                    <p className="line-clamp-3 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
                      {excerpt(post.content)}
                    </p>
                    {post.tags.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-2">
                        {post.tags.map((tag) => (
                          <span
                            key={tag}
                            className="rounded-md border border-zinc-200 bg-zinc-100 px-2.5 py-1 text-xs font-medium text-zinc-700 dark:border-zinc-700/50 dark:bg-zinc-800/50 dark:text-zinc-300"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                    <div className="mt-auto pt-4">
                      <Link
                        href={`/blog/${post._id}`}
                        className="flex items-center gap-1 text-sm font-medium text-zinc-600 transition-colors hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white"
                      >
                        Read more
                        <ArrowRight size={16} />
                      </Link>
                    </div>
                  </div>
                </motion.article>
              ))}
            </div>
          </section>
        )}

        {/* ===== EXPERIENCE ===== */}
        <section id="experience">
          <SectionTitle eyebrow="Career" title="Experience" />
          <div className="relative space-y-4 before:absolute before:bottom-0 before:left-6 before:top-0 before:w-px before:bg-zinc-200 dark:before:bg-zinc-800">
            {experiences.map((experience) => (
              <motion.article
                key={`${experience.company}-${experience.time}`}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="relative ml-12 rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-[#1e2939] dark:bg-[#171717]"
              >
                <div className="absolute -left-[3.25rem] top-5 flex h-12 w-12 items-center justify-center rounded-full border border-zinc-200 bg-white text-zinc-700 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-300">
                  <BriefcaseBusiness size={19} />
                </div>
                <h3 className="text-lg font-bold">{experience.role}</h3>
                <p className="mt-1 text-sm font-medium text-zinc-600 dark:text-zinc-400">
                  {experience.company}
                </p>
                {experience.time && (
                  <p className="mt-2 text-xs font-medium text-zinc-500 dark:text-zinc-400">
                    {experience.time}
                  </p>
                )}
                <p className="mt-4 text-sm leading-7 text-zinc-600 dark:text-zinc-400">
                  {experience.desc}
                </p>
              </motion.article>
            ))}
          </div>
        </section>

        {/* ===== AWARDS ===== */}
        <section id="awards">
          <SectionTitle eyebrow="Honors" title="Awards" />
          <div className="grid gap-4 md:grid-cols-2">
            {awards.map((award) => {
              const rank = trophyRank(award.title);
              return (
                <motion.article
                  key={award.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm transition hover:shadow-md dark:border-[#1e2939] dark:bg-[#171717]"
                >
                  <div className="flex items-start gap-4">
                    <div
                      className={`flex h-12 w-12 shrink-0 items-center justify-center border ${rank.shape}`}
                      style={{
                        borderColor: rank.border,
                        backgroundColor: rank.bg,
                        color: rank.text,
                      }}
                    >
                      <rank.icon />
                    </div>
                    <div className="min-w-0">
                      <h3 className="text-lg font-bold leading-snug">{award.title}</h3>
                    </div>
                  </div>
                  <hr className="my-4 border-zinc-200 dark:border-zinc-800" />
                  <p className="text-sm leading-6 text-zinc-600 dark:text-zinc-400">{award.desc}</p>
                  {award.time && (
                    <p className="mt-3 text-xs font-medium text-zinc-500 dark:text-zinc-400">{award.time}</p>
                  )}
                </motion.article>
              );
            })}
          </div>
        </section>

        {/* ===== PUBLICATIONS ===== */}
        <section id="publications">
          <SectionTitle eyebrow="Research" title="Publications" />
          <div className="space-y-4">
            {publications.map((publication) => (
              <motion.article
                key={publication.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="flex gap-4 rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-[#1e2939] dark:bg-[#171717]"
              >
                <IconTile icon={BookOpen} tone="text-zinc-700 dark:text-zinc-300" />
                <div>
                  <h3 className="font-bold">{publication.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-zinc-600 dark:text-zinc-400">
                    {publication.desc}{" "}
                    {publication.href && (
                      <a
                        href={publication.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-medium text-zinc-900 underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-900 dark:text-zinc-100 dark:decoration-zinc-600 dark:hover:decoration-white"
                      >
                        View publication
                      </a>
                    )}
                  </p>
                </div>
              </motion.article>
            ))}
          </div>
        </section>

        {/* ===== CONTACT ===== */}
        <ContactSection email={intro.email || about.email} />
      </div>

      <footer className="border-t border-zinc-200 px-5 py-8 text-center text-sm text-zinc-500 dark:border-zinc-800 dark:text-zinc-400">
        <p>Designed by {intro.name}.</p>
      </footer>
    </main>
  );
}

function ContactSection({ email }: { email: string }) {
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formEl = event.currentTarget;
    const fd = new FormData(formEl);
    const payload = {
      name: String(fd.get("name") ?? ""),
      email: String(fd.get("email") ?? ""),
      message: String(fd.get("message") ?? ""),
    };
    setStatus("sending");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error();
      setStatus("sent");
      formEl.reset();
    } catch {
      // Fallback: open the user's mail client if the API/DB is unavailable.
      setStatus("error");
      const subject = `Portfolio contact from ${payload.name}`;
      const body = `Name: ${payload.name}\nEmail: ${payload.email}\n\n${payload.message}`;
      window.location.href = `mailto:${email}?subject=${encodeURIComponent(
        subject
      )}&body=${encodeURIComponent(body)}`;
    }
  }

  return (
    <section id="contact" className="flex flex-col gap-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <div className="flex flex-col items-center gap-4 text-center">
          <h2 className="text-2xl font-extrabold text-zinc-900 dark:text-white md:text-4xl">Contact</h2>
          <p className="text-sm font-medium text-zinc-600 dark:text-zinc-400 md:text-lg">
            Get in touch with me. I will get back to you as soon as possible.
          </p>
        </div>
        <hr className="mt-10 border-zinc-200 dark:border-zinc-800" />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.15 }}
      >
        <div className="flex flex-col gap-2">
          <h3 className="font-semibold">Send me a message</h3>
          <p className="text-xs text-zinc-600 dark:text-zinc-400 md:text-sm">
            Fill out the form below and I will get back to you as soon as possible.
          </p>
        </div>
        <form onSubmit={handleSubmit} className="mt-5 flex flex-col gap-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium">Name *</label>
              <input
                type="text"
                name="name"
                required
                placeholder="Your full name"
                className="h-11 rounded-md border border-zinc-300 bg-transparent px-3 text-sm outline-none transition focus:border-blue-500 dark:border-zinc-700"
                suppressHydrationWarning
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium">Email *</label>
              <input
                type="email"
                name="email"
                required
                placeholder="your.email@example.com"
                className="h-11 rounded-md border border-zinc-300 bg-transparent px-3 text-sm outline-none transition focus:border-blue-500 dark:border-zinc-700"
                suppressHydrationWarning
              />
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium">Message *</label>
            <textarea
              name="message"
              required
              placeholder="Tell me about your project or just say hello..."
              className="h-32 resize-none rounded-md border border-zinc-300 bg-transparent px-3 py-2 text-sm outline-none transition focus:border-blue-500 dark:border-zinc-700"
              suppressHydrationWarning
            />
          </div>
          <div className="flex items-center gap-4">
            <button
              type="submit"
              disabled={status === "sending"}
              className="inline-flex h-11 w-40 items-center justify-center gap-2 rounded-md bg-zinc-900 text-sm font-semibold text-white transition hover:opacity-90 disabled:opacity-60 dark:bg-white dark:text-zinc-900"
            >
              <Send size={16} />
              {status === "sending" ? "Sending..." : "Send Message"}
            </button>
            {status === "sent" && (
              <span className="text-sm text-green-600 dark:text-green-400">Message sent!</span>
            )}
          </div>
        </form>
      </motion.div>
    </section>
  );
}
