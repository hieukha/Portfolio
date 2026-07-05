// Embeds Blog posts and Publications into Qdrant so the chatbot can
// semantically search long-form content that isn't dumped into every prompt.
// Run with: npm run ingest   (re-running replaces existing vectors for that content)
import mongoose from "mongoose";
import { QdrantClient } from "@qdrant/js-client-rest";
import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import { QdrantVectorStore } from "@langchain/qdrant";

const { MONGODB_URI, GOOGLE_API_KEY, QDRANT_URL, QDRANT_API_KEY, QDRANT_COLLECTION_NAME } =
  process.env;

if (!MONGODB_URI || !GOOGLE_API_KEY) {
  console.error("Missing env. Ensure MONGODB_URI and GOOGLE_API_KEY are set in .env.local");
  process.exit(1);
}

const collectionName = QDRANT_COLLECTION_NAME || "portfolio-ai";
const url = QDRANT_URL || "http://localhost:6333";

const S = mongoose.Schema;
const model = (name, def) =>
  mongoose.models[name] || mongoose.model(name, new S(def, { timestamps: true }));

const Blog = model("Blog", { title: String, image: String, tags: [String], content: String });
const Publication = model("Publication", { title: String, desc: String, href: String });

function chunkText(text, size = 1000, overlap = 100) {
  const chunks = [];
  let i = 0;
  while (i < text.length) {
    chunks.push(text.slice(i, i + size));
    if (i + size >= text.length) break;
    i += size - overlap;
  }
  return chunks;
}

await mongoose.connect(MONGODB_URI);

const [blogs, publications] = await Promise.all([Blog.find().lean(), Publication.find().lean()]);

const docs = [];
for (const b of blogs) {
  const text = `${b.title}\n\n${b.content ?? ""}`;
  chunkText(text).forEach((chunk, idx) => {
    docs.push({
      pageContent: chunk,
      metadata: { source: "blog", title: b.title, id: String(b._id), chunk: idx },
    });
  });
}
for (const p of publications) {
  docs.push({
    pageContent: `${p.title}\n${p.desc ?? ""}`,
    metadata: { source: "publication", title: p.title },
  });
}

if (docs.length === 0) {
  console.log(
    "No blog posts or publications to ingest yet. The chatbot still works fine using core portfolio data — run this again after adding blog content."
  );
  await mongoose.disconnect();
  process.exit(0);
}

const qdrant = new QdrantClient({ url, apiKey: QDRANT_API_KEY });

const existing = await qdrant.getCollections();
if (existing.collections?.some((c) => c.name === collectionName)) {
  console.log(`Clearing existing Qdrant collection "${collectionName}"...`);
  await qdrant.deleteCollection(collectionName);
}

console.log(`Creating Qdrant collection "${collectionName}" (size 768, cosine)...`);
await qdrant.createCollection(collectionName, {
  vectors: { size: 768, distance: "Cosine" },
});

const embeddings = new GoogleGenerativeAIEmbeddings({
  apiKey: GOOGLE_API_KEY,
  model: "text-embedding-004",
});

await QdrantVectorStore.fromDocuments(docs, embeddings, { client: qdrant, collectionName });

console.log(
  `Ingested ${docs.length} chunks (${blogs.length} blog posts, ${publications.length} publications) into Qdrant collection "${collectionName}".`
);
await mongoose.disconnect();
process.exit(0);
