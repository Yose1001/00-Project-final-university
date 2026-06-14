const bcrypt = require("bcryptjs");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const password = bcrypt.hashSync("123456", 10);

const userData = [
  { firstName: "Andy", lastName: "Anderson", email: "andy@ggg.mail", phone: "0810000001", username: "andy", password },
  { firstName: "Bobby", lastName: "Brown", email: "bobby@ggg.mail", phone: "0810000002", username: "bobby", password },
  { firstName: "Candy", lastName: "Clark", email: "candy@ggg.mail", phone: "0810000003", username: "candy", password },
];

const reservationData = [
  { title: "Learn HTML", status: "medium", dueDate: new Date(), userId: 1 },
  { title: "Learn CSS", status: "vip", dueDate: new Date(), userId: 1 },
  { title: "Learn JS", status: "medium", dueDate: new Date(), userId: 2 },
  { title: "Learn React", status: "vip", dueDate: new Date(), userId: 3 },
];

const run = async () => {
  // Idempotent: skip if the DB already has users (safe to run on every start)
  const existing = await prisma.user.count();
  if (existing > 0) {
    console.log("Seed skipped (database already has data)");
    return;
  }
  await prisma.user.createMany({ data: userData });
  await prisma.reservation.createMany({ data: reservationData });
};

run()
  .then(() => console.log("Seed done"))
  .catch((e) => {
    console.error(e);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
