"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function SignUpPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [orgName, setOrgName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password, orgName }),
    });

    if (res.ok) {
      router.push("/stellen");
    } else {
      const data = await res.json();
      setError(data.error ?? "Registrierung fehlgeschlagen");
    }
    setLoading(false);
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-4 w-full max-w-sm p-8 rounded-xl border border-border bg-card shadow-sm"
      >
        <div className="space-y-1">
          <h1 className="text-xl font-semibold tracking-tight">Konto erstellen</h1>
          <p className="text-sm text-muted-foreground">BewerbungsBoard</p>
        </div>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Dein Name"
          className="px-3 py-2 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          autoFocus
        />
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="E-Mail"
          className="px-3 py-2 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          required
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Passwort (min. 8 Zeichen)"
          className="px-3 py-2 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          required
          minLength={8}
        />
        <input
          type="text"
          value={orgName}
          onChange={(e) => setOrgName(e.target.value)}
          placeholder="Name deines Unternehmens"
          className="px-3 py-2 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          required
        />
        {error && <p className="text-destructive text-sm">{error}</p>}
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 disabled:opacity-50 transition-colors"
        >
          {loading ? "Wird erstellt\u2026" : "Konto erstellen"}
        </button>
        <p className="text-center text-sm text-muted-foreground">
          Bereits registriert?{" "}
          <Link href="/sign-in" className="underline hover:text-foreground">
            Anmelden
          </Link>
        </p>
      </form>
    </div>
  );
}
