// src/experience/dto/create-experience.dto.ts
import {
  IsString,
  IsArray,
  IsOptional,
  IsInt,
  IsNotEmpty,
} from 'class-validator';

export class CreateExperienceDto {
  @IsString()
  @IsNotEmpty()
  role: string;

  @IsString()
  @IsNotEmpty()
  company: string;

  @IsString()
  @IsOptional()
  location: string;

  @IsString()
  @IsNotEmpty()
  period: string;

  @IsArray()
  @IsString({ each: true })
  responsibilities: string[];

  @IsArray()
  @IsString({ each: true })
  achievements: string[];

  @IsArray()
  @IsString({ each: true })
  technologies: string[];

  @IsInt()
  @IsOptional()
  order: number;
}
