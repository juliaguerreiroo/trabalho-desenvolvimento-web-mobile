import { IsArray, IsInt, IsOptional, IsString, Length } from 'class-validator';

export class CreateGameDto {
  @IsString()
  @Length(1, 150)
  name!: string;

  @IsOptional()
  @IsArray()
  @IsInt({ each: true })
  categoryIds?: number[];
}
