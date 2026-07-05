import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import ReactMarkdown from "react-markdown";
import GlobalChatWidget from "@/components/GlobalChatWidget";
import { getBlogById } from "@/lib/portfolio-data";

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const post = await getBlogById(id);
  if (!post) notFound();

  return (
    <main className="mx-auto w-full max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
      <Link
        href="/#blog"
        className="inline-flex items-center gap-2 text-sm font-medium text-zinc-600 transition hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white"
      >
        <ArrowLeft size={16} />
        Back to Blog
      </Link>

      <article className="mt-8">
        {post.image && (
          <div className="relative mb-8 h-64 w-full overflow-hidden rounded-2xl sm:h-80">
            <Image
              src={post.image}
              alt={post.title}
              fill
              priority
              sizes="768px"
              className="object-cover"
            />
          </div>
        )}

        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          {new Date(post.createdAt).toLocaleDateString(undefined, {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </p>
        <h1 className="mt-2 text-3xl font-bold md:text-4xl">{post.title}</h1>

        {post.tags.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
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

        <div className="mt-8 flex flex-col gap-4 leading-relaxed text-zinc-700 dark:text-zinc-300 [&_a]:text-blue-600 [&_a]:underline dark:[&_a]:text-blue-400 [&_code]:rounded [&_code]:bg-zinc-100 [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:text-sm dark:[&_code]:bg-zinc-800 [&_h1]:text-2xl [&_h1]:font-bold [&_h2]:text-xl [&_h2]:font-bold [&_h3]:text-lg [&_h3]:font-bold [&_li]:ml-5 [&_ol]:list-decimal [&_pre]:overflow-x-auto [&_pre]:rounded-lg [&_pre]:bg-zinc-900 [&_pre]:p-4 [&_pre]:text-zinc-100 [&_ul]:list-disc">
          <ReactMarkdown>{post.content}</ReactMarkdown>
        </div>
      </article>
      <GlobalChatWidget />
    </main>
  );
}
