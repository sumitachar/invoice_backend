import { Controller, Post, Body, UseGuards, Req, Get, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { JwtAuthGuard } from './jwt-auth.guard';
import { Request } from 'express';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config'; // ✅ Import
import { JsonWebTokenError, TokenExpiredError } from 'jsonwebtoken'; // Import the relevant error classes

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private jwtService: JwtService,           // ✅ Inject JwtService
    private configService: ConfigService,     // ✅ Inject ConfigService
  ) {}

  @Post('register')
  async register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @Post('login')
  async login(@Body() body: { email: string; password: string }) {
    const user = await this.authService.validateUser(body.email, body.password);
    return this.authService.login(user);
  }

  @Get('validate')
  @UseGuards(JwtAuthGuard)
  async validateToken(@Req() req: Request & { user: any }) {
    return { valid: true, user: req.user };
  }

  @Post('refresh')
  async refresh(@Body('refresh_token') refresh_token: string) {
    try {
      const decoded = this.jwtService.verify(refresh_token, {
        secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
      });
  
      const user = await this.authService.getUserByEmail(decoded.email);
  
      const newAccessToken = this.jwtService.sign(
        {
          email: user.email,
          shop_id: user.shop_id,
        },
        {
          secret: this.configService.get<string>('JWT_SECRET'), // ✅ Always sign access tokens with JWT_SECRET
          expiresIn: '15m', // ✅ Set expiry for new access token also
        }
      );
  
      return { access_token: newAccessToken };
    } catch (err) {
      console.error('Error in refresh token:', err.message);
      if (err instanceof TokenExpiredError) {
        throw new UnauthorizedException('Refresh token expired');
      }
      if (err instanceof JsonWebTokenError) {
        throw new UnauthorizedException('Invalid refresh token');
      }
      throw new UnauthorizedException('Invalid refresh token');
    }
  }
  
}
