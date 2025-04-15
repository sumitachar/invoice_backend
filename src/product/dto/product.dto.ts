import { IsNotEmpty, IsString, IsOptional, IsNumber } from 'class-validator';

export class CreateProductDto {
  @IsNotEmpty()
  @IsNumber()
  shop_id: number; // Required: Shop ID to associate the product

  @IsNotEmpty()
  @IsNumber()
  category_id: number; // Required: Category ID to associate the product

  @IsNotEmpty()
  @IsString()
  name: string; // Required: Product name

  @IsNotEmpty()
  @IsNumber()
  price: number; // Required: Product price

  @IsOptional()
  @IsString()
  description?: string; // Optional: Product description
}

export class UpdateProductDto {
  @IsOptional()
  @IsString()
  name?: string; // Optional: Update product name

  @IsOptional()
  @IsNumber()
  price?: number; // Optional: Update product price

  @IsOptional()
  @IsString()
  description?: string; // Optional: Update product description
}
