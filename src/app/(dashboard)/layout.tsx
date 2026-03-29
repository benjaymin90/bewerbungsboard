import Link from "next/link";
import { OrganizationSwitcher, UserButton } from "@clerk/nextjs";
import { Separator } from "@/components/ui/separator";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
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
        <div className="flex items-center gap-3">
          <OrganizationSwitcher
            afterCreateOrganizationUrl="/stellen"
            afterSelectOrganizationUrl="/stellen"
          />
          <UserButton />
        </div>
      </header>
      <main className="flex-1 p-6">{children}</main>
    </div>
  );
}
