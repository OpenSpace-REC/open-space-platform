import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

type ProjectUser = {
  id: string;
  projects: Array<{
    project: {
      techStack: string[];
    };
  }>;
};

async function populateTechStacks() {
  try {
    const users = await prisma.user.findMany({
      include: {
        projects: {
          include: {
            project: {
              select: {
                techStack: true
              }
            }
          }
        }
      }
    });

    const results = await prisma.$transaction(
      users.map((user: ProjectUser) => {
        const allTechStacks = user.projects.flatMap((pu) => pu.project.techStack);
        const uniqueTechStack = Array.from(new Set(allTechStacks));

        return prisma.user.update({
          where: { id: user.id },
          data: { techStack: uniqueTechStack }
        });
      })
    );

    console.log(`Tech stacks populated successfully for ${results.length} users.`);
  } catch (error) {
    console.error('Error populating tech stacks:', error);
    throw error;
  }
}

populateTechStacks()
  .then(() => console.log("Tech stack population complete"))
  .catch(console.error)
  .finally(() => prisma.$disconnect());
