import { GoogleGenAI } from '@google/genai';
import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class GeminiService implements OnModuleInit {
  private ai: GoogleGenAI;
  constructor(private readonly configService: ConfigService) {}
  onModuleInit() {
    try {
      this.ai = new GoogleGenAI({
        apiKey: this.configService.getOrThrow<string>('GEMINI_API_KEY'),
      });
    } catch (error) {
      console.log('TCL: onModuleInit -> error', error);
    }
  }
}
