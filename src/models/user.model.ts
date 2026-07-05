import { Schema, model, models } from "mongoose";

export interface IUser {
  _id?: string;
  email: string;
  password: string;
}

const userSchema = new Schema<IUser>(
  {
    email: { type: String, required: true, unique: true, trim: true, lowercase: true },
    password: { type: String, required: true, minlength: 6 },
  },
  { timestamps: true }
);

const User = models.User || model<IUser>("User", userSchema);
export default User;
