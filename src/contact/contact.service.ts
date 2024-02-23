import { Injectable, Logger } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ContactService {
  private readonly logger = new Logger(ContactService.name);
  constructor(private readonly prisma: PrismaService) {}

  async getContactByUserId(userId: number) {
    const contact = this.prisma.contact.findMany({
      where: {
        userId,
      },
    });
    return contact;
  }

  async getConctactByEmail(email: string) {
    const contact = await this.prisma.contact.findUnique({
      where: { email },
      include: {
        agents: true,
      },
    });

    return contact;
  }

  async updateContact(id: number, data: Prisma.ContactUpdateInput) {
    const contact = await this.prisma.contact.update({
      where: {
        id,
      },
      data,
    });
  }
}
