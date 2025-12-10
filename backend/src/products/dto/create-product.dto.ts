import { IsString, IsNumber, IsOptional, IsBoolean, IsEnum } from 'class-validator';
import { ProductType } from '../entities/product.entity';

export class CreateProductDto {
  @IsString()
  name: string;

  @IsNumber()
  price: number;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  image?: string;

  @IsOptional()
  @IsBoolean()
  isAvailable?: boolean;

  @IsOptional()
  @IsEnum(ProductType)
  type?: ProductType;
}
