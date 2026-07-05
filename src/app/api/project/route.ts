import Project from "@/models/project.model";
import { collectionHandlers } from "@/lib/crud";

export const { GET, POST } = collectionHandlers(Project);
