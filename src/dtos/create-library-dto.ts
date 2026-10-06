import { IsInt, IsPositive } from 'class-validator';

export class CreateLibraryDto {
  @IsInt()
  @IsPositive()
  userId!: number;
}
