import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { UserModule } from './user/user.module';
import { AuthenticationModule } from './authentication/authentication.module';
import { MailModule } from './mail/mail.module';
import { CompanyModule } from './company/company.module';
import { AgentModule } from './agent/agent.module';

@Module({
  imports: [
    PrismaModule,
    UserModule,
    AuthenticationModule,
    CompanyModule,
    AgentModule,
    MailModule,
  ],
})
export class AppModule {}
