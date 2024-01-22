import {
  Body,
  Req,
  Controller,
  HttpCode,
  Post,
  UseGuards,
  Res,
  Get,
  SerializeOptions,
  UseInterceptors,
  ClassSerializerInterceptor,
} from '@nestjs/common';
import { AuthenticationService } from './authentication.service';
import RegisterDto from './dto/register.dto';
import { LocalAuthenticationGuard } from '../guards/localAuthentication.guard';
import JwtAuthenticationGuard from '../guards/jwt-authentication.guard';
import LogInDto from './dto/login.dto';
import { ApiBody } from '@nestjs/swagger';
import { LoggerInterceptor } from '../utils/logging.interceptor';
import RequestWithUser from '../interfaces/requestWithUser.interface';
import { TransformDataInterceptor } from '../utils/transformData.interceptor';
import { UserResponseDto } from '../users/dto/userResponse.dto';

@Controller('auth')
@UseInterceptors(LoggerInterceptor)
@UseInterceptors(ClassSerializerInterceptor)
@SerializeOptions({
  strategy: 'exposeAll',
})
export class AuthenticationController {
  constructor(private readonly authenticationService: AuthenticationService) { }

  @Post('register')
  async register(@Body() registrationData: RegisterDto) {
    return this.authenticationService.register(registrationData);

  }

  @HttpCode(200)
  @ApiBody({ type: LogInDto })
  @UseGuards(LocalAuthenticationGuard)
  @Post('log-in')
  async logIn(@Req() request: RequestWithUser, @Body() _body: LogInDto) {
    const { user } = request;
    const cookie = this.authenticationService.getCookieWithJwtToken(user.id);
    request.res.setHeader('Set-Cookie', cookie);
    return user;
  }

  @UseGuards(JwtAuthenticationGuard)
  @Post('log-out')
  async logOut(@Res() response) {
    response.setHeader(
      'Set-Cookie',
      this.authenticationService.getCookieForLogOut(),
    );
    response.sendStatus(200)
  }

  @UseGuards(JwtAuthenticationGuard)
  @Get()
  @UseInterceptors(new TransformDataInterceptor(UserResponseDto))
  authenticate(@Req() request: RequestWithUser) {
    return request.user;
  }
}
