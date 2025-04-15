import { Transform } from 'class-transformer';
import { IsEmail, IsNotEmpty, IsString, IsOptional, MinLength, Matches, IsNumber } from 'class-validator';

export class RegisterDto {
 

  @IsNotEmpty()
  @IsString()
  shop_name: string;

  @IsNotEmpty()
  @IsString()
  owner_name: string;

  @IsNotEmpty()
  @IsEmail({}, { message: 'Invalid email format' })
  email: string;

  @IsNotEmpty()
  @MinLength(6, { message: 'Password must be at least 6 characters' })
  password: string;

  @IsNotEmpty()
  @Matches(/^[0-9]{10}$/, { message: 'Mobile number must be a 10-digit number' })
  mobile_number: string;

  @IsOptional()
  @IsString()
  subscription_status?: string; // Optional, defaults to 'inactive' in the entity

  @IsOptional()
  subscription_expiry?: Date; // Optional, as new users may not have a subscription yet
}
