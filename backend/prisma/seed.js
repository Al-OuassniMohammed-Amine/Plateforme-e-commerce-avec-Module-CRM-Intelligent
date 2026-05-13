const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

const categories = [
  {
    name: "Poterie & céramique",
    description: "Objets artisanaux en poterie et céramique",
  },
  {
    name: "Cuir",
    description: "Articles en cuir fabriqués de manière artisanale",
  },
  {
    name: "Textile",
    description: "Produits textiles traditionnels et modernes",
  },
  {
    name: "Luminaires",
    description: "Lampes et luminaires décoratifs",
  },
  {
    name: "Verrerie & théières",
    description: "Verrerie artisanale et théières",
  },
];

async function main() {
  for (const category of categories) {
    await prisma.category.upsert({
      where: { name: category.name },
      update: { description: category.description },
      create: category,
    });
  }

  const legacyCategory = await prisma.category.findFirst({
    where: {
      name: { equals: "vetements", mode: "insensitive" },
    },
    select: { id: true, name: true },
  });

  if (legacyCategory) {
    const textileCategory = await prisma.category.findFirst({
      where: { name: "Textile" },
      select: { id: true, name: true },
    });

    if (!textileCategory) {
      throw new Error('Cannot cleanup "vetements": "Textile" category is missing.');
    }

    const movedProducts = await prisma.product.updateMany({
      where: { categoryId: legacyCategory.id },
      data: { categoryId: textileCategory.id },
    });

    await prisma.category.delete({
      where: { id: legacyCategory.id },
    });

    console.log(
      `[seed] Legacy category "${legacyCategory.name}" removed and ${movedProducts.count} product(s) moved to "${textileCategory.name}".`
    );
  }

  console.log(`[seed] ${categories.length} categories are ready.`);
}

main()
  .catch((error) => {
    console.error("[seed] Failed to seed categories:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
