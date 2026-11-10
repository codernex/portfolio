import {
  DeleteObjectCommand,
  HeadObjectCommand,
  PutObjectCommand,
  S3Client,
  S3ClientConfig,
} from '@aws-sdk/client-s3';
import { Injectable, Logger, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class S3Service {
  private readonly logger = new Logger(S3Service.name);
  private readonly s3Client: S3Client;
  private readonly defaultBucket: string;
  private readonly region: string;
  private readonly publicBaseUrl: string;

  constructor(private readonly configService: ConfigService) {
    this.region =
      this.configService.get<string>('R2_REGION') ||
      this.configService.get<string>('AWS_REGION') ||
      'auto';

    this.defaultBucket =
      this.configService.get<string>('R2_BUCKET_NAME') ||
      this.configService.get<string>('AWS_S3_BUCKET_NAME') ||
      'codernex';

    const rawBaseUrl =
      this.configService.get<string>('R2_PUBLIC_URL') ||
      this.configService.get<string>('NEXT_PUBLIC_S3_BASE_URL') ||
      'https://cdn.codernex.dev';
    this.publicBaseUrl = rawBaseUrl.replace(/\/+$/, '');

    const accessKeyId =
      this.configService.get<string>('R2_ACCESS_KEY_ID') ||
      this.configService.get<string>('AWS_ACCESS_KEY_ID') ||
      '';
    const secretAccessKey =
      this.configService.get<string>('R2_SECRET_ACCESS_KEY') ||
      this.configService.get<string>('AWS_SECRET_ACCESS_KEY') ||
      '';

    const accountId =
      this.configService.get<string>('R2_ACCOUNT_ID') ||
      this.configService.get<string>('CLOUDFLARE_ACCOUNT_ID');

    let endpoint =
      this.configService.get<string>('R2_ENDPOINT') ||
      this.configService.get<string>('AWS_ENDPOINT');

    if (!endpoint && accountId) {
      endpoint = `https://${accountId}.r2.cloudflarestorage.com`;
    }

    if (!endpoint && !this.configService.get<string>('AWS_REGION')) {
      this.logger.warn(
        'Neither R2_ENDPOINT nor R2_ACCOUNT_ID is specified. For Cloudflare R2, set R2_ACCOUNT_ID or R2_ENDPOINT so requests are routed to R2.',
      );
    }

    const s3Config: S3ClientConfig = {
      region: this.region,
      endpoint: endpoint || undefined,
      credentials: {
        accessKeyId,
        secretAccessKey,
      },
    };

    this.s3Client = new S3Client(s3Config);
  }

  /**
   * Check if an object exists (Head request)
   */
  async get(key: string, bucket?: string) {
    const command = new HeadObjectCommand({
      Key: key,
      Bucket: bucket ?? this.defaultBucket,
    });
    return this.s3Client.send(command);
  }

  /**
   * Uploads a file and returns the location metadata
   */
  async uploadFile(
    Key: string,
    file: Buffer,
    mimetype?: string,
    bucket?: string,
  ) {
    const targetBucket = bucket ?? this.defaultBucket;

    const command = new PutObjectCommand({
      Key,
      Bucket: targetBucket,
      Body: file,
      ContentType: mimetype,
    });

    await this.s3Client.send(command);

    const cleanKey = Key.replace(/^\/+/, '');
    const location = `${this.publicBaseUrl}/${cleanKey}`;

    // Return structured data so MediaService can save it to the DB
    return {
      Key,
      Bucket: targetBucket,
      Location: location,
    };
  }

  /**
   * Delete an object from the bucket
   */
  async deleteFile(key: string, bucket?: string) {
    const command = new DeleteObjectCommand({
      Key: key,
      Bucket: bucket ?? this.defaultBucket,
    });
    return this.s3Client.send(command);
  }
}

@Module({
  providers: [S3Service],
  exports: [S3Service],
})
export class S3Module {}
