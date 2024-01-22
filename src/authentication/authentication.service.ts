import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { UserService }from '../users/user.service';
import RegisterDto from './dto/register.dto';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import TokenPayload from '../interfaces/tonken.interface';

@Injectable()
export class AuthenticationService {
  private readonly logger = new Logger (AuthenticationService.name);
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  public async register(registrationData: RegisterDto) {
    try {
      await this.userService.checkEmailExist(registrationData.email)
      const hashedPassword = await bcrypt.hash(registrationData.password, 10);
      const createdUser = await this.userService.createUser({
        ...registrationData,
        password: hashedPassword,
      });
      delete createdUser.password;
      return createdUser;
    } catch (error) {
      this.logger.error(error.message)
      throw new HttpException(
        error.message,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  public async getAuthenticatedUser(email: string, plainTextPassword: string) {
    try {
      const user = await this.userService.getUserByEmail(email);
      await this.verifyPassword(plainTextPassword, user.password);
      user.password = undefined;
      return user;
    } catch (error) {
      this.logger.error(error.message)
      throw new HttpException(
        error,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  private async verifyPassword(
    plainTextPassword: string,
    hashedPassword: string,
  ) {
    const isPasswordMatching = await bcrypt.compare(
      plainTextPassword,
      hashedPassword,
    );
    if (!isPasswordMatching) {
      this.logger.error('Wrong credentials provided')
      throw new HttpException(
        'Wrong credentials provided',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  public getCookieWithJwtToken(id: string) {
    try {
      const payload: TokenPayload = { id };
      const token = this.jwtService.sign(payload);
      return `Authentication=${token}; HttpOnly; Path=/; Max-Age=${this.configService.get(
        'JWT_EXPIRATION_TIME',
      )}`;
    } catch (error) {
      this.logger.error(error.message)
      throw new HttpException(
        error,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  public getCookieForLogOut() {
    return `Authentication=; HttpOnly; Path=/; Max-Age=0`;
  }

}
