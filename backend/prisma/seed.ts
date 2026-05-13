import { PrismaClient, Prisma } from "@prisma/client";

const prisma = new PrismaClient();

type SeedCategory = {
  name: string;
  description: string;
};

type SeedProduct = {
  name: string;
  description: string;
  imageUrl: string;
  price: Prisma.Decimal;
  stock: number;
  categoryName: string;
};

const categories: SeedCategory[] = [
  {
    name: "Poterie & céramique",
    description: "Objets artisanaux en poterie et céramique.",
  },
  {
    name: "Cuir",
    description: "Articles en cuir fabriqués de manière artisanale.",
  },
  {
    name: "Textile",
    description: "Produits textiles traditionnels et modernes.",
  },
  {
    name: "Luminaires",
    description: "Lampes et luminaires décoratifs.",
  },
  {
    name: "Verrerie & théières",
    description: "Verrerie artisanale et théières.",
  },
];

const products: SeedProduct[] = [
  {
    name: "Théière artisanale en verre",
    description: "Théière marocaine en verre soufflé, finition artisanale.",
    imageUrl: "/uploads/products/theiere-verre.jpg",
    price: new Prisma.Decimal("249.90"),
    stock: 15,
    categoryName: "Verrerie & théières",
  },
  {
    name: "Sac en cuir de Fès",
    description: "Sac en cuir naturel, cousu à la main.",
    imageUrl: "/uploads/products/sac-cuir-fes.jpg",
    price: new Prisma.Decimal("799.00"),
    stock: 10,
    categoryName: "Cuir",
  },
  {
    name: "Lampe artisanale en cuivre",
    description: "Lampe décorative inspirée de l'artisanat marocain.",
    imageUrl: "/uploads/products/lampe-cuivre.jpg",
    price: new Prisma.Decimal("459.50"),
    stock: 8,
    categoryName: "Luminaires",
  },
];

async function seedCategories() {
  const categoryByName = new Map<string, number>();

  for (const category of categories) {
    const record = await prisma.category.upsert({
      where: { name: category.name },
      update: { description: category.description },
      create: category,
      select: { id: true, name: true },
    });

    categoryByName.set(record.name, record.id);
  }

  return categoryByName;
}

async function seedProducts(categoryByName: Map<string, number>) {
  let createdCount = 0;
  let updatedCount = 0;

  for (const product of products) {
    const categoryId = categoryByName.get(product.categoryName);

    if (!categoryId) {
      throw new Error(
        `Category "${product.categoryName}" is missing. Cannot seed product "${product.name}".`
      );
    }

    const existing = await prisma.product.findFirst({
      where: { name: product.name },
      select: { id: true },
    });

    const data = {
      name: product.name,
      description: product.description,
      imageUrl: product.imageUrl,
      price: product.price,
      stock: product.stock,
      categoryId,
    };

    if (existing) {
      await prisma.product.update({
        where: { id: existing.id },
        data,
      });
      updatedCount += 1;
    } else {
      await prisma.product.create({ data });
      createdCount += 1;
    }
  }

  return { createdCount, updatedCount };
}

async function main() {
  const categoryByName = await seedCategories();
  const { createdCount, updatedCount } = await seedProducts(categoryByName);

  console.log(
    `[seed] Done. Categories ready: ${categories.length}. Products created: ${createdCount}, updated: ${updatedCount}.`
  );
}

main()
  .catch((error) => {
    console.error("[seed] Failed:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
