import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScheduleModule } from '@nestjs/schedule'; // ✅ Import ScheduleModule
import { databaseConfig } from './config/database.config';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { CategoryModule } from './category/category.module';
import { ProductModule } from './product/product.module';
import { SupplierModule } from './supplier/supplier.module';
import { StoreModule } from './store/store.module';
import { GstModule } from './gst/gst.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot(databaseConfig),
    ScheduleModule.forRoot(), // ✅ Now it will work
    AuthModule,
    UserModule,
    CategoryModule,
    ProductModule,
    SupplierModule,
    StoreModule,
    GstModule,
  ],
})
export class AppModule {}
