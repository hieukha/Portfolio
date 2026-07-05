import { Schema, model, models } from "mongoose";

export interface IBlog {
  _id?: string;
  title: string;
  image: string;
  tags: string[];
  content: string;
}

const blogSchema = new Schema<IBlog>(
  {
    title: { type: String, required: true, trim: true, unique: true },
    image: { type: String, default: "" },
    tags: { type: [String], default: [] },
    content: { type: String, default: "" },
  },
  { timestamps: true }
);

const Blog = models.Blog || model<IBlog>("Blog", blogSchema);
export default Blog;
