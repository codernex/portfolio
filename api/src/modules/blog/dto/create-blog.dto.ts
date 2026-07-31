// src/modules/blogs/dto/create-blog.dto.ts
import {
  IsString,
  IsArray,
  IsEnum,
  IsOptional,
  IsBoolean,
  IsUUID,
  IsUrl,
  ValidateNested,
  MinLength,
} from 'class-validator';
import { Type } from 'class-transformer';
import { BlogStatus } from '../entities/blog.entity';
import { ContentBlockDto } from 'src/core/dto/content.block.dto';

export class CreateBlogDto {
  @IsString()
  @MinLength(3)
  title: string;

  @IsString()
  @IsOptional()
  slug?: string; // Often auto-generated in service if missing

  @IsOptional()
  @IsString()
  @MinLength(10)
  excerpt: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ContentBlockDto)
  content: ContentBlockDto[];

  @IsOptional()
  @IsUrl()
  featuredImage: string;

  @IsArray()
  @IsUUID('all', { each: true })
  @IsOptional()
  tagIds?: string[];

  @IsOptional()
  @IsBoolean()
  featured?: boolean;

  @IsEnum(BlogStatus)
  @IsOptional()
  status?: BlogStatus;

  // SEO Fields
  @IsOptional()
  @IsString()
  seoTitle?: string;

  @IsOptional()
  @IsString()
  seoDescription?: string;

  @IsOptional()
  @IsString()
  seoKeywords?: string;
}
