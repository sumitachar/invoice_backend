import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { UserService } from '../user/user.service';
import { RegisterDto } from './dto/register.dto';
import { ConfigService } from '@nestjs/config';
import { JsonWebTokenError, TokenExpiredError } from 'jsonwebtoken';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  // Validate user credentials
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

  // Login user and return access + refresh tokens
  async login(user: any) {
    const payload = { email: user.email, shop_id: user.shop_id };

    // Generate access token (expires in 15m)
    const access_token = this.jwtService.sign(payload, {
      secret: this.configService.get<string>('JWT_SECRET'),
      expiresIn: '15m',
    });

    // Generate refresh token (expires in 7 days)
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
      shop_id = Math.floor(100000 + Math.random() * 900000); // Generate unique 6-digit ID
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

  // Verify a JWT token
  async verifyToken(token: string, isRefreshToken: boolean = false): Promise<any> {
    try {
      const secretKey = isRefreshToken
        ? this.configService.get<string>('JWT_REFRESH_SECRET')
        : this.configService.get<string>('JWT_SECRET');

      const decoded = this.jwtService.verify(token, { secret: secretKey });

      const user = await this.userService.findByEmail(decoded.email);
      if (!user) {
        throw new UnauthorizedException('User not found');
      }

      return {
        shop_id: user.shop_id,
        shop_name: user.shop_name,
        owner_name: user.owner_name,
        sub_status: user.subscription_status,
        sub_expiry: user.subscription_expiry,
      };
    } catch (error) {
      console.error('Error in verifyToken:', error.message);

      if (error instanceof TokenExpiredError) {
        throw new UnauthorizedException('Token expired');
      }

      if (error instanceof JsonWebTokenError) {
        throw new UnauthorizedException('Invalid token');
      }

      throw new UnauthorizedException('Token verification failed');
    }
  }
}
