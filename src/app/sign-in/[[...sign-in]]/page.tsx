"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function SignInPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const res = await fetch("/api/auth/sign-in", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    if (res.ok) {
      router.push("/stellen");
    } else {
      const data = await res.json();
      setError(data.error ?? "Anmeldung fehlgeschlagen");
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
          <h1 className="text-xl font-semibold tracking-tight">Anmelden</h1>
          <p className="text-sm text-muted-foreground">BewerbungsBoard</p>
        </div>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="E-Mail"
          className="px-3 py-2 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          required
          autoFocus
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Passwort"
          className="px-3 py-2 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          required
        />
        {error && <p className="text-destructive text-sm">{error}</p>}
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 disabled:opacity-50 transition-colors"
        >
          {loading ? "Wird angemeldet\u2026" : "Anmelden"}
        </button>
        <p className="text-center text-sm text-muted-foreground">
          Noch kein Konto?{" "}
          <Link href="/sign-up" className="underline hover:text-foreground">
            Registrieren
          </Link>
        </p>
      </form>
    </div>
  );
}
