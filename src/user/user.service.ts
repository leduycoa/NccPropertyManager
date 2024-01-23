import { HttpException, HttpStatus, Injectable, Logger, Res, Response } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { User, Prisma } from '@prisma/client';
import { response } from 'express';

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);
  constructor(private prisma: PrismaService) { }

  async getUserById(id: string) {
    try {
      const user = await this.prisma.user.findUnique({
        where: {
          id,
        },
      });
      if (!user)
        throw new HttpException(
          `User with id ${id} not found`,
          HttpStatus.BAD_REQUEST,
        );
      return user;
    } catch (error) {
      this.logger.error(error.message);
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  async getUserByEmail(email: string) {
    try {
      const user = await this.prisma.user.findUnique({
        where: {
          email,
        },
      });
      return user;
    } catch (error) {
      this.logger.error(error.message);
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  async getUsers(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.UserWhereUniqueInput;
    where?: Prisma.UserWhereInput;
    orderBy?: Prisma.UserOrderByWithRelationInput;
  }): Promise<User[]> {
    try {
      const { skip, take, cursor, where, orderBy } = params;
      const users = this.prisma.user.findMany({
        skip,
        take,
        cursor,
        where,
        orderBy,
      });
      return users;
    } catch (error) {
      this.logger.error(error.message);
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  async createUser(data: Prisma.UserCreateInput): Promise<User> {
    try {
      await this.checkEmailExist(data.email);
      return this.prisma.user.create({
        data,
      });
    } catch (error) {
      this.logger.error(error.message);
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  async updateUserById(
    id: string,
    data: Prisma.UserUpdateInput,
  ): Promise<void> {
    try {
      await this.getUserById(id);
      await this.prisma.user.update({
        where: {
          id,
        },
        data,
      });
      return;
    } catch (error) {
      this.logger.error(error.message);
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  async deleteUserById(id: string): Promise<void> {
    try {
      await this.getUserById(id);
      await this.prisma.user.delete({
        where: {
          id,
        },
      });
      return;
    } catch (error) {
      this.logger.error(error.message);
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  async checkEmailExist(email: string) {
    const userExist = await this.getUserByEmail(email);
    if (userExist)
      throw new HttpException('email early exist!', HttpStatus.BAD_REQUEST);
  }
}
