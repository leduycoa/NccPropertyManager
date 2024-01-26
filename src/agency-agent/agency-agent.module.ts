import { Module } from '@nestjs/common';
import { AgencyAgentController } from './agency-agent.controller';
import { AgencyAgentService } from './agency-agent.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [PrismaModule, UserModule],
  controllers: [AgencyAgentController],
  providers: [AgencyAgentService],
})
export class AgencyAgentModule {}
