"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import dynamic from "next/dynamic";

const ActivityCalendar = dynamic(
  () => import("react-activity-calendar").then((mod) => mod.ActivityCalendar),
  { ssr: false }
);

type ContributionLevel = "NONE" | "FIRST_QUARTILE" | "SECOND_QUARTILE" | "THIRD_QUARTILE" | "FOURTH_QUARTILE";
type ApiContribution = { date: string; contributionCount: number; contributionLevel: ContributionLevel };
type CalendarContribution = { date: string; count: number; level: 0 | 1 | 2 | 3 | 4 };

const levelMap: Record<ContributionLevel, CalendarContribution["level"]> = {
  NONE: 0,
  FIRST_QUARTILE: 1,
  SECOND_QUARTILE: 2,
  THIRD_QUARTILE: 3,
  FOURTH_QUARTILE: 4,
};

export default function GithubActivity({ username }: { username: string }) {
  const { resolvedTheme } = useTheme();
  const [data, setData] = useState<CalendarContribution[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let cancelled = false;
    async function fetchData() {
      try {
        const res = await fetch(`https://github-contributions-api.deno.dev/${username}.json`);
        if (!res.ok) throw new Error("fetch failed");
        const json = await res.json();
        const flat: ApiContribution[] = (json.contributions ?? []).flat();
        const formatted = flat.map((c) => ({
          date: c.date,
          count: c.contributionCount,
          level: levelMap[c.contributionLevel],
        }));
        if (!cancelled) {
          setData(formatted);
          setTotal(formatted.reduce((sum, c) => sum + c.count, 0));
        }
      } catch {
        if (!cancelled) setError(true);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    fetchData();
    return () => {
      cancelled = true;
    };
  }, [username]);

  if (error) return null;

  return (
    <section id="github" className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div className="flex flex-col">
          <p className="text-sm text-gray-700 dark:text-gray-400">Featured</p>
          <h2 className="text-xl font-bold md:text-xl">GitHub Activity</h2>
        </div>
        {!loading && (
          <span className="rounded-md bg-zinc-100 px-2 py-1 text-xs font-medium text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300">
            {total.toLocaleString()} contributions
          </span>
        )}
      </div>

      {loading ? (
        <div className="h-[140px] w-full animate-pulse rounded-xl bg-zinc-100 dark:bg-zinc-900" />
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-[#1e2939] dark:bg-[#171717]">
          <ActivityCalendar
            data={data}
            blockSize={12}
            blockMargin={4}
            fontSize={12}
            colorScheme={resolvedTheme === "dark" ? "dark" : "light"}
            theme={{
              light: ["#ebedf0", "#9be9a8", "#40c463", "#30a14e", "#216e39"],
              dark: ["#161b22", "#0e4429", "#006d32", "#26a641", "#39d353"],
            }}
          />
        </div>
      )}
    </section>
  );
}
