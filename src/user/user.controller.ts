import {
  Controller,
  Get,
  Param,
  Post,
  Body,
  Delete,
  UseGuards,
  SerializeOptions,
  UseInterceptors,
  Patch,
  Query,
  Put,
} from '@nestjs/common';
import { UserService } from './user.service';
import { User as UserModel } from '@prisma/client';
import UpdateUserDto from './dto/update-user.dto';
import CreateUserDto from './dto/create-user.dto';
import JwtAuthenticationGuard from '../guards/jwt-authentication.guard';
import { TransformDataInterceptor } from 'src/Interceptors/transform-data.interceptor';
import { UserResponseDto } from './dto/user-response.dto';

@Controller('users')
@SerializeOptions({
  strategy: 'exposeAll',
})
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @UseInterceptors(new TransformDataInterceptor(UserResponseDto))
  async createUser(@Body() userData: CreateUserDto): Promise<UserModel> {
    return this.userService.createUser(userData);
  }

  @Get()
  @UseGuards(JwtAuthenticationGuard)
  @UseInterceptors(new TransformDataInterceptor(UserResponseDto))
  async getUsers(@Param() queryOptions: object) {
    return this.userService.getUsers({
      where: queryOptions,
    });
  }

  @Get('/agent')
  async getUserInvitedByCompanyId(
    @Query('companyId') companyId: number,
    @Query('page') page: number = 1,
    @Query('pageSize') pageSize: number = 100,
  ) {
    return this.userService.getUserInvitedByCompanyId(
      companyId,
      page,
      pageSize,
    );
  }

  @Get(':id')
  @UseInterceptors(new TransformDataInterceptor(UserResponseDto))
  async getUserById(@Param('id') id: number) {
    return this.userService.getUserById(id);
  }

  @Delete(':id')
  async deleteUserById(@Param('id') id: number) {
    return this.userService.deleteUserById(id);
  }

  @Patch(':id')
  @UseInterceptors(new TransformDataInterceptor(UserResponseDto))
  async updateUserById(
    @Param('id') id: number,
    @Body() userData: UpdateUserDto,
  ) {
    return this.userService.updateUserById(id, userData);
  }

  @Post('/send-code')
  async sendCodeVerrify(
    @Query('userId') userId: number,
    @Query('agencyId') companyId: number,
  ) {
    return this.userService.sendCodeVerifyUser(userId, companyId);
  }

  @Put('/verify')
  async verifyAndUpdateUser(
    @Query('verifyCode') verifyCode: string,
    @Query('userId') userId: number,
    @Body() data: UpdateUserDto,
  ) {
    return this.userService.verifyAndUpdateUser(verifyCode, data, userId);
  }
}
