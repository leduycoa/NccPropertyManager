import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.module';
import { UserModule } from 'src/user/user.module';
import { MailModule } from 'src/mail/mail.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { CompanyModule } from 'src/company/company.module';
import { AgentController } from './agent.controller';
import { AgentService } from './agent.service';
import { OnboardTrackingModule } from 'src/onboard-tracking/onboard-tracking.module';
import { ContactModule } from 'src/contact/contact.module';
import { ContactPropertyModule } from 'src/contact-property/contact-property.module';

@Module({
  imports: [
    PrismaModule,
    UserModule,
    MailModule,
    CompanyModule,
    OnboardTrackingModule,
    ContactModule,
    ContactPropertyModule,
  ],
  controllers: [AgentController],
  providers: [AgentService],
})
export class AgentModule {}
