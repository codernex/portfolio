/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Media } from './entities/media.entity';
import { Repository } from 'typeorm';
import { S3Service } from 'src/services/aws/s3';
import { v4 } from 'uuid';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class MediaService {
  constructor(
    @InjectRepository(Media)
    private readonly repository: Repository<Media>,
    private readonly s3: S3Service,
    private readonly configService: ConfigService,
  ) {}

  private getFolderName(mimetype: string): string {
    if (mimetype.startsWith('image/')) return 'images';
    if (mimetype.startsWith('video/')) return 'videos';
    if (mimetype.startsWith('audio/')) return 'audio';
    if (
      mimetype.includes('pdf') ||
      mimetype.includes('word') ||
      mimetype.includes('zip')
    )
      return 'docs';
    return 'others';
  }

  async uploadFile(file: Express.Multer.File) {
    if (!file?.originalname || !file?.mimetype) {
      throw new BadRequestException('INVALID_FILE_PAYLOAD');
    }

    const folder = this.getFolderName(file.mimetype);
    const fileName = `${v4()}-${file.originalname}`;
    // Construct the dynamic path (Key)
    const Key = `${folder}/${fileName}`;

    const { Location } = await this.s3.uploadFile(Key, file.buffer);

    // 2. Persist to Database
    const media = this.repository.create({
      fileName: file.originalname,
      url: Location, // Ensure your S3 service returns the public URL
      key: Key,
      mimeType: file.mimetype,
      size: file.size,
    });

    return await this.repository.save(media);
  }
}
