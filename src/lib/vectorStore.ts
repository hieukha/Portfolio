import { QdrantVectorStore } from "@langchain/qdrant";
import { qdrant, collectionName } from "./qdrant";
import { embeddings } from "./embeddings";

let cachedStore: QdrantVectorStore | null = null;

export const getVectorStore = async () => {
  if (cachedStore) return cachedStore;

  cachedStore = await QdrantVectorStore.fromExistingCollection(embeddings, {
    client: qdrant,
    collectionName,
  });

  return cachedStore;
};

export const retrieveContext = async (query: string) => {
  try {
    const store = await getVectorStore();
    const retriever = store.asRetriever({ k: 6 });

    const docs = await retriever.invoke(query);

    if (!docs || docs.length === 0) {
      return "No relevant data found in portfolio";
    }

    return docs.map((doc) => doc.pageContent).join("\n\n");
  } catch {
    return "No relevant data found in portfolio";
  }
};
