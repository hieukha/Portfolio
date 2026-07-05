// Seed / update the single admin login user from env vars.
// Run with: npm run create-admin
import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const { MONGODB_URI, ADMIN_EMAIL, ADMIN_PASSWORD } = process.env;

if (!MONGODB_URI || !ADMIN_EMAIL || !ADMIN_PASSWORD) {
  console.error(
    "Missing env. Ensure MONGODB_URI, ADMIN_EMAIL and ADMIN_PASSWORD are set in .env.local"
  );
  process.exit(1);
}

const userSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true },
  },
  { timestamps: true }
);
const User = mongoose.models.User || mongoose.model("User", userSchema);

await mongoose.connect(MONGODB_URI);

const email = ADMIN_EMAIL.toLowerCase();
const hash = await bcrypt.hash(ADMIN_PASSWORD, 10);

const existing = await User.findOne({ email });
if (existing) {
  existing.password = hash;
  await existing.save();
  console.log(`Updated admin password for ${email}`);
} else {
  await User.create({ email, password: hash });
  console.log(`Created admin user ${email}`);
}

await mongoose.disconnect();
process.exit(0);
