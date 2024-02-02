import { Controller, Get, Post, Query, Request } from '@nestjs/common';
import { MailService } from './mail.service';
import { MailTemplate } from './constant/mail.constant';

@Controller('mail')
export class MailController {
  constructor(private readonly mailService: MailService) {}

  @Post('send-email')
  async sendEmail(@Query('email') email, @Request() req) {
    return await this.mailService.send(
      email,
      req.user.email,
      MailTemplate.INVITE_AGENT,
    );
  }
}
