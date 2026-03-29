import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Kanban,
  Users,
  ShieldCheck,
  Zap,
  ArrowRight,
  Check,
  X,
  MessageSquare,
  Quote,
} from "lucide-react";

const features = [
  {
    icon: Kanban,
    title: "Pipeline auf einen Blick",
    description:
      "Ziehen Sie Kandidaten per Drag-and-Drop durch Ihre Phasen: Neu, Erstgespraech, Probearbeiten, Angebot, Eingestellt.",
  },
  {
    icon: Users,
    title: "Teamarbeit ohne Tool-Wildwuchs",
    description:
      "Kommentare, Notizen und Bewertungen direkt am Kandidatenprofil. Alle sehen den gleichen Stand.",
  },
  {
    icon: ShieldCheck,
    title: "DSGVO und DE-Fokus",
    description:
      "Einwilligungen, Aufbewahrungsfristen und Datenloeschung — ohne Bastelloesungen. Made in Germany.",
  },
  {
    icon: Zap,
    title: "Schnell eingerichtet",
    description:
      "Keine langen Integrationsprojekte. Konto erstellen, Stelle anlegen, erste Bewerbung erfassen.",
  },
];

const pricingPlans = [
  {
    name: "Free",
    price: "0",
    desc: "Erste Tests",
    features: [
      { name: "1 aktive Stelle", included: true },
      { name: "Basis-Pipeline", included: true },
      { name: "Bewerber-Profile", included: true },
      { name: "DSGVO-konform", included: true },
      { name: "Teamzugriff", included: false },
      { name: "E-Mail-Vorlagen", included: false },
      { name: "Erweiterte Automationen", included: false },
    ],
    cta: "Kostenlos starten",
    variant: "outline" as const,
    featured: false,
  },
  {
    name: "Starter",
    price: "19",
    desc: "Regelmaessiges Recruiting",
    features: [
      { name: "Bis zu 5 aktive Stellen", included: true },
      { name: "Erweiterte Pipeline", included: true },
      { name: "Bewerber-Profile", included: true },
      { name: "DSGVO-konform", included: true },
      { name: "Teamzugriff", included: true },
      { name: "E-Mail-Vorlagen", included: true },
      { name: "Erweiterte Automationen", included: false },
    ],
    cta: "Early Access sichern",
    variant: "default" as const,
    featured: true,
  },
  {
    name: "Pro",
    price: "49",
    desc: "Wachsende Teams",
    features: [
      { name: "Unbegrenzte Stellen", included: true },
      { name: "Erweiterte Pipeline", included: true },
      { name: "Bewerber-Profile", included: true },
      { name: "DSGVO-konform", included: true },
      { name: "Teamzugriff", included: true },
      { name: "E-Mail-Vorlagen", included: true },
      { name: "Erweiterte Automationen", included: true },
    ],
    cta: "Early Access sichern",
    variant: "default" as const,
    featured: false,
  },
];

const testimonials = [
  {
    quote: "Wir haben unsere Time-to-Response halbiert.",
    author: "Leitung Personal, Handwerksbetrieb (22 MA)",
  },
  {
    quote: "Endlich ein ATS, das mein Team ohne Schulung nutzt.",
    author: "Geschaeftsfuehrung, Dienstleister (14 MA)",
  },
];

const faqs = [
  {
    q: "Ist BewerbungsBoard DSGVO-konform?",
    a: "Ja. Datenverarbeitung, Aufbewahrung und Loeschung sind auf DE/EU-Anforderungen ausgelegt.",
  },
  {
    q: "Brauche ich eine IT-Abteilung?",
    a: "Nein. Die Einrichtung dauert wenige Minuten und funktioniert ohne technisches Setup.",
  },
  {
    q: "Kann ich spaeter upgraden?",
    a: "Ja. Sie koennen jederzeit vom Free- in den Starter- oder Pro-Plan wechseln.",
  },
];

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur-sm">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 sm:px-6">
          <Link href="/" className="flex items-center gap-2 font-semibold">
            <Kanban className="h-6 w-6 text-primary" />
            <span className="text-lg">BewerbungsBoard</span>
          </Link>
          <nav className="flex items-center gap-2">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/sign-in">Anmelden</Link>
            </Button>
            <Button size="sm" asChild>
              <Link href="/sign-up">Early Access</Link>
            </Button>
          </nav>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero */}
        <section className="py-20 sm:py-28">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 text-center">
            <Badge variant="secondary" className="mb-4">
              Early Access — Gruender-Preis sichern
            </Badge>
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
              Das einfachste ATS
              <br className="hidden sm:block" /> fuer{" "}
              <span className="text-primary">deutsche KMU</span>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground">
              Verwalten Sie Bewerbungen in Minuten statt Stunden.
              DSGVO-konform, ohne Setup, sofort startklar.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <Button size="lg" asChild>
                <Link href="/sign-up">
                  Jetzt Early Access sichern
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <Link href="#features">Features ansehen</Link>
              </Button>
            </div>
            <p className="mt-4 text-sm text-muted-foreground">
              Entwickelt fuer kleine Teams in Deutschland. Serverstandort EU.
            </p>
          </div>
        </section>

        {/* Problem → Solution */}
        <section className="border-t bg-muted/30 py-16">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <div className="mx-auto max-w-3xl text-center">
              <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
                Warum BewerbungsBoard?
              </h2>
              <p className="mt-4 text-muted-foreground">
                Kleine Unternehmen verlieren Bewerber nicht wegen fehlender
                Nachfrage, sondern wegen zu komplexer Prozesse.
              </p>
              <div className="mt-8 grid gap-4 text-left sm:grid-cols-3">
                <div className="flex items-start gap-3">
                  <MessageSquare className="mt-1 h-5 w-5 text-primary shrink-0" />
                  <p className="text-sm">
                    Ein klares Kanban-Board fuer jede Stelle
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <Zap className="mt-1 h-5 w-5 text-primary shrink-0" />
                  <p className="text-sm">
                    Automatische Status-Kommunikation statt manuelles
                    Nachfassen
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <Users className="mt-1 h-5 w-5 text-primary shrink-0" />
                  <p className="text-sm">
                    Zentrale Bewerberakten statt E-Mail-Chaos
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features */}
        <section id="features" className="border-t py-20 scroll-mt-14">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <div className="text-center">
              <h2 className="text-3xl font-bold tracking-tight">
                Alles fuer Ihr Recruiting
              </h2>
              <p className="mx-auto mt-3 max-w-xl text-muted-foreground">
                Einfach, schnell und DSGVO-konform — BewerbungsBoard bringt
                Struktur in Ihren Einstellungsprozess.
              </p>
            </div>
            <div className="mt-12 grid gap-6 sm:grid-cols-2">
              {features.map((feature) => (
                <Card key={feature.title} className="border bg-card">
                  <CardHeader className="pb-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      <feature.icon className="h-5 w-5" />
                    </div>
                    <CardTitle className="text-base mt-3">
                      {feature.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Social Proof */}
        <section className="border-t bg-muted/30 py-16">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <div className="grid gap-6 sm:grid-cols-2 max-w-3xl mx-auto">
              {testimonials.map((t) => (
                <Card key={t.author} className="border bg-card">
                  <CardContent className="pt-6">
                    <Quote className="h-5 w-5 text-primary mb-3" />
                    <p className="text-sm font-medium leading-relaxed">
                      &ldquo;{t.quote}&rdquo;
                    </p>
                    <p className="mt-3 text-xs text-muted-foreground">
                      {t.author}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Pricing */}
        <section id="preise" className="border-t py-20 scroll-mt-14">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <div className="text-center">
              <h2 className="text-3xl font-bold tracking-tight">
                Einfache, transparente Preise
              </h2>
              <p className="mx-auto mt-3 max-w-xl text-muted-foreground">
                Starten Sie kostenlos. Upgraden Sie, wenn Ihr Recruiting
                waechst.
              </p>
            </div>
            <div className="mt-12 grid gap-6 md:grid-cols-3 max-w-4xl mx-auto">
              {pricingPlans.map((plan) => (
                <Card
                  key={plan.name}
                  className={`relative ${plan.featured ? "border-primary" : ""}`}
                >
                  {plan.featured && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                      <Badge>Empfohlen</Badge>
                    </div>
                  )}
                  <CardHeader>
                    <CardTitle>{plan.name}</CardTitle>
                    <p className="text-sm text-muted-foreground">{plan.desc}</p>
                    <div className="pt-2">
                      <span className="text-4xl font-bold">
                        {plan.price}&nbsp;&euro;
                      </span>
                      <span className="text-muted-foreground">/Monat</span>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Button
                      variant={plan.variant}
                      className="w-full"
                      asChild
                    >
                      <Link href="/sign-up">{plan.cta}</Link>
                    </Button>
                    <ul className="space-y-3">
                      {plan.features.map((f) => (
                        <li
                          key={f.name}
                          className="flex items-center gap-2 text-sm"
                        >
                          {f.included ? (
                            <Check className="h-4 w-4 text-green-600 shrink-0" />
                          ) : (
                            <X className="h-4 w-4 text-muted-foreground/40 shrink-0" />
                          )}
                          <span
                            className={
                              !f.included ? "text-muted-foreground/60" : ""
                            }
                          >
                            {f.name}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="border-t bg-muted/30 py-16">
          <div className="mx-auto max-w-3xl px-4 sm:px-6">
            <h2 className="text-2xl font-bold tracking-tight text-center mb-8">
              Haeufige Fragen
            </h2>
            <div className="space-y-4">
              {faqs.map((faq) => (
                <Card key={faq.q}>
                  <CardContent className="pt-6">
                    <h3 className="font-semibold text-sm">{faq.q}</h3>
                    <p className="mt-2 text-sm text-muted-foreground">
                      {faq.a}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="border-t py-20">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 text-center">
            <h2 className="text-3xl font-bold tracking-tight">
              Schluss mit Bewerber-Chaos.
            </h2>
            <p className="mx-auto mt-3 max-w-lg text-muted-foreground">
              Starten Sie mit BewerbungsBoard und bringen Sie Struktur in Ihr
              Recruiting.
            </p>
            <div className="mt-8">
              <Button size="lg" asChild>
                <Link href="/sign-up">
                  Jetzt Early Access sichern
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t py-8">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Kanban className="h-4 w-4" />
              <span>&copy; {new Date().getFullYear()} BewerbungsBoard</span>
            </div>
            <div className="flex gap-6 text-sm text-muted-foreground">
              <Link
                href="/sign-in"
                className="hover:text-foreground transition-colors"
              >
                Anmelden
              </Link>
              <Link
                href="/sign-up"
                className="hover:text-foreground transition-colors"
              >
                Registrieren
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
