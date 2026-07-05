import { NextRequest } from "next/server";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { getPortfolioData } from "@/lib/portfolio-data";
import { retrieveContext } from "@/lib/vectorStore";
import { saveMessage, getChatHistory } from "@/lib/chatMemory";
import { systemPromptTemplate } from "@/lib/prompt";

async function buildPortfolioContext(query: string): Promise<string> {
  const data = await getPortfolioData();
  const sections: string[] = [];

  sections.push(
    `## Introduction\n- Name: ${data.intro.name}\n- Focus areas: ${data.intro.roles.join(", ")}\n- Bio: ${data.intro.desc}`
  );

  sections.push(`## About\n${data.about.desc}`);

  if (data.skills.length > 0) {
    const grouped: Record<string, string[]> = {};
    data.skills.forEach((s) => {
      (grouped[s.category] ??= []).push(s.name);
    });
    const lines = Object.entries(grouped).map(
      ([cat, names]) => `- **${cat}**: ${names.join(", ")}`
    );
    sections.push(`## Skills\n${lines.join("\n")}`);
  }

  if (data.experiences.length > 0) {
    const lines = data.experiences.map(
      (e) => `- **${e.role} @ ${e.company}** (${e.time})\n  ${e.desc}`
    );
    sections.push(`## Experience\n${lines.join("\n")}`);
  }

  if (data.education.length > 0) {
    const lines = data.education.map(
      (e) =>
        `- **${e.degree}**, ${e.school} (${e.time})\n  ${e.detail}${e.language ? ` | ${e.language}` : ""}`
    );
    sections.push(`## Education\n${lines.join("\n")}`);
  }

  if (data.projects.length > 0) {
    const lines = data.projects.map(
      (p) =>
        `- **${p.name}**: ${p.desc}\n  Tech: ${p.tech.join(", ")} | Repo: ${p.repo || "N/A"}`
    );
    sections.push(`## Projects (${data.projects.length} total)\n${lines.join("\n")}`);
  }

  if (data.awards.length > 0) {
    const lines = data.awards.map((a) => `- **${a.title}** (${a.time}): ${a.desc}`);
    sections.push(`## Awards\n${lines.join("\n")}`);
  }

  if (data.publications.length > 0) {
    const lines = data.publications.map((p) => `- **${p.title}**: ${p.desc}`);
    sections.push(`## Publications\n${lines.join("\n")}`);
  }

  let context = sections.join("\n\n");

  try {
    const ragContext = await retrieveContext(query);
    if (ragContext && ragContext !== "No relevant data found in portfolio") {
      context += `\n\n## Additional Details (from vector search)\n${ragContext}`;
    }
  } catch {
    // RAG is a supplement only — safe to skip on failure.
  }

  return context;
}

export async function POST(req: NextRequest) {
  try {
    const { message, sessionId } = await req.json();

    if (!message || !sessionId) {
      return new Response("Invalid request", { status: 400 });
    }

    const cleanMessage = String(message).trim().slice(0, 1000);

    await saveMessage(sessionId, "user", cleanMessage);
    const history = await getChatHistory(sessionId);
    const retrievedContext = await buildPortfolioContext(cleanMessage);

    const model = new ChatGoogleGenerativeAI({
      model: "gemini-2.5-flash",
      maxOutputTokens: 800,
      apiKey: process.env.GOOGLE_API_KEY!,
    });

    const chain = systemPromptTemplate.pipe(model).pipe(new StringOutputParser());

    const stream = await chain.stream({
      retrieved_context: retrievedContext,
      chat_history: history,
      message: cleanMessage,
    });

    let fullResponse = "";
    const encoder = new TextEncoder();

    const readable = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of stream) {
            fullResponse += chunk;
            controller.enqueue(encoder.encode(chunk));
          }
          saveMessage(sessionId, "assistant", fullResponse).catch(() => {});
          controller.close();
        } catch (err) {
          controller.error(err);
        }
      },
    });

    return new Response(readable, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "no-cache",
      },
    });
  } catch (error) {
    console.error(error);
    return new Response("Server Error", { status: 500 });
  }
}
