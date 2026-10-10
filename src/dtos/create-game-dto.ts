import { IsArray, IsInt, IsNumber, IsOptional, IsString, Length, Min } from 'class-validator';

export class CreateGameDto {
  @IsString()
  @Length(1, 150)
  name!: string;

  @IsNumber()
  @Min(0)
  price!: number;

  @IsOptional()
  @IsArray()
  @IsInt({ each: true })
  categoryIds?: number[];
}
