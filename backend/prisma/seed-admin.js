const bcrypt = require("bcrypt");
const { PrismaClient, UserRole } = require("@prisma/client");

const prisma = new PrismaClient();

const SALT_ROUNDS = 10;

const ADMIN_EMAIL = process.env.ADMIN_SEED_EMAIL || "admin@darartisanat.com";
const ADMIN_PASSWORD = process.env.ADMIN_SEED_PASSWORD || "Admin123!";
const ADMIN_NAME = process.env.ADMIN_SEED_NAME || "Dar Artisanat Admin";

async function main() {
  const hashedPassword = await bcrypt.hash(ADMIN_PASSWORD, SALT_ROUNDS);

  const adminUser = await prisma.user.upsert({
    where: { email: ADMIN_EMAIL },
    update: {
      name: ADMIN_NAME,
      password: hashedPassword,
      role: UserRole.ADMIN,
    },
    create: {
      name: ADMIN_NAME,
      email: ADMIN_EMAIL,
      password: hashedPassword,
      role: UserRole.ADMIN,
    },
    select: {
      id: true,
      email: true,
      role: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  if (adminUser.role !== UserRole.ADMIN) {
    throw new Error("Admin seed failed: created user role is not ADMIN.");
  }

  console.log("[seed-admin] Admin user is ready.");
  console.log(`[seed-admin] email: ${adminUser.email}`);
  console.log(`[seed-admin] role: ${adminUser.role}`);
}

main()
  .catch((error) => {
    console.error("[seed-admin] Failed to seed admin user:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
