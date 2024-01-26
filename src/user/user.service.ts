import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { User, Prisma } from '@prisma/client';

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);
  constructor(private prisma: PrismaService) {}

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
    id: string,
    data: Prisma.UserUpdateInput,
  ): Promise<void> {
    await this.getUserById(id);
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

  async checkEmailExist(email: string) {
    const userExist = await this.getUserByEmail(email);
    if (userExist) throw new BadRequestException('email early exist!');
  }
}
