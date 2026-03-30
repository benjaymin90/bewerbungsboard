import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { createSession } from "@/lib/session";
import bcrypt from "bcryptjs";

export async function POST(req: NextRequest) {
  const { email, password, name, orgName } = await req.json();

  if (!email || !password || !orgName) {
    return NextResponse.json(
      { error: "E-Mail, Passwort und Unternehmensname erforderlich" },
      { status: 400 }
    );
  }

  if (password.length < 8) {
    return NextResponse.json(
      { error: "Passwort muss mindestens 8 Zeichen haben" },
      { status: 400 }
    );
  }

  const existing = await db.user.findUnique({
    where: { email: email.toLowerCase() },
  });

  if (existing) {
    return NextResponse.json(
      { error: "Diese E-Mail ist bereits registriert" },
      { status: 400 }
    );
  }

  const passwordHash = await bcrypt.hash(password, 12);

  const result = await db.$transaction(async (tx) => {
    const user = await tx.user.create({
      data: {
        email: email.toLowerCase(),
        passwordHash,
        name: name || null,
      },
    });

    const org = await tx.organization.create({
      data: { name: orgName },
    });

    await tx.orgMember.create({
      data: {
        userId: user.id,
        orgId: org.id,
        role: "ADMIN",
      },
    });

    return { user, org };
  });

  await createSession({
    userId: result.user.id,
    orgId: result.org.id,
    email: result.user.email,
    name: result.user.name,
  });

  return NextResponse.json({ ok: true });
}
