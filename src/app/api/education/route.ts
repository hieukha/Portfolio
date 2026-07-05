import Education from "@/models/education.model";
import { collectionHandlers } from "@/lib/crud";

export const { GET, POST } = collectionHandlers(Education);
