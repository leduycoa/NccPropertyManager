import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ContactPropertyService {
  constructor(private readonly prisma: PrismaService) {}

  async updateContactPropertyByContact(
    contactId: number,
    data: Prisma.ContactPropertyUpdateInput,
  ) {
    const contactProperty = await this.prisma.contactProperty.updateMany({
      where: {
        contactId,
      },
      data,
    });
    return contactProperty;
  }
}
