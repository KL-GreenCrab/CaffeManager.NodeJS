import { IsInt } from 'class-validator';

export class AddItemDto {
  @IsInt()
  productId: number;

  @IsInt()
  quantity: number;
}
