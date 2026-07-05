import Skill from "@/models/skill.model";
import { itemHandlers } from "@/lib/crud";

export const { PUT, DELETE } = itemHandlers(Skill);
