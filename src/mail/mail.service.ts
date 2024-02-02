import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as SendGrid from '@sendgrid/mail';
import axios, { AxiosResponse, AxiosError } from 'axios';
import * as sgClient from '@sendgrid/client';
import { ClientRequest } from '@sendgrid/client/src/request';
import * as fs from 'fs';

@Injectable()
export class MailService {
  constructor(private readonly configService: ConfigService) {
    SendGrid.setApiKey(this.configService.get('SEND_GRID_KEY'));
    sgClient.setApiKey(this.configService.get('SEND_GRID_KEY'));
  }

  async send(mails: string[], sender: string, template: string) {
    const filePath = `src/mail/templates/${template}`;
    const htmlContent = fs.readFileSync(filePath, 'utf8');

    const mail = {
      to: mails,
      subject: 'Hello from sendgrid',
      from: sender,
      text: 'Hello',
      html: htmlContent,
    };
    const transport = await SendGrid.send(mail);
    return transport;
  }
}
