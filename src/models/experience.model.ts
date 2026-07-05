import { Schema, model, models } from "mongoose";

export interface IExperience {
  _id?: string;
  role: string;
  company: string;
  time: string;
  desc: string;
  priority: number;
}

const experienceSchema = new Schema<IExperience>(
  {
    role: { type: String, required: true, trim: true },
    company: { type: String, required: true, trim: true },
    time: { type: String, default: "" },
    desc: { type: String, default: "" },
    priority: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const Experience =
  models.Experience || model<IExperience>("Experience", experienceSchema);
export default Experience;
