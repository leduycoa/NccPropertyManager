import { Body, Controller, Post } from '@nestjs/common';
import { OnboardTrackingService } from './onboard-tracking.service';

@Controller('onboard-tracking')
export class OnboardTrackingController {
  constructor(
    private readonly onboardTrackingService: OnboardTrackingService,
  ) {}
  @Post('/event')
  eventWebhook(@Body() data) {
    this.onboardTrackingService.updateOnboardTrackingStatus(data);
  }
}
