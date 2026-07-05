import Experience from "@/models/experience.model";
import { collectionHandlers } from "@/lib/crud";

export const { GET, POST } = collectionHandlers(Experience);
