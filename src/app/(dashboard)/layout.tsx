import Link from "next/link";
import { Separator } from "@/components/ui/separator";
import { getSession } from "@/lib/session";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();
  if (!session) redirect("/sign-in");

  const org = await db.organization.findUnique({
    where: { id: session.orgId },
    select: { name: true },
  });

  return (
    <div className="flex h-full min-h-screen flex-col">
      <header className="flex h-14 items-center justify-between border-b px-6">
        <div className="flex items-center gap-6">
          <Link href="/stellen" className="text-lg font-semibold tracking-tight">
            BewerbungsBoard
          </Link>
          <Separator orientation="vertical" className="h-6" />
          <nav className="flex items-center gap-4 text-sm">
            <Link
              href="/stellen"
              className="text-muted-foreground transition-colors hover:text-foreground"
            >
              Stellen
            </Link>
            <Link
              href="/templates"
              className="text-muted-foreground transition-colors hover:text-foreground"
            >
              E-Mail-Templates
            </Link>
            <Link
              href="/einstellungen"
              className="text-muted-foreground transition-colors hover:text-foreground"
            >
              Einstellungen
            </Link>
          </nav>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm text-muted-foreground">{org?.name}</span>
          <Separator orientation="vertical" className="h-4" />
          <span className="text-sm text-muted-foreground">{session.email}</span>
          <form action="/api/auth/sign-out" method="POST">
            <button
              type="submit"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Abmelden
            </button>
          </form>
        </div>
      </header>
      <main className="flex-1 p-6">{children}</main>
    </div>
  );
}
