import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

const key = new TextEncoder().encode(
  process.env.AUTH_SECRET ?? "bewerbungsboard-dev-secret-change-in-production"
);

export async function middleware(req: NextRequest) {
  const token = req.cookies.get("session")?.value;

  if (!token) {
    return NextResponse.redirect(new URL("/sign-in", req.url));
  }

  try {
    await jwtVerify(token, key);
    return NextResponse.next();
  } catch {
    return NextResponse.redirect(new URL("/sign-in", req.url));
  }
}

export const config = {
  matcher: ["/stellen(.*)", "/templates(.*)", "/einstellungen(.*)"],
};
