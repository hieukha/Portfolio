import { Schema, model, models } from "mongoose";

export interface IAward {
  _id?: string;
  title: string;
  desc: string;
  time: string;
  priority: number;
}

const awardSchema = new Schema<IAward>(
  {
    title: { type: String, required: true, trim: true },
    desc: { type: String, default: "" },
    time: { type: String, default: "" },
    priority: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const Award = models.Award || model<IAward>("Award", awardSchema);
export default Award;
