import { Type } from 'class-transformer';
import { IsArray, IsInt, IsNumber, IsOptional, Min, ValidateNested } from 'class-validator';

export class PurchaseItemDto {
  @IsInt()
  @Min(1)
  gameId!: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  acquisitionPrice?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  discount?: number;
}

export class CreatePurchaseDto {
  @IsOptional()
  @IsNumber()
  @Min(0)
  totalPrice?: number;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PurchaseItemDto)
  items!: PurchaseItemDto[];
}
