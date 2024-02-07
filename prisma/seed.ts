import { date } from '@hapi/joi';
import { Prisma, PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

// initialize Prisma Client
const prisma = new PrismaClient();

async function main() {
  const emails: string[] = ['admin1@gmail.com', 'admin2@gmail.com'];
  await prisma.user.createMany({
    data: [
      {
        firstName: 'admin',
        lastName: '1',
        email: emails[0],
        password: await bcrypt.hash('admin123456', 10),
        status: 'ACTIVE',
      },
      {
        firstName: 'admin',
        lastName: '2',
        email: emails[1],
        password: await bcrypt.hash('admin123456', 10),
        status: 'ACTIVE',
      },
    ],
  });

  const users = await prisma.user.findMany({
    where: {
      email: {
        in: emails,
      },
    },
  });

  const contacts = users.map((user, index) => {
    const contact: Prisma.ContactCreateManyInput = {
      firstName: 'admin',
      lastName: `${index}`,
      email: emails[index],
      type: 'ADMIN',
      status: 'ACTIVE',
      userId: user.id,
    };
    return contact;
  });

  await prisma.contact.createMany({
    data: contacts,
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
