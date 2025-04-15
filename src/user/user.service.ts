import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';

@Injectable()
export class UserService {
  constructor(@InjectRepository(User) private userRepository: Repository<User>) {}

  async findByShopId(shop_id: number): Promise<User | null> {
    return await this.userRepository.findOne({ where: { shop_id } });
  }

  async findByEmail(email: string): Promise<User | undefined> {
    const user = await this.userRepository.findOne({ where: { email } });
    return user ?? undefined;  // Convert null to undefined
  }
  
  async findById(id: number): Promise<User | undefined> {
    const user = await this.userRepository.findOne({ where: { id } });
    return user ?? undefined;  // Convert null to undefined
  }

  async createUser(userData: Partial<User>) {
    if (!userData.shop_id) throw new Error('shop_id is required');
    
    const newUser = this.userRepository.create(userData);
    return await this.userRepository.save(newUser);
  }

  async activateSubscription(userId: number) {
    const expiryDate = new Date();
    expiryDate.setFullYear(expiryDate.getFullYear() + 1);

    await this.userRepository.update(userId, {
      subscription_status: 'active',
      subscription_expiry: expiryDate,
    });

    console.log(`User ${userId} subscription activated until:`, expiryDate);
  }

 
  
}
