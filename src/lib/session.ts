import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { NextRequest } from "next/server";

const key = new TextEncoder().encode(
  process.env.AUTH_SECRET ?? "bewerbungsboard-dev-secret-change-in-production"
);

export type SessionData = {
  userId: string;
  orgId: string;
  email: string;
  name?: string | null;
};

export async function createSession(data: SessionData) {
  const token = await new SignJWT(data as Record<string, unknown>)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("30d")
    .sign(key);

  const cookieStore = await cookies();
  cookieStore.set("session", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });
}

export async function getSession(): Promise<SessionData | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get("session")?.value;
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, key);
    return payload as unknown as SessionData;
  } catch {
    return null;
  }
}

export async function getSessionFromRequest(req: NextRequest): Promise<SessionData | null> {
  const token = req.cookies.get("session")?.value;
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, key);
    return payload as unknown as SessionData;
  } catch {
    return null;
  }
}

export async function deleteSession() {
  const cookieStore = await cookies();
  cookieStore.delete("session");
}
