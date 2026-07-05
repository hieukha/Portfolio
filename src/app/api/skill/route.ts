import Skill from "@/models/skill.model";
import { collectionHandlers } from "@/lib/crud";

export const { GET, POST } = collectionHandlers(Skill);
