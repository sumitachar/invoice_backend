import { Controller, Post, Body, Param, Get } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './user.entity';

@Controller('users')
export class UserController {
  constructor(private userService: UserService) {}

  @Post('create')
  async createUser(@Body() userData: Partial<User>) {
    return this.userService.createUser(userData);
  }

  @Get(':id')
  async getUser(@Param('id') id: number) {
    return this.userService.findById(id);
  }

  @Post('activate/:id')
  async activateSubscription(@Param('id') id: number) {
    return this.userService.activateSubscription(id);
  }
}
