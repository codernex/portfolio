import {
  IsEnum,
  IsOptional,
  IsBooleanString,
  IsInt,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ProjectStatus } from '../entities/project.entity';

export class QueryProjectDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit?: number = 10;

  @IsOptional()
  @IsEnum(ProjectStatus)
  status?: ProjectStatus;

  @IsOptional()
  @IsBooleanString()
  featured?: string;

  @IsOptional()
  tag?: string;

  @IsOptional()
  search?: string;
}
