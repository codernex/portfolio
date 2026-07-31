import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
  UploadedFiles,
} from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { MediaService } from './media.service';

@Controller('media')
export class MediaController {
  constructor(private readonly mediaService: MediaService) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadSingle(@UploadedFile() file: Express.Multer.File) {
    const media = await this.mediaService.uploadFile(file);
    return media;
  }

  @Post('uploads')
  @UseInterceptors(FilesInterceptor('files'))
  async uploadMultiple(@UploadedFiles() files: Express.Multer.File[]) {
    const urls = await Promise.all(
      files.map((file) => this.mediaService.uploadFile(file).then((m) => m)),
    );
    return urls;
  }
}
