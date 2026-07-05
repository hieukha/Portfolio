import { NextRequest, NextResponse } from "next/server";
import { ConnectDB } from "@/lib/db";
import { auth } from "@/auth";
import ContactMessage from "@/models/contactMessage.model";

// Public: visitors submit a message.
export async function POST(req: NextRequest) {
  await ConnectDB();
  const body = await req.json();
  const { name, email, message } = body ?? {};
  if (!name || !email || !message) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }
  await ContactMessage.create({ name, email, message });
  return NextResponse.json({ success: true }, { status: 201 });
}

// Protected: admin reads all messages.
export async function GET() {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  await ConnectDB();
  const items = await ContactMessage.find().sort({ createdAt: -1 }).lean();
  return NextResponse.json(items);
}
