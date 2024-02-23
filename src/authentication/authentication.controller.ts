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
import { LocalAuthenticationGuard } from '../guards/local-authentication.guard';
import JwtAuthenticationGuard from '../guards/jwt-authentication.guard';
import LogInDto from './dto/login.dto';
import { ApiBody } from '@nestjs/swagger';
import RequestWithUser from '../interfaces/request-with-user.interface';
import { TransformDataInterceptor } from '../Interceptors/transform-data.interceptor';
import { UserResponseDto } from '../user/dto/user-response.dto';
import { LocalConatactAuthenticationGuard } from 'src/guards/local-contact-authentication.guard';
import RequestWithContact from 'src/interfaces/request-with-contact.interface';

@Controller('auth')
@UseInterceptors(ClassSerializerInterceptor)
@SerializeOptions({
  strategy: 'exposeAll',
})
export class AuthenticationController {
  constructor(private readonly authenticationService: AuthenticationService) {}

  @Post('register')
  async register(@Body() registrationData: RegisterDto) {
    return this.authenticationService.register(registrationData);
  }

  @HttpCode(200)
  @ApiBody({ type: LogInDto })
  @UseGuards(LocalAuthenticationGuard)
  @Post('log-in')
  async logIn(@Req() request: RequestWithUser) {
    const { user } = request;
    const cookie = this.authenticationService.getCookieWithJwtToken(user.id);
    request.res.setHeader('Set-Cookie', cookie);
    return user;
  }

  @HttpCode(200)
  @ApiBody({ type: LogInDto })
  @UseGuards(LocalConatactAuthenticationGuard)
  @Post('/log-in/contact')
  async logInContact(@Req() request: RequestWithContact) {
    const { contact } = request;
    const cookie = this.authenticationService.getCookieWithJwtToken(contact.id);
    request.res.setHeader('Set-Cookie', cookie);
    return contact;
  }

  @UseGuards(JwtAuthenticationGuard)
  @Post('log-out')
  async logOut(@Res() response) {
    response.setHeader(
      'Set-Cookie',
      this.authenticationService.getCookieForLogOut(),
    );
    response.sendStatus(200);
  }

  @UseGuards(JwtAuthenticationGuard)
  @Get()
  @UseInterceptors(new TransformDataInterceptor(UserResponseDto))
  authenticate(@Req() request: RequestWithUser) {
    return request.user;
  }
}
