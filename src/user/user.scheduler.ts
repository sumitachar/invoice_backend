import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';

@Injectable()
export class UserScheduler {
  constructor(@InjectRepository(User) private userRepository: Repository<User>) {}

  async checkExpiredSubscriptions() {
    const today = new Date();

    const activeUsers = await this.userRepository.find({ where: { subscription_status: 'active' } });

    for (const user of activeUsers) {
      if (user.subscription_expiry && new Date(user.subscription_expiry) < today) {
        await this.userRepository.update(user.id, { subscription_status: 'expired' });
        console.log(`User ${user.email} subscription expired.`);
      }
    }
  }
}
