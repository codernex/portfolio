import {
  IsBoolean,
  IsEnum,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';

export class ContentBlockMetadataDto {
  @IsOptional()
  @IsString()
  url?: string;

  @IsOptional()
  @IsString()
  alt?: string;

  @IsOptional()
  @IsString()
  language?: string;

  @IsOptional()
  @IsBoolean()
  checked?: boolean;

  @IsOptional()
  @IsNumber()
  level?: number;
}

export class ContentBlockDto {
  @IsUUID()
  id: string;

  @IsEnum([
    'paragraph',
    'heading1',
    'heading2',
    'heading3',
    'bulletList',
    'numberedList',
    'quote',
    'image',
    'code',
    'checklist',
    'mermaid',
    'table',
  ])
  type: string;

  @IsString()
  content: string;

  @IsOptional()
  @IsObject()
  metadata?: ContentBlockMetadataDto;
}
