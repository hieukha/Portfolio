import ContactMessage from "@/models/contactMessage.model";
import { itemHandlers } from "@/lib/crud";

// Only DELETE is meaningful for messages (no editing).
export const { DELETE } = itemHandlers(ContactMessage);
