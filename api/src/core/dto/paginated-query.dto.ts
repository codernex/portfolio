import { IsOptional, IsInt, Min, Max, IsString, IsEnum } from 'class-validator';
import { Type } from 'class-transformer';

export class PaginationQueryDto {
  @IsOptional()
  @Type(() => Number) // Transform string from URL to number
  @IsInt()
  @Min(1)
  page?: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100) // Prevent "denial of service" via massive limit requests
  limit?: number = 10;

  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsString()
  sort?: string = 'createdAt';

  @IsOptional()
  @IsEnum(['ASC', 'DESC'])
  order?: 'ASC' | 'DESC' = 'DESC';
}
