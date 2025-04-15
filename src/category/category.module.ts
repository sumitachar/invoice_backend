import { Module } from '@nestjs/common';
import { CategoryController } from './category.controller';
import { CategoryService } from './category.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Category } from './category.entity';
import { User } from 'src/user/user.entity';

@Module({
  imports: [
      TypeOrmModule.forFeature([Category, User]), // Register Product, Category, and User repositories
    ],
  controllers: [CategoryController],
  providers: [CategoryService]
})
export class CategoryModule {}
