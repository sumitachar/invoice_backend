import {
  Controller,
  Post,
  Patch,
  Body,
  BadRequestException,
  Query,
} from '@nestjs/common';
import { SupplierService } from './supplier.service';
import { CreateSupplierDto } from './dto/supplier.dto';
import { Supplier } from './supplier.entity';

@Controller('supplier')
export class SupplierController {
  constructor(private readonly supplierService: SupplierService) {}

  // ✅ Create Supplier
  @Post('/create')
  async createSupplier(
    @Body('shop_id') shop_id: number,
    @Body() createSupplierDto: CreateSupplierDto
  ) {
    if (!shop_id) {
      throw new BadRequestException('shop_id is required');
    }

    return this.supplierService.createSupplier(shop_id, createSupplierDto);
  }

  // ✅ List with Pagination — shop_id in body, page+limit in query
  @Post('/list')
  async getSuppliersWithPagination(
    @Body('shop_id') shop_id: number,
    @Query('page') page = 1,
    @Query('limit') limit = 10,
  ): Promise<{ suppliers: Supplier[]; totalPages: number }> {
    if (!shop_id) {
      throw new BadRequestException('shop_id is required');
    }

    return this.supplierService.getSuppliersWithPagination(shop_id, page, limit);
  }

  // ✅ All List — shop_id in body
  @Post('/all_list')
  async getAllSuppliers(@Body('shop_id') shop_id: number): Promise<{ suppliers: Supplier[] }> {
    if (!shop_id) {
      throw new BadRequestException('shop_id is required');
    }

    const suppliers = await this.supplierService.getAllSuppliers(shop_id);
    return { suppliers };
  }

  // ✅ Update Supplier — shop_id and supplier_id in body
  @Patch('/update')
  async updateSupplier(
    @Body() body: CreateSupplierDto & { shop_id: number; supplier_id: string }
  ) {
    const { shop_id, supplier_id } = body;

    if (!shop_id || !supplier_id) {
      throw new BadRequestException('shop_id and supplier_id are required');
    }

    console.log("########",shop_id, supplier_id, body)

    return this.supplierService.updateSupplier(shop_id, supplier_id, body);
  }

  // ✅ Soft Delete Supplier — shop_id and supplier_id in body
  @Patch('/soft-delete')
  async softDeleteSupplier(@Body() body: { shop_id: number; supplier_id: string }) {
    const { shop_id, supplier_id } = body;

    if (!supplier_id || !shop_id) {
      throw new BadRequestException('supplier_id and shop_id are required');
    }

    return this.supplierService.softDeleteSupplier(shop_id, supplier_id);
  }
}
