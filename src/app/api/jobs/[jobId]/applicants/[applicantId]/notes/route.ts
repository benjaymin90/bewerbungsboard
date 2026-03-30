import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireOrgId, requireSession } from "@/lib/auth";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ applicantId: string }> }
) {
  try {
    await requireOrgId();
    const { applicantId } = await params;

    const notes = await db.note.findMany({
      where: { applicantId },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(notes);
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ applicantId: string }> }
) {
  try {
    const session = await requireSession();
    const { applicantId } = await params;
    const { body } = await request.json();

    if (!body) {
      return NextResponse.json(
        { error: "Pflichtfelder fehlen" },
        { status: 400 }
      );
    }

    const note = await db.note.create({
      data: {
        applicantId,
        authorId: session.userId,
        authorName: session.name ?? session.email,
        body,
      },
    });

    return NextResponse.json(note, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}
