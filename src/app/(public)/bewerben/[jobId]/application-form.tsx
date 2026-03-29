"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

export function ApplicationForm({ jobId }: { jobId: string }) {
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setPending(true);
    setError(null);

    const form = new FormData(e.currentTarget);
    const data = {
      firstName: form.get("firstName"),
      lastName: form.get("lastName"),
      email: form.get("email"),
      phone: form.get("phone") || null,
      linkedIn: form.get("linkedIn") || null,
      message: form.get("message") || null,
      privacyAccepted: form.get("privacy") === "on",
    };

    try {
      const res = await fetch(`/api/jobs/${jobId}/applicants`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Bewerbung fehlgeschlagen");
      }

      setSubmitted(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unbekannter Fehler");
    } finally {
      setPending(false);
    }
  }

  if (submitted) {
    return (
      <div className="mt-8 rounded-lg border p-6 text-center">
        <p className="text-lg font-medium">Bewerbung eingegangen!</p>
        <p className="mt-2 text-sm text-muted-foreground">
          Vielen Dank. Sie erhalten eine Bestaetigung per E-Mail.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="mt-8 space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="firstName">Vorname *</Label>
          <Input id="firstName" name="firstName" required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="lastName">Nachname *</Label>
          <Input id="lastName" name="lastName" required />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">E-Mail *</Label>
        <Input id="email" name="email" type="email" required />
      </div>

      <div className="space-y-2">
        <Label htmlFor="phone">Telefon</Label>
        <Input id="phone" name="phone" type="tel" />
      </div>

      <div className="space-y-2">
        <Label htmlFor="linkedIn">LinkedIn</Label>
        <Input id="linkedIn" name="linkedIn" type="url" placeholder="https://linkedin.com/in/..." />
      </div>

      <div className="space-y-2">
        <Label htmlFor="message">Nachricht</Label>
        <Textarea id="message" name="message" rows={4} />
      </div>

      <div className="flex items-start gap-2">
        <input
          type="checkbox"
          id="privacy"
          name="privacy"
          required
          className="mt-1"
        />
        <Label htmlFor="privacy" className="text-sm font-normal">
          Ich habe die Datenschutzerklaerung gelesen und stimme der Verarbeitung
          meiner Daten zu. *
        </Label>
      </div>

      {error && (
        <p className="text-sm text-destructive">{error}</p>
      )}

      <Button type="submit" className="w-full" disabled={pending}>
        {pending ? "Wird gesendet..." : "Bewerbung senden"}
      </Button>
    </form>
  );
}
