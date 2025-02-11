import { prisma } from "@/lib/prisma";

async function migrateProjectIds() {
  const projects = await prisma.project.findMany(); // Fetch all projects

  for (const project of projects) {
    const year = new Date(project.createdAt).getFullYear(); 
    const counter = await prisma.counter.upsert({
      where: { id: "project_counter" },
      update: { count: { increment: 1 } },
      create: { id: "project_counter", count: 1 },
    });

    const newId = `${year}-${String(counter.count).padStart(4, "0")}`;

    await prisma.project.update({
      where: { id: project.id },
      data: { id: newId },
    });

    console.log(`Updated project ${project.id} → ${newId}`);
  }
}

migrateProjectIds()
  .then(() => console.log("Migration complete"))
  .catch(console.error)
  .finally(() => prisma.$disconnect());
