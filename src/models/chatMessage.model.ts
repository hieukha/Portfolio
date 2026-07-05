import { Schema, model, models } from "mongoose";

export interface IChatMessage {
  _id?: string;
  sessionId: string;
  role: "user" | "assistant";
  content: string;
}

const chatMessageSchema = new Schema<IChatMessage>(
  {
    sessionId: { type: String, required: true, index: true },
    role: { type: String, enum: ["user", "assistant"], required: true },
    content: { type: String, required: true },
  },
  { timestamps: true }
);

const ChatMessage =
  models.ChatMessage || model<IChatMessage>("ChatMessage", chatMessageSchema);
export default ChatMessage;
