import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsOptional,
  IsString,
  IsUUID,
  IsUrl,
  IsNotEmpty,
  ArrayNotEmpty,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ProjectStatus } from '../entities/project.entity';
import { ContentBlockDto } from 'src/core/dto/content.block.dto';

export class CreateProjectDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsOptional()
  @IsString()
  slug?: string;

  @IsString()
  shortDescription: string;

  @IsString()
  fullDescription: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ContentBlockDto)
  content: ContentBlockDto[];

  @IsString()
  thumbnailUrl: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  images?: string[];

  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  technologies: string[];

  // 🔹 Tag IDs
  @IsOptional()
  @IsArray()
  @IsUUID('4', { each: true })
  tags?: string[];

  @IsOptional()
  @IsUrl()
  liveUrl?: string;

  @IsOptional()
  @IsUrl()
  githubUrl?: string;

  @IsOptional()
  @IsBoolean()
  featured?: boolean;

  @IsOptional()
  @Type(() => Number)
  order?: number;

  // SEO
  @IsOptional()
  @IsString()
  seoTitle?: string;

  @IsOptional()
  @IsString()
  seoDescription?: string;

  @IsOptional()
  @IsString()
  seoKeywords?: string;

  @IsOptional()
  @IsEnum(ProjectStatus)
  status?: ProjectStatus;

  @IsOptional()
  publishedAt?: Date;
}
