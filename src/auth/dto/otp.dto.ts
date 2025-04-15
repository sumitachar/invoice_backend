import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class OtpDto {
  @IsEmail({}, { message: 'Invalid email format' })
  email: string;

  @IsString()
  @IsNotEmpty({ message: 'OTP is required' })
  otp: string;
}
