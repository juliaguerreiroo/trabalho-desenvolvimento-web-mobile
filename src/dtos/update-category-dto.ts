import { IsArray, IsInt, IsOptional, IsString, Length } from 'class-validator';

export class UpdateCategoryDto {
  @IsOptional()
  @IsString()
  @Length(1, 100)
  name?: string;

  @IsOptional()
  @IsArray()
  @IsInt({ each: true })
  gameIds?: number[];
}
