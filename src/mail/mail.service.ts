import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as SendGrid from '@sendgrid/mail';
import * as sgClient from '@sendgrid/client';
import * as fs from 'fs';
import Handlebars from 'handlebars';

@Injectable()
export class MailService {
  constructor(private readonly configService: ConfigService) {
    SendGrid.setApiKey(this.configService.get('SEND_GRID_KEY'));
    sgClient.setApiKey(this.configService.get('SEND_GRID_KEY'));
  }

  async send({ email, sender, template, info }) {
    const filePath = `src/mail/templates/${template}`;
    const htmlContent = fs.readFileSync(filePath, 'utf8');
    const compiledTemplate = Handlebars.compile(htmlContent);
    const renderedHtml = compiledTemplate(info);

    const mail = {
      to: email,
      from: sender,
      subject: 'Welcome to Our Platform',
      text: 'Hello',
      html: renderedHtml,
    };
    const transport = await SendGrid.send(mail);
    return transport;
  }
}
