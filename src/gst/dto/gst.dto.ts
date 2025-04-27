import { IsNotEmpty, IsNumber, IsString, IsOptional, IsDecimal } from 'class-validator';

// DTO for creating GST (including SGST, CGST, IGST)
export class CreateGstDto {
  @IsNotEmpty()
  @IsNumber()
  category_id: number;  // Required: Category ID to associate the GST with a category

  @IsNotEmpty()
  @IsNumber()
  shop_id: number;  // Required: Shop ID to associate the GST with a shop

  @IsNotEmpty()
  @IsDecimal()
  SGST: number;  // Required: State GST value

  @IsNotEmpty()
  @IsDecimal()
  CGST: number;  // Required: Central GST value

  @IsNotEmpty()
  @IsDecimal()
  IGST: number;  // Required: Integrated GST value
}

// DTO for updating GST (optional fields)
export class UpdateGstDto {
  @IsOptional()
  @IsDecimal()
  SGST?: number;  // Optional: State GST value for update

  @IsOptional()
  @IsDecimal()
  CGST?: number;  // Optional: Central GST value for update

  @IsOptional()
  @IsDecimal()
  IGST?: number;  // Optional: Integrated GST value for update

  @IsOptional()
  @IsNumber()
  category_id?: number;  // Optional: Update associated category ID

  @IsOptional()
  @IsNumber()
  shop_id?: number;  // Optional: Update associated shop ID
}
