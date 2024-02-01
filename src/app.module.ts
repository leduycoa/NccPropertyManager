import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { UserModule } from './user/user.module';
import { AuthenticationModule } from './authentication/authentication.module';
import { AgencyModule } from './agency/agency.module';
import { AgencyAgentModule } from './agency-agent/agency-agent.module';
import { MailModule } from './mail/mail.module';

@Module({
  imports: [
    PrismaModule,
    UserModule,
    AuthenticationModule,
    AgencyModule,
    AgencyAgentModule,
    MailModule,
  ],
})
export class AppModule {}
