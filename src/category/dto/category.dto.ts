import { IsNotEmpty, IsString, IsOptional, IsNumber, IsBoolean } from 'class-validator';

export class CreateCategoryDto {

  @IsNotEmpty()
  @IsNumber()
  category_id: number; // Required: Shop ID to associate the category
  
  @IsNotEmpty()
  @IsNumber()
  shop_id: number; // Required: Shop ID to associate the category

  @IsNotEmpty()
  @IsString()
  category_name: string; // Required: Category name

  @IsOptional()
  @IsString()
  description?: string; // Optional: Category description
}

export class UpdateCategoryDto {
  @IsOptional()
  @IsString()
  category_name?: string; // Optional: Update category name

  @IsOptional()
  @IsString()
  description?: string; // Optional: Update category description

  @IsOptional()
  @IsBoolean()
  cat_del?:boolean;
}
