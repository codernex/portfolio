import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { google, Auth } from 'googleapis';

@Injectable()
export class GoogleClient {
  private static instance: GoogleClient;
  D;
  private client: Auth.OAuth2Client;

  constructor(private readonly configService: ConfigService) {
    if (GoogleClient.instance) {
      return GoogleClient.instance;
    }
    GoogleClient.instance = this;
  }

  getClient() {
    if (!this.client) {
      //@ts-ignore
      this.client = new google.auth.OAuth2({
        client_id: this.configService.getOrThrow('GOOGLE_CLIENT_ID'),
        client_secret: this.configService.getOrThrow('GOOGLE_CLIENT_SECRET'),
        redirectUri: this.configService.getOrThrow('GOOGLE_REDIRECT_URI'),
      });
    }
    return this.client;
  }
}
