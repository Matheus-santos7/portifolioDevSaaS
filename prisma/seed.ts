import { PrismaClient } from "@prisma/client";

import { getAllTechnologyPresets } from "../src/lib/technologies/technology-presets";

const prisma = new PrismaClient();

async function main() {
  const presets = getAllTechnologyPresets();

  for (const p of presets) {
    await prisma.technology.upsert({
      where: { nameKey: p.nameKey },
      create: {
        name: p.name,
        nameKey: p.nameKey,
        svgUrl: p.svgUrl,
      },
      update: {
        name: p.name,
        svgUrl: p.svgUrl,
      },
    });
  }

  console.log(`Catálogo: ${presets.length} tecnologias (ícone SVG Devicon / TechIcons).`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
