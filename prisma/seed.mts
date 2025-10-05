// prisma/seed.mts
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  await prisma.event.createMany({
    data: [
      {
        eventId: 1,
        eventName: "展示A",
        isDistributingTicket: true,
        ticketStatus: "distributing",
        congestionStatus: "free",
        eventText: "説明文A",
      },
      {
        eventId: 2,
        eventName: "展示B",
        isDistributingTicket: false,
        ticketStatus: null,
        congestionStatus: "crowded",
        eventText: null,
      },
    ],
  });
}

main()
  .then(() => console.log("Seed completed"))
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
