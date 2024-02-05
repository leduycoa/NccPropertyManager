import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { User, Prisma } from '@prisma/client';
import { hashedPassword } from 'src/utils/hash-password.util';
import { randomUUID } from 'crypto';
import { MailService } from 'src/mail/mail.service';
import { AgencyService } from 'src/agency/agency.service';
import { MailTemplate } from 'src/mail/constant/mail.constant';

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);
  constructor(
    private readonly prisma: PrismaService,
    private readonly mailService: MailService,
    private readonly agencyService: AgencyService,
  ) {}

  async getUserById(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });
    if (!user) throw new BadRequestException(`User with id ${id} not found`);
    return user;
  }

  async getUserByEmail(email: string) {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    return user;
  }

  async getUserByUserName(userName: string) {
    const user = await this.prisma.user.findUnique({
      where: { userName },
    });

    return user;
  }

  async getUsers(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.UserWhereUniqueInput;
    where?: Prisma.UserWhereInput;
    orderBy?: Prisma.UserOrderByWithRelationInput;
  }): Promise<User[]> {
    return this.prisma.user.findMany(params);
  }

  async createUser(data: Prisma.UserCreateInput): Promise<User> {
    await this.checkEmailExist(data.email);
    if (data.userName) {
      await this.checkUserNameExist(data.userName);
    }
    return this.prisma.user.create({
      data,
    });
  }

  async updateUserById(
    id: string,
    data: Prisma.UserUpdateInput,
  ): Promise<void> {
    if (data.email) {
      await this.checkEmailExist(data.email.toString());
    }

    if (data.userName) {
      await this.checkUserNameExist(data.userName.toString());
    }

    await this.getUserById(id);
    if (typeof data.password === 'string') {
      data.password = await hashedPassword(data.password);
    }
    await this.prisma.user.update({ where: { id }, data });
    return;
  }

  async deleteUserById(id: string): Promise<void> {
    await this.getUserById(id);
    await this.prisma.user.delete({
      where: {
        id,
      },
    });
    return;
  }

  async sendCodeVerifyUser(userId: string, agencyId: string) {
    const user = await this.getUserById(userId);
    const code = randomUUID();

    await this.prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        verifyCode: code,
      },
    });

    const agency = await this.agencyService.getAgencyById(agencyId);

    await this.mailService.send({
      email: user.email,
      sender: agency.companyEmail,
      template: MailTemplate.VERIFY_TEMPLATE,
      info: {
        code,
      },
    });
  }

  async verifyAndUpdateUser(
    verifyCode: string,
    data: Prisma.UserUpdateInput,
    userId: string,
  ) {
    const user = await this.getUserById(userId);

    if (user.verifyCode !== verifyCode) {
      throw new BadRequestException('Verify code incorrect');
    }

    await this.updateUserById(userId, data);
  }

  async checkEmailExist(email: string) {
    const users = await this.prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (users) {
      throw new BadRequestException('Email early exist');
    }
  }

  async checkUserNameExist(userName: string) {
    const user = await this.prisma.user.findFirst({
      where: {
        userName,
      },
    });

    if (user) throw new BadRequestException('User name early exist');
  }
}
