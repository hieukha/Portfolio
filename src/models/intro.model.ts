import { Schema, model, models } from "mongoose";

export interface IIntro {
  _id?: string;
  name: string;
  roles: string[];
  desc: string;
  image: string;
  cvFile: string;
  github: string;
  linkedin: string;
  email: string;
  phone: string;
}

const introSchema = new Schema<IIntro>(
  {
    name: { type: String, required: true, trim: true },
    roles: { type: [String], default: [] },
    desc: { type: String, default: "" },
    image: { type: String, default: "" },
    cvFile: { type: String, default: "" },
    github: { type: String, default: "" },
    linkedin: { type: String, default: "" },
    email: { type: String, default: "" },
    phone: { type: String, default: "" },
  },
  { timestamps: true }
);

const Intro = models.Intro || model<IIntro>("Intro", introSchema);
export default Intro;
