import { Module } from '@nestjs/common';
import { AgencyAgentController } from './agency-agent.controller';
import { AgencyAgentService } from './agency-agent.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { UserModule } from 'src/user/user.module';
import { MailModule } from 'src/mail/mail.module';
import { AgencyModule } from 'src/agency/agency.module';
import { AgencyService } from 'src/agency/agency.service';

@Module({
  imports: [PrismaModule, UserModule, MailModule, AgencyModule],
  controllers: [AgencyAgentController],
  providers: [AgencyAgentService],
})
export class AgencyAgentModule {}
