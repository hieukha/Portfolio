import { Schema, model, models } from "mongoose";

export interface IPublication {
  _id?: string;
  title: string;
  desc: string;
  href: string;
  priority: number;
}

const publicationSchema = new Schema<IPublication>(
  {
    title: { type: String, required: true, trim: true },
    desc: { type: String, default: "" },
    href: { type: String, default: "" },
    priority: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const Publication =
  models.Publication || model<IPublication>("Publication", publicationSchema);
export default Publication;
