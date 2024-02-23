import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { UserService } from '../user/user.service';
import RegisterDto from './dto/register.dto';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import TokenPayload from '../interfaces/tonken.interface';
import { Contact, User } from '@prisma/client';
import { ContactService } from 'src/contact/contact.service';
import { ContactStatusEnum } from 'src/contact/constants/contact.constant';

@Injectable()
export class AuthenticationService {
  private readonly logger = new Logger(AuthenticationService.name);
  constructor(
    private readonly userService: UserService,
    private readonly contactService: ContactService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  public async register(registrationData: RegisterDto) {
    await this.userService.checkEmailExist(registrationData.email);
    const hashedPassword = await bcrypt.hash(registrationData.password, 10);
    const createdUser = await this.userService.createUser({
      ...registrationData,
      password: hashedPassword,
    });
    delete createdUser.password;
    return createdUser;
  }

  public async getAuthenticatedUser(email: string, plainTextPassword: string) {
    const user: User = await this.userService.getUserByEmail(email);
    await this.verifyPassword(plainTextPassword, user.password);
    user.password = undefined;
    return user;
  }

  public async getAuthenticatedContact(
    email: string,
    plainTextPassword: string,
  ) {
    const contact = await this.contactService.getConctactByEmail(email);
    if (contact.status === ContactStatusEnum.DELETED) {
      throw new BadRequestException('Account is deleted');
    }
    if (contact.agents[0] && !contact.agents[0].isActive) {
      throw new BadRequestException('Account is inactive');
    }
    await this.verifyPassword(plainTextPassword, contact.password);
    contact.password = undefined;
    return contact;
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
      this.logger.error('Wrong credentials provided');
      throw new BadRequestException('Wrong credentials provided');
    }
  }

  public getCookieWithJwtToken(id: number) {
    const payload: TokenPayload = { id };
    const token = this.jwtService.sign(payload);
    return `Authentication=${token}; HttpOnly; Path=/; Max-Age=${this.configService.get(
      'JWT_EXPIRATION_TIME',
    )}`;
  }

  public getCookieForLogOut() {
    return `Authentication=; HttpOnly; Path=/; Max-Age=0`;
  }
}
