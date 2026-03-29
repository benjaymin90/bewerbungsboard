import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { requireOrgId } from "@/lib/auth";

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
    await requireOrgId();
    const { userId } = await auth();
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
        authorId: userId!,
        authorName: "Recruiter",
        body,
      },
    });

    return NextResponse.json(note, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}
