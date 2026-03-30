import "dotenv/config";
import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaNeon } from "@prisma/adapter-neon";
import bcrypt from "bcryptjs";

const adapter = new PrismaNeon({
  connectionString: process.env.DATABASE_URL!,
});
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("Seeding BewerbungsBoard...");

  // Create demo organization
  const org = await prisma.organization.upsert({
    where: { id: "seed-org-1" },
    update: {},
    create: {
      id: "seed-org-1",
      name: "Demo GmbH",
      plan: "PRO",
    },
  });

  // Create demo admin user
  const passwordHash = await bcrypt.hash("demo1234", 12);
  const user = await prisma.user.upsert({
    where: { email: "demo@example.com" },
    update: {},
    create: {
      email: "demo@example.com",
      passwordHash,
      name: "Demo Admin",
    },
  });

  // Create org membership
  await prisma.orgMember.upsert({
    where: {
      userId_orgId: {
        userId: user.id,
        orgId: org.id,
      },
    },
    update: {},
    create: {
      userId: user.id,
      orgId: org.id,
      role: "ADMIN",
    },
  });

  // Create demo jobs
  const softwareEngineer = await prisma.job.upsert({
    where: { id: "seed-job-1" },
    update: {},
    create: {
      id: "seed-job-1",
      orgId: org.id,
      title: "Senior Software Engineer (m/w/d)",
      description:
        "Wir suchen eine/n erfahrene/n Software Engineer fuer unser Backend-Team. Du arbeitest an skalierbaren Microservices mit TypeScript und Node.js.",
      location: "Berlin",
      locationType: "HYBRID",
      status: "OPEN",
      publishedAt: new Date(),
    },
  });

  const productDesigner = await prisma.job.upsert({
    where: { id: "seed-job-2" },
    update: {},
    create: {
      id: "seed-job-2",
      orgId: org.id,
      title: "Product Designer (m/w/d)",
      description:
        "Gestalte die Zukunft unserer SaaS-Produkte. Du verantwortest UX Research, Wireframes und High-Fidelity Prototypen.",
      location: "Muenchen",
      locationType: "ON_SITE",
      status: "OPEN",
      publishedAt: new Date(),
    },
  });

  // Create demo applicants
  await prisma.applicant.createMany({
    skipDuplicates: true,
    data: [
      {
        jobId: softwareEngineer.id,
        firstName: "Max",
        lastName: "Mustermann",
        email: "max@example.com",
        phone: "+49 170 1234567",
        stage: "INBOX",
        privacyAccepted: true,
        skills: ["TypeScript", "Node.js", "React"],
      },
      {
        jobId: softwareEngineer.id,
        firstName: "Anna",
        lastName: "Schmidt",
        email: "anna@example.com",
        linkedIn: "https://linkedin.com/in/anna-schmidt",
        stage: "INTERVIEW",
        privacyAccepted: true,
        skills: ["Go", "Kubernetes", "PostgreSQL"],
      },
      {
        jobId: productDesigner.id,
        firstName: "Lisa",
        lastName: "Weber",
        email: "lisa@example.com",
        stage: "OFFER",
        privacyAccepted: true,
        skills: ["Figma", "User Research", "Design Systems"],
      },
    ],
  });

  // Create email templates
  await prisma.emailTemplate.createMany({
    skipDuplicates: true,
    data: [
      {
        orgId: org.id,
        name: "Interview-Einladung",
        subject: "Einladung zum Vorstellungsgespraech - {{jobTitle}}",
        body: "Hallo {{firstName}},\n\nvielen Dank fuer Ihre Bewerbung als {{jobTitle}}. Wir laden Sie herzlich zu einem Vorstellungsgespraech ein.\n\nMit freundlichen Gruessen,\n{{orgName}}",
        trigger: "STAGE_INTERVIEW",
      },
      {
        orgId: org.id,
        name: "Angebot",
        subject: "Ihr Angebot fuer {{jobTitle}}",
        body: "Hallo {{firstName}},\n\nwir freuen uns, Ihnen ein Angebot fuer die Position {{jobTitle}} unterbreiten zu koennen.\n\nMit freundlichen Gruessen,\n{{orgName}}",
        trigger: "STAGE_OFFER",
      },
      {
        orgId: org.id,
        name: "Absage",
        subject: "Ihre Bewerbung bei {{orgName}}",
        body: "Hallo {{firstName}},\n\nvielen Dank fuer Ihr Interesse an der Position {{jobTitle}}. Leider muessen wir Ihnen mitteilen, dass wir uns fuer andere Kandidaten entschieden haben.\n\nWir wuenschen Ihnen alles Gute.\n\nMit freundlichen Gruessen,\n{{orgName}}",
        trigger: "STAGE_REJECTED",
      },
    ],
  });

  console.log("Seed abgeschlossen!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
