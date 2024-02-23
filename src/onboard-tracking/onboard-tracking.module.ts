import { Module } from '@nestjs/common';
import { OnboardTrackingController } from './onboard-tracking.controller';
import { OnboardTrackingService } from './onboard-tracking.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [PrismaModule, UserModule],
  controllers: [OnboardTrackingController],
  providers: [OnboardTrackingService],
  exports: [OnboardTrackingService],
})
export class OnboardTrackingModule {}
