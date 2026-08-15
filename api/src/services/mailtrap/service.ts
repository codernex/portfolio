import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MailtrapClient } from 'mailtrap';
import { CreateContactDto } from 'src/modules/contact/contact.controller';
import { welcomeEmail } from 'src/templates/welcome';

@Injectable()
export class MailtrapService {
  private readonly client: MailtrapClient;
  private readonly logger = new Logger(MailtrapService.name);

  constructor(private readonly configService: ConfigService) {
    const token =
      this.configService.get<string>('MAILTRAP_TOKEN') ||
      this.configService.get<string>('MAILTRAP_API_KEY') ||
      '';

    if (!token) {
      this.logger.warn(
        'MAILTRAP_TOKEN environment variable is not configured.',
      );
    }

    this.client = new MailtrapClient({ token });
  }

  async sendEmail({ email, name }: CreateContactDto) {
    const senderEmail =
      this.configService.get<string>('MAILTRAP_SENDER_EMAIL') ||
      'contact@codernex.dev';
    const senderName =
      this.configService.get<string>('MAILTRAP_SENDER_NAME') ||
      'Borhan Uddin (Codernex)';

    return this.client.send({
      from: { name: senderName, email: senderEmail },
      to: [{ email, name }],
      subject: 'RE: Inbound_Signal // Status: 200 OK (Borhan Uddin)',
      html: welcomeEmail(),
    });
  }

  async sendCustomerEmail({ email, name, subject, message }: CreateContactDto) {
    const senderEmail =
      this.configService.get<string>('MAILTRAP_SENDER_EMAIL') ||
      'contact@codernex.dev';
    const senderName =
      this.configService.get<string>('MAILTRAP_SENDER_NAME') ||
      'Borhan Uddin (Codernex)';

    return this.client.send({
      from: { name: senderName, email: senderEmail },
      to: [{ email, name }],
      subject: `RE: ${subject || message} // Status: 200 OK`,
      html: `
        <div>
          ${welcomeEmail()}
          <hr />
          <p><strong>Copy of your message:</strong></p>
          <p>Subject: ${subject || 'General Inquiry'}</p>
          <p>${message}</p>
        </div>
      `,
    });
  }
}
