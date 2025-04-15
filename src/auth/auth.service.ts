import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { UserService } from '../user/user.service';
import { RegisterDto } from './dto/register.dto';
import { ConfigService } from '@nestjs/config'; // ✅ Import ConfigService
import { JsonWebTokenError, TokenExpiredError } from 'jsonwebtoken'; // Import the relevant error classes

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    private configService: ConfigService, // ✅ Inject ConfigService
  ) {}

  // Validate user by email and password
  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.userService.findByEmail(email);
    if (user && bcrypt.compareSync(password, user.password)) {
      return user;
    }
    throw new UnauthorizedException('Invalid credentials');
  }

  // Get user by email
  async getUserByEmail(email: string): Promise<any> {
    const user = await this.userService.findByEmail(email);
    if (!user) {
      throw new UnauthorizedException('User not found');
    }
    return user;
  }

  // Login user and generate access and refresh tokens
  async login(user: any) {
    const payload = { email: user.email, shop_id: user.shop_id };

    const access_token = this.jwtService.sign(payload);

    const refresh_token = this.jwtService.sign(payload, {
      secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
      expiresIn: '7d',
    });

    return {
      access_token,
      refresh_token,
      shop_id: user.shop_id,
    };
  }

  // Register a new user
  async register(registerDto: RegisterDto) {
    const { shop_name, owner_name, email, password, mobile_number } = registerDto;

    let shop_id: number = 0;
    let isUnique = false;

    while (!isUnique) {
      shop_id = Math.floor(100000 + Math.random() * 900000); // 6-digit unique ID
      const existingUser = await this.userService.findByShopId(shop_id);
      if (!existingUser) {
        isUnique = true;
      }
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    return this.userService.createUser({
      shop_id,
      shop_name,
      owner_name,
      email,
      password: hashedPassword,
      mobile_number,
      subscription_status: 'inactive',
      subscription_expiry: null,
    });
  }

  // Verify JWT token
  async verifyToken(token: string): Promise<any> {
    try {
      // Verify token
      const decoded = this.jwtService.verify(token);

      // Fetch user based on decoded email
      const user = await this.userService.findByEmail(decoded.email);
      if (!user) {
        throw new UnauthorizedException('User not found');
      }

      // Return user details
      return {
        shop_id: user.shop_id,
        shop_name: user.shop_name,
        owner_name: user.owner_name,
        sub_status: user.subscription_status,
        sub_expiry: user.subscription_expiry,
      };
    } catch (error) {
      console.error('Error in verifyToken:', error.message);  // Adding error logging

      // Handle specific JWT error types
      if (error instanceof TokenExpiredError) {
        throw new UnauthorizedException('Token expired');
      }
      if (error instanceof JsonWebTokenError) {
        throw new UnauthorizedException('Invalid token');
      }

      // General fallback for any other errors
      throw new UnauthorizedException('Token verification failed');
    }
  }
}
