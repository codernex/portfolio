import { Injectable } from '@nestjs/common';
import { GoogleClient } from './client';

@Injectable()
export class GoogleService {
  constructor(private readonly googleClient: GoogleClient) {}
}
