import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { UserModule } from './user/user.module';
import { AuthenticationModule } from './authentication/authentication.module';
import { MailModule } from './mail/mail.module';
import { CompanyModule } from './company/company.module';
import { AgentModule } from './agent/agent.module';
import { ContactModule } from './contact/contact.module';
import { OnboardTrackingModule } from './onboard-tracking/onboard-tracking.module';
import { ContactPropertyModule } from './contact-property/contact-property.module';
import { PropertyModule } from './property/property.module';

@Module({
  imports: [
    PrismaModule,
    UserModule,
    AuthenticationModule,
    CompanyModule,
    AgentModule,
    MailModule,
    ContactModule,
    OnboardTrackingModule,
    ContactPropertyModule,
    PropertyModule,
  ],
})
export class AppModule {}
