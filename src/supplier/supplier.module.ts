import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SupplierController } from './supplier.controller';
import { SupplierService } from './supplier.service';
import { Supplier } from './supplier.entity'; // adjust path if needed
import { User } from 'src/user/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Supplier,User])], // 👈 Register Supplier entity
  controllers: [SupplierController],
  providers: [SupplierService],
})
export class SupplierModule {}
