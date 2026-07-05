import Award from "@/models/award.model";
import { itemHandlers } from "@/lib/crud";

export const { PUT, DELETE } = itemHandlers(Award);
