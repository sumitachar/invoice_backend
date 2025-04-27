// store.dto.ts
import {
    IsNotEmpty,
    IsString,
    IsOptional,
    IsBoolean,
    IsNumber,
  } from 'class-validator';
  
  export class CreateStoreDto {
    @IsNotEmpty()
    @IsBoolean()
    store_del: boolean; // Required: Is store deleted?
  
    @IsNotEmpty()
    @IsString()
    store_name: string; // Required: Store name
  
    @IsOptional()
    @IsString()
    address?: string; // Optional: Address of the store
  
    @IsOptional()
    @IsString()
    phone_number?: string; // Optional: Phone number
  
    @IsOptional()
    @IsString()
    lock_key?: string; // Optional: Lock key
  
    @IsOptional()
    @IsString()
    login_password?: string; // Optional: Login password
  
    @IsOptional()
    @IsString()
    admin_password?: string; // Optional: Admin password
  
    @IsNotEmpty()
    @IsNumber()
    shop_id: number; // Required: Associate the store with shop/user
  }
  
  export class UpdateStoreDto {
    @IsOptional()
    @IsBoolean()
    store_del?: boolean; // Optional: Update deletion status
  
    @IsOptional()
    @IsString()
    store_name?: string; // Optional: Update store name
  
    @IsOptional()
    @IsString()
    address?: string; // Optional: Update address
  
    @IsOptional()
    @IsString()
    phone_number?: string; // Optional: Update phone number
  
    @IsOptional()
    @IsString()
    lock_key?: string; // Optional: Update lock key
  
    @IsOptional()
    @IsString()
    login_password?: string; // Optional: Update login password
  
    @IsOptional()
    @IsString()
    admin_password?: string; // Optional: Update admin password
  }
  