import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { UserModule } from './user/user.module';
import { AuthenticationModule } from './authentication/authentication.module';

@Module({
  imports: [PrismaModule, UserModule, AuthenticationModule],
  controllers: [],
  providers: [],
})
export class AppModule {}