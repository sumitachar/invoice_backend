import { Module } from '@nestjs/common';
import { StoreController } from './store.controller';
import { StoreService } from './store.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from 'src/product/product.entity';
import { User } from 'src/user/user.entity';
import { Store } from './store.entity';

@Module({
  imports: [
      TypeOrmModule.forFeature([Product,  User, Store]), // Register Product, Category, and User repositories
    ],
  controllers: [StoreController],
  providers: [StoreService]
})
export class StoreModule {}
