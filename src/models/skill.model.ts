import { Schema, model, models } from "mongoose";

export interface ISkill {
  _id?: string;
  category: string;
  name: string;
  priority: number;
}

const skillSchema = new Schema<ISkill>(
  {
    category: { type: String, required: true, trim: true },
    name: { type: String, required: true, trim: true },
    priority: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const Skill = models.Skill || model<ISkill>("Skill", skillSchema);
export default Skill;
