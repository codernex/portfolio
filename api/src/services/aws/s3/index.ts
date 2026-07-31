import {
  HeadObjectCommand,
  PutObjectCommand,
  S3Client,
  S3ClientConfig,
} from '@aws-sdk/client-s3';
import { Injectable, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class S3Service {
  private readonly s3Client: S3Client;
  private readonly defaultBucket: string;
  private readonly region: string;

  constructor(private readonly configService: ConfigService) {
    this.region = this.configService.getOrThrow<string>('AWS_REGION');
    this.defaultBucket =
      this.configService.getOrThrow<string>('AWS_S3_BUCKET_NAME');

    const s3Config: S3ClientConfig = {
      region: this.region,
      credentials: {
        accessKeyId: this.configService.getOrThrow<string>('AWS_ACCESS_KEY_ID'),
        secretAccessKey: this.configService.getOrThrow<string>(
          'AWS_SECRET_ACCESS_KEY',
        ),
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
      // ACL: 'public-read', // Uncomment if your bucket requires explicit public ACL
    });

    await this.s3Client.send(command);

    // Return structured data so MediaService can save it to the DB
    return {
      Key,
      Bucket: targetBucket,
      Location: `https://${targetBucket}.s3.${this.region}.amazonaws.com/${Key}`,
    };
  }
}

@Module({
  providers: [S3Service],
  exports: [S3Service],
})
export class S3Module {}
