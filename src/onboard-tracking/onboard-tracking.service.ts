import { Injectable, Logger } from '@nestjs/common';
import { OnboardTrackingStatusEnum, Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserService } from 'src/user/user.service';

@Injectable()
export class OnboardTrackingService {
  private readonly logger = new Logger(OnboardTrackingService.name);
  constructor(
    private readonly prisma: PrismaService,
    private readonly userService: UserService,
  ) {}

  async createOnboardTracking(data: Prisma.OnboardTrackingCreateManyInput) {
    const onboardTracking = this.prisma.onboardTracking.create({
      data,
    });
    return onboardTracking;
  }

  async updateOnboardTrackingStatus(data) {
    const eventReceived = data[0].event;
    const user = await this.userService.getUserByEmail(data[0].email);
    let status: OnboardTrackingStatusEnum =
      OnboardTrackingStatusEnum.SENT_NOT_DELIVERED;
    if (eventReceived === 'delivered') {
      status = OnboardTrackingStatusEnum.SENT_DELIVERED;
    }
    if (eventReceived === 'open') {
      status = OnboardTrackingStatusEnum.DELIVERED_READ;
    }

    const tracking = this.prisma.onboardTracking.update({
      where: {
        userId: user.id,
      },
      data: {
        status,
      },
    });
    return tracking;
  }
}
