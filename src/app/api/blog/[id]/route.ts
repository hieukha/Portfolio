import Blog from "@/models/blog.model";
import { itemHandlers } from "@/lib/crud";

export const { GET, PUT, DELETE } = itemHandlers(Blog, (id) => [`/blog/${id}`]);
