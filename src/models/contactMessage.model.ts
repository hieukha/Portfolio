import { Schema, model, models } from "mongoose";

export interface IContactMessage {
  _id?: string;
  name: string;
  email: string;
  message: string;
}

const contactMessageSchema = new Schema<IContactMessage>(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true },
    message: { type: String, required: true },
  },
  { timestamps: true }
);

const ContactMessage =
  models.ContactMessage ||
  model<IContactMessage>("ContactMessage", contactMessageSchema);
export default ContactMessage;
