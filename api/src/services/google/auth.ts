import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Response } from 'express';
import crypto from 'node:crypto';
import { ApiKeyService } from 'src/modules/api-key/api-key.service';
import { ApiOrigin } from 'src/modules/api-key/dto/create-api-key.dto';
import { GoogleClient } from './client';

@Injectable()
export class GoogleAuthService {
  private client: ReturnType<GoogleClient['getClient']>;
  constructor(
    private readonly configService: ConfigService,
    private readonly googleClient: GoogleClient,
    private readonly apikeyService: ApiKeyService,
  ) {
    this.client = this.googleClient.getClient();
  }

  async generateAuthUrl(scopes = ['https://www.googleapis.com/auth/drive']) {
    const nonce = this.getNonce();
    await this.apikeyService.storeNonce({
      apiKey: nonce,
      orgin: ApiOrigin.nonce,
    });

    return this.client.generateAuthUrl({
      state: nonce,
      access_type: 'offline',
      scope: scopes,
      prompt: 'select_account consent',
    });
  }

  async handleOAuthCallback(state: string, code: string, res: Response) {
    try {
      const storedNonce = await this.apikeyService.getStoredNonce();
      if (!this.validateNonce(state, storedNonce?.apiKey)) {
        res.redirect('/dashboard'); // *** Adjust redirect path if needed
        return;
      }

      await this.apikeyService.deletedStoredNonce();

      await this.exchangeToken(code);

      // Redirect to a secure page
      res.redirect('/dashboard'); // *** Adjust redirect path if needed
    } catch {
      res.redirect('/dashboard'); // *** Adjust redirect path if needed
    }
  }

  async exchangeToken(code: string): Promise<void> {
    const { tokens } = await this.client.getToken(code);

    if (!tokens.refresh_token) throw new Error();
    await this.apikeyService.createApiKey({
      apiKey: tokens.refresh_token,
      orgin: ApiOrigin.google,
      expiryDate: new Date(tokens?.expiry_date ?? Date.now()),
    });

    this.client.setCredentials({
      refresh_token: tokens.refresh_token,
    });
  }

  async isAuthenticated() {
    try {
      const token = await this.apikeyService.getApiKey();
      if (!token) {
        return false;
      }
      // Set the retrieved tokens to the client
      this.client.setCredentials({
        // access_token: tokens.access_token,
        // refresh_token: tokens.refresh_token,
        // expiry_date: tokens.expiry_date ? tokens.expiry_date.getTime() : null,
      });
      return true;
    } catch {
      return false;
    }
  }

  getNonce() {
    return crypto.randomBytes(16).toString('hex');
  }

  validateNonce(recivedNonce?: string, storedNonce?: string) {
    if (!recivedNonce || !storedNonce) return false;

    const hasedRecievedNonce = crypto
      .createHmac(
        'sha256',
        this.configService.getOrThrow('GOOGLE_ENCRYPTION_KEY'),
      )
      .update(recivedNonce)
      .digest('hex');

    return hasedRecievedNonce === storedNonce;
  }
}
