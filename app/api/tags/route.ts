import { NextResponse } from "next/server";
import { auth } from "@/lib/auth/auth";
import prisma from "@/lib/db/prisma";

export const dynamic = "force-dynamic";

/** Returns all tags. Used by the editor sidebar tag picker. */
export async function GET() {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const tags = await prisma.tag.findMany({
    orderBy: { name: "asc" },
    select: { id: true, name: true, slug: true },
  });

  return NextResponse.json(tags);
}
