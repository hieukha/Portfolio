import { NextRequest, NextResponse } from "next/server";
import type { Model, SortOrder } from "mongoose";
import { ConnectDB } from "@/lib/db";
import { auth } from "@/auth";

async function isAuthed() {
  const session = await auth();
  return !!session?.user;
}

const unauthorized = () =>
  NextResponse.json({ error: "Unauthorized" }, { status: 401 });

type Ctx = { params: Promise<{ id: string }> };

/** GET (public list) + POST (protected create) for a collection. */
export function collectionHandlers<T>(
  model: Model<T>,
  sort: Record<string, SortOrder> = { priority: 1, createdAt: -1 }
) {
  return {
    GET: async () => {
      await ConnectDB();
      const items = await model.find().sort(sort).lean();
      return NextResponse.json(items);
    },
    POST: async (req: NextRequest) => {
      if (!(await isAuthed())) return unauthorized();
      await ConnectDB();
      const body = await req.json();
      const created = await model.create(body);
      return NextResponse.json(created, { status: 201 });
    },
  };
}

/** GET (public single item) + PUT (update) + DELETE for an item by id. */
export function itemHandlers<T>(model: Model<T>) {
  return {
    GET: async (_req: NextRequest, ctx: Ctx) => {
      await ConnectDB();
      const { id } = await ctx.params;
      const item = await model.findById(id).lean();
      if (!item) return NextResponse.json({ error: "Not found" }, { status: 404 });
      return NextResponse.json(item);
    },
    PUT: async (req: NextRequest, ctx: Ctx) => {
      if (!(await isAuthed())) return unauthorized();
      await ConnectDB();
      const { id } = await ctx.params;
      const body = await req.json();
      const updated = await model.findByIdAndUpdate(id, body, { new: true });
      return NextResponse.json(updated);
    },
    DELETE: async (_req: NextRequest, ctx: Ctx) => {
      if (!(await isAuthed())) return unauthorized();
      await ConnectDB();
      const { id } = await ctx.params;
      await model.findByIdAndDelete(id);
      return NextResponse.json({ ok: true });
    },
  };
}

/** GET + PUT (upsert) for a single-document collection (intro, about). */
export function singletonHandlers<T>(model: Model<T>) {
  return {
    GET: async () => {
      await ConnectDB();
      const doc = await model.findOne().sort({ updatedAt: -1 }).lean();
      return NextResponse.json(doc);
    },
    PUT: async (req: NextRequest) => {
      if (!(await isAuthed())) return unauthorized();
      await ConnectDB();
      const body = await req.json();
      const existing = await model.findOne().sort({ updatedAt: -1 });
      const doc = existing
        ? await model.findByIdAndUpdate(existing._id, body, { new: true })
        : await model.create(body);
      return NextResponse.json(doc);
    },
  };
}
