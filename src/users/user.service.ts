import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { User, Prisma } from '@prisma/client';
@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) { }

  async getUserById(
    id: string,
  ) {
   const user = await this.prisma.user.findUnique({
      where: {
        id
      },
      select: {
        id: true,
        email: true,
      },
    });
    return user
  }

  async getUserByEmail(email: string) {
    const user = await this.prisma.user.findUnique({
      where: {
        email
      },
      select: {
        id: true,
        email: true,
        password: true
      },
    });
    return user
  }

  async getUsers(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.UserWhereUniqueInput;
    where?: Prisma.UserWhereInput;
    orderBy?: Prisma.UserOrderByWithRelationInput;
  }): Promise<User[]> {
    const { skip, take, cursor, where, orderBy } = params;
    return this.prisma.user.findMany({
      skip,
      take,
      cursor,
      where,
      orderBy,
    });
  }

  async createUser(data: Prisma.UserCreateInput): Promise<User> {
    try {
      return this.prisma.user.create({
        data,
      });
    } catch (error) {
      throw error
    }
  }

  async updateUser(
    params: {
      where: Prisma.UserWhereUniqueInput;
    },
    data: Prisma.UserUpdateInput
  ): Promise<User> {
    const { where } = params;
    return this.prisma.user.update({
      data,
      where,
    });
  }

  async deleteUser(where: Prisma.UserWhereUniqueInput): Promise<User> {
    return this.prisma.user.delete({
      where,
    });
  }

  async checkEmailExist(email: string) {
    const userExist = await this.getUserByEmail(email)
    if (userExist) throw new HttpException(
      'email early exist!',
      HttpStatus.BAD_REQUEST,
    );
  }
}