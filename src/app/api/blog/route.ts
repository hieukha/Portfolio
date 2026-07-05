import Blog from "@/models/blog.model";
import { collectionHandlers } from "@/lib/crud";

export const { GET, POST } = collectionHandlers(Blog, { createdAt: -1 });
