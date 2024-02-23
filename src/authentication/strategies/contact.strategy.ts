import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { AuthenticationService } from '../authentication.service';

@Injectable()
export class LocalContactStrategy extends PassportStrategy(
  Strategy,
  'contact',
) {
  constructor(private authenticationService: AuthenticationService) {
    super({
      usernameField: 'email',
    });
  }
  async validate(email: string, password: string) {
    return this.authenticationService.getAuthenticatedContact(email, password);
  }
}
