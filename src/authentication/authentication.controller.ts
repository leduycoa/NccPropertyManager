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
  Logger,
  UseInterceptors,
} from '@nestjs/common';
import { AuthenticationService } from './authentication.service';
import RegisterDto from './dto/register.dto';
import { LocalAuthenticationGuard } from '../guards/localAuthentication.guard';
import { Response, response } from 'express';
import JwtAuthenticationGuard from '../guards/jwt-authentication.guard';
import LogInDto from './dto/login.dto';
import { ApiBody } from '@nestjs/swagger';
import { LoggerInterceptor } from '../utils/logging.interceptor';

@Controller('auth')
@UseInterceptors(LoggerInterceptor)
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
  async logIn(@Req() request, @Body() _body: LogInDto) {
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
  authenticate(@Req() request) {
    const user = request.user;
    user.password = undefined;
    return user;
  }
}
