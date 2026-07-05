import Publication from "@/models/publication.model";
import { collectionHandlers } from "@/lib/crud";

export const { GET, POST } = collectionHandlers(Publication);
