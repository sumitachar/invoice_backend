import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { User } from '../user/user.entity';
import 'dotenv/config';
import { Category } from 'src/category/category.entity';
import { Product } from 'src/product/product.entity';
import { Supplier } from 'src/supplier/supplier.entity';

export const databaseConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT ?? '5432'),
  username: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASS || 'sumit89',
  database: process.env.DB_NAME || 'invoice',
  entities: [User, Category, Product, Supplier], 
  synchronize: true
};
