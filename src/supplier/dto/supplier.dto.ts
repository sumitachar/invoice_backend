// src/supplier/dto/supplier.dto.ts

import {
    IsArray,
    IsBoolean,
    IsNotEmpty,
    IsNumber,
    IsOptional,
    IsString,
  } from 'class-validator';
  
  export class CreateSupplierDto {
    @IsOptional()
    @IsString()
    supplier_id?: string;
  
    @IsBoolean()
    sup_del: boolean;
  
    @IsNotEmpty()
    @IsString()
    supplier_name: string;
  
    @IsOptional()
    @IsArray()
    @IsString({ each: true }) // ensures each item in the array is a string
    address?: string[];
  
    @IsOptional()
    @IsString()
    country_code?: string;
    
    @IsString()
    @IsNotEmpty()
    mobile: string;
    
  
    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    product?: string[];
  
    @IsNotEmpty()
    @IsNumber()
    category_id: number;
 
  }
  