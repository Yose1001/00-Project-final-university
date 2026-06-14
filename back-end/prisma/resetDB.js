const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// Wipe all data (children first because of the FK). Keeps the schema intact.
const run = async () => {
  await prisma.reservation.deleteMany();
  await prisma.user.deleteMany();
};

run()
  .then(() => console.log("Reset DB done"))
  .catch((e) => {
    console.error(e);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
