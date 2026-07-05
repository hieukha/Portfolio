import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";

let cachedEmbeddings: GoogleGenerativeAIEmbeddings | null = null;

export const getEmbeddings = () => {
  if (cachedEmbeddings) return cachedEmbeddings;

  if (!process.env.GOOGLE_API_KEY) {
    throw new Error("Missing GOOGLE_API_KEY in environment");
  }

  cachedEmbeddings = new GoogleGenerativeAIEmbeddings({
    apiKey: process.env.GOOGLE_API_KEY,
    model: "text-embedding-004",
  });

  return cachedEmbeddings;
};
