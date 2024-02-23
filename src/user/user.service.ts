import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { User, Prisma } from '@prisma/client';
import { hashedPassword } from 'src/utils/hash-password.util';
import { randomUUID } from 'crypto';
import { MailService } from 'src/mail/mail.service';
import { MailTemplate } from 'src/mail/constant/mail.constant';
import { CompanyService } from 'src/company/company.service';
import { pagination } from 'src/utils/pagination.util';
import Pagination from 'src/interfaces/pagination.interface';
import { UserStatusEnum } from './constants/user.constant';

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);
  constructor(
    private readonly prisma: PrismaService,
    private readonly mailService: MailService,
    private readonly companyService: CompanyService,
  ) {}

  async getUserById(id: number) {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });
    if (!user) throw new BadRequestException(`User with id ${id} not found`);
    return user;
  }

  async getUserInvitedByCompanyId(
    companyId: number,
    page: number,
    pageSize: number,
  ) {
    const { skip, take } = pagination(page, pageSize);
    const users = await this.prisma.user.findMany({
      select: {
        firstName: true,
        lastName: true,
        inviteSent: true,
        onboardTracking: {
          select: {
            status: true,
          },
          where: {
            companyId,
          },
        },
      },
      where: {
        status: UserStatusEnum.INVITED,
      },
      skip,
      take,
    });
    const totalItem = users.length;
    const totalPage = Math.ceil(totalItem / pageSize);
    const data: Pagination = {
      page,
      pageSize,
      totalItem,
      totalPage,
      data: users,
    };
    return data;
  }

  async getUserByEmail(email: string) {
    const user = await this.prisma.user.findUnique({
      where: { email },
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
    return this.prisma.user.create({
      data,
    });
  }

  async updateUserById(
    id: number,
    data: Prisma.UserUpdateInput,
  ): Promise<void> {
    if (data.email) {
      await this.checkEmailExist(data.email.toString());
    }
    await this.getUserById(id);
    if (typeof data.password === 'string') {
      data.password = await hashedPassword(data.password);
    }
    await this.prisma.user.update({ where: { id }, data });
    return;
  }

  async deleteUserById(id: number): Promise<void> {
    await this.getUserById(id);
    await this.prisma.user.delete({
      where: {
        id,
      },
    });
    return;
  }

  async sendCodeVerifyUser(userId: number, companyyId: number) {
    const user = await this.getUserById(userId);
    const code = randomUUID();

    const company = await this.companyService.getCompanyById(companyyId);

    await this.mailService.send({
      email: user.email,
      sender: company.companyEmail,
      template: MailTemplate.VERIFY_TEMPLATE,
      info: {
        code,
      },
    });
  }

  async verifyAndUpdateUser(
    verifyCode: string,
    data: Prisma.UserUpdateInput,
    userId: number,
  ) {
    const user = await this.getUserById(userId);

    await this.updateUserById(userId, data);
  }

  async checkEmailExist(email: string) {
    const user = await this.prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (user) {
      throw new BadRequestException('Email early exist');
    }
  }
}
