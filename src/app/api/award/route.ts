import Award from "@/models/award.model";
import { collectionHandlers } from "@/lib/crud";

export const { GET, POST } = collectionHandlers(Award);
