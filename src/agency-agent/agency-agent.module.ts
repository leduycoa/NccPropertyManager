import { Module } from '@nestjs/common';
import { AgencyAgentController } from './agency-agent.controller';
import { AgencyAgentService } from './agency-agent.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { UserModule } from 'src/user/user.module';
import { MailModule } from 'src/mail/mail.module';
import { AgencyModule } from 'src/agency/agency.module';
import { AgencyService } from 'src/agency/agency.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    PrismaModule,
    UserModule,
    MailModule,
    AgencyModule,
    ConfigModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get('JWT_SECRET'),
        signOptions: {
          expiresIn: '172800s',
        },
      }),
    }),
  ],
  controllers: [AgencyAgentController],
  providers: [AgencyAgentService],
})
export class AgencyAgentModule {}
