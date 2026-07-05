import About from "@/models/about.model";
import { singletonHandlers } from "@/lib/crud";

export const { GET, PUT } = singletonHandlers(About);
