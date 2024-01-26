import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

// initialize Prisma Client
const prisma = new PrismaClient();

async function main() {
  await prisma.user.createMany({
    data: [
      {
        firstName: 'admin',
        lastName: '1',
        email: 'admin1@gmail.com',
        password: await bcrypt.hash('admin123456', 10),
        status: 'ACTIVE',
        type: 'ADMIN',
      },
      {
        firstName: 'admin',
        lastName: '2',
        email: 'admin2@gmail.com',
        password: await bcrypt.hash('admin123456', 10),
        status: 'ACTIVE',
        type: 'ADMIN',
      },
    ],
  });

  console.log('seeding success');
}

// execute the main function
main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    // close Prisma Client at the end
    await prisma.$disconnect();
  });
