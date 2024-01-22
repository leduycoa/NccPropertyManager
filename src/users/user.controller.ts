import {
  Controller,
  Get,
  Param,
  Post,
  Body,
  Put,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { User as UserModel } from '@prisma/client';
import UpdateUserDto from './dto/updateUser.dto';
import CreateUserDto from './dto/createUser.dto';
import JwtAuthenticationGuard from '../guards/jwt-authentication.guard';
import { LocalAuthenticationGuard } from '../guards/localAuthentication.guard';

@Controller('users')
export class UserController {
  constructor(
    private readonly userService: UserService,
  ) { }

  @Post()
  async createUser(
    @Body() userData: CreateUserDto,
  ): Promise<UserModel> {
    return this.userService.createUser(userData);
  };

  @Get()
  // @UseGuards(LocalAuthenticationGuard)
  @UseGuards(JwtAuthenticationGuard)
  async getUsers(@Param() queryOptions: Object) {
    return this.userService.getUsers({
      where: queryOptions
    });
  }

  @Get(':id')
  async getUserById(@Param('id') id: string) {
    return this.userService.getUserById(id);
  }

  @Delete(':id')
  async deleteUser(@Param('id') id: string) {
    return this.userService.deleteUser({ id });
  }

  @Put(':id')
  async updateUser(@Param('id') id: string, @Body() userData: UpdateUserDto,) {
    return this.userService.updateUser({
      where: { id }
    }, userData);
  }

}