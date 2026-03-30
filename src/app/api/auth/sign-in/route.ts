import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { createSession } from "@/lib/session";
import bcrypt from "bcryptjs";

export async function POST(req: NextRequest) {
  const { email, password } = await req.json();

  if (!email || !password) {
    return NextResponse.json(
      { error: "E-Mail und Passwort erforderlich" },
      { status: 400 }
    );
  }

  const user = await db.user.findUnique({
    where: { email: email.toLowerCase() },
  });

  if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
    return NextResponse.json(
      { error: "Ung\u00fcltige Anmeldedaten" },
      { status: 401 }
    );
  }

  const membership = await db.orgMember.findFirst({
    where: { userId: user.id },
    orderBy: { createdAt: "asc" },
  });

  if (!membership) {
    return NextResponse.json(
      { error: "Keine Organisation gefunden" },
      { status: 403 }
    );
  }

  await createSession({
    userId: user.id,
    orgId: membership.orgId,
    email: user.email,
    name: user.name,
  });

  return NextResponse.json({ ok: true });
}
