import { Module } from '@nestjs/common';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './product.entity';
import { Category } from 'src/category/category.entity';
import { User } from 'src/user/user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Product, Category, User]), // Register Product, Category, and User repositories
  ],
  controllers: [ProductController],
  providers: [ProductService]
})
export class ProductModule {}
