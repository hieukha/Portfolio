import { Schema, model, models } from "mongoose";

export interface IEducation {
  _id?: string;
  degree: string;
  school: string;
  detail: string;
  time: string;
  language: string;
  priority: number;
}

const educationSchema = new Schema<IEducation>(
  {
    degree: { type: String, required: true, trim: true },
    school: { type: String, required: true, trim: true },
    detail: { type: String, default: "" },
    time: { type: String, default: "" },
    language: { type: String, default: "" },
    priority: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const Education =
  models.Education || model<IEducation>("Education", educationSchema);
export default Education;
