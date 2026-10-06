import { IsInt, Min } from 'class-validator';

export class AddLibraryGameDto {
  @IsInt()
  @Min(0)
  timePlayed!: number;
}
