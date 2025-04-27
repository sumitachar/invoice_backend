import { IsString, IsNumber, IsOptional, IsDateString, IsBoolean } from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';

export class CreateProductDto {
  @IsOptional()
  @IsString()
  product_code?: string;

  @IsNumber()
  category_id: number;
  
  @IsOptional()
  @IsString()
  category_name?: string;

  @IsOptional()
  @IsString()
  product_name?: string;

  @IsOptional()
  @IsNumber()
  total_pack?: number;

  @IsOptional()
  @IsNumber()
  qty_pr_pack?: number;

  @IsOptional()
  @IsNumber()
  ro_level?: number;

  @IsOptional()
  @IsString()
  batch?: string;

  @IsOptional()
  @IsDateString()
  mfg?: Date;

  @IsOptional()
  @IsDateString()
  exp_date?: Date;

  @IsOptional()
  @IsNumber()
  packing?: number;

  @IsOptional()
  @IsNumber()
  packing_tp?: number;

  @IsOptional()
  @IsNumber()
  packing_rp?: number;

  @IsOptional()
  @IsNumber()
  unit_tp?: number;

  @IsOptional()
  @IsNumber()
  unit_rp?: number;

  @IsOptional()
  @IsNumber()
  unit_stock?: number;

  @IsOptional()
  @IsBoolean()
  del_product?: boolean;

  @IsNumber()
  shop_id: number;

 
}

export class UpdateProductDto extends PartialType(CreateProductDto) {}
