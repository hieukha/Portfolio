import Publication from "@/models/publication.model";
import { itemHandlers } from "@/lib/crud";

export const { PUT, DELETE } = itemHandlers(Publication);
