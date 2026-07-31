import {
  ContactsApi,
  ContactsApiApiKeys,
  CreateContact,
  TransactionalEmailsApi,
  TransactionalEmailsApiApiKeys,
} from '@getbrevo/brevo';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ContactList } from './constant';
import { welcomeEmail } from 'src/templates/welcome';
import { CreateContactDto } from 'src/modules/contact/contact.controller';

@Injectable()
export class BrevoService {
  private readonly contactsApi: ContactsApi;
  private readonly transactionEmailApi: TransactionalEmailsApi;
  constructor(private readonly configService: ConfigService) {
    const contactsApi = new ContactsApi();
    const transactionApi = new TransactionalEmailsApi();
    contactsApi.setApiKey(
      ContactsApiApiKeys.apiKey,
      this.configService.getOrThrow('BREVO_API_KEY'),
    );

    transactionApi.setApiKey(
      TransactionalEmailsApiApiKeys.apiKey,
      this.configService.getOrThrow('BREVO_API_KEY'),
    );
    this.contactsApi = contactsApi;
    this.transactionEmailApi = transactionApi;
  }

  createContact(payload: CreateContact) {
    return this.contactsApi.createContact({
      ...payload,
      listIds: [ContactList.CUSTOMER_QUERY],
    });
  }

  async sendEmail({ email, name }: CreateContactDto) {
    return this.transactionEmailApi.sendTransacEmail({
      htmlContent: welcomeEmail(),
      sender: {
        email: 'contact@codernex.dev',
        name: 'Borhan Uddin (Codernex)',
      },
      to: [
        {
          email,
          name,
        },
      ],
      subject: 'RE: Inbound_Signal // Status: 200 OK (Borhan Uddin)',
    });
  }

  async sendCustomerEmail({ email, name, subject, message }: CreateContactDto) {
    await this.transactionEmailApi.sendTransacEmail({
      htmlContent: `
      <div>
        ${welcomeEmail()}
        <hr />
        <p><strong>Copy of your message:</strong></p>
        <p>Subject: ${subject}</p>
        <p>${message}</p>
      </div>
    `,
      sender: {
        email: 'contact@codernex.dev',
        name: 'Borhan Uddin (Codernex)',
      },
      to: [
        {
          email,
          name,
        },
      ],
      bcc: [
        {
          email: 'admin@codernex.dev',
          name: 'Borhan Admin Copy',
        },
      ],
      subject: `RE: ${message} // Status: 200 OK`,
    });
  }
}
