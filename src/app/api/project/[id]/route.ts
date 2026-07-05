import Project from "@/models/project.model";
import { itemHandlers } from "@/lib/crud";

export const { PUT, DELETE } = itemHandlers(Project);
