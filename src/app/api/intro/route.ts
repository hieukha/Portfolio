import Intro from "@/models/intro.model";
import { singletonHandlers } from "@/lib/crud";

export const { GET, PUT } = singletonHandlers(Intro);
