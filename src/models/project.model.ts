import { Schema, model, models } from "mongoose";

export interface IProject {
  _id?: string;
  name: string;
  desc: string;
  tech: string[];
  repo: string;
  live: string;
  image: string;
  tone: string;
  priority: number;
}

const projectSchema = new Schema<IProject>(
  {
    name: { type: String, required: true, trim: true },
    desc: { type: String, default: "" },
    tech: { type: [String], default: [] },
    repo: { type: String, default: "" },
    live: { type: String, default: "" },
    image: { type: String, default: "" },
    tone: { type: String, default: "from-blue-500 to-cyan-400" },
    priority: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const Project = models.Project || model<IProject>("Project", projectSchema);
export default Project;
