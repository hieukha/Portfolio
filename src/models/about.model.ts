import { Schema, model, models } from "mongoose";

export interface IAbout {
  _id?: string;
  desc: string;
  email: string;
  phone: string;
  location: string;
}

const aboutSchema = new Schema<IAbout>(
  {
    desc: { type: String, default: "" },
    email: { type: String, default: "" },
    phone: { type: String, default: "" },
    location: { type: String, default: "" },
  },
  { timestamps: true }
);

const About = models.About || model<IAbout>("About", aboutSchema);
export default About;
