import Experience from "@/models/experience.model";
import { itemHandlers } from "@/lib/crud";

export const { PUT, DELETE } = itemHandlers(Experience);
