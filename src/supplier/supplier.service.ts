import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Supplier } from './supplier.entity';
import { CreateSupplierDto } from './dto/supplier.dto';
import { User } from 'src/user/user.entity';

@Injectable()
export class SupplierService {
  constructor(
    @InjectRepository(Supplier)
    private readonly supplierRepository: Repository<Supplier>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly dataSource: DataSource
  ) { }

  // ✅ Create Supplier
  async createSupplier(shop_id: number, createDto: CreateSupplierDto): Promise<Supplier> {
    const {
      supplier_id,
      supplier_name,
      address,
      country_code,
      mobile,
      product,
      category_id,
    } = createDto;
  
    // 1. Check if shop exists
    const shop = await this.dataSource.query(
      `SELECT * FROM "user" WHERE shop_id = $1`,
      [shop_id]
    );
    if (!shop.length) throw new NotFoundException(`Shop with ID ${shop_id} not found`);
  
    // 2. Check if category exists for the shop
    const category = await this.dataSource.query(
      `SELECT * FROM category WHERE category_id = $1 AND shop_id = $2`,
      [category_id, shop_id]
    );
    if (!category.length) {
      throw new NotFoundException(`Category with ID ${category_id} not found for shop ${shop_id}`);
    }
  
    // 3. Check if supplier_id already exists for the same shop
    const existing = await this.dataSource.query(
      `SELECT * FROM supplier WHERE supplier_id = $1 AND shop_id = $2`,
      [supplier_id, shop_id]
    );
    if (existing.length) {
      throw new ConflictException(`Supplier ID '${supplier_id}' already exists for this shop`);
    }
  
    // 4. Create supplier
    await this.dataSource.query(
      `INSERT INTO supplier (
        supplier_id, shop_id, supplier_name, address,
        country_code, mobile, product, category_id, sup_del
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, FALSE)`,
      [
        supplier_id,
        shop_id,
        supplier_name,
        address, // No need for Array.isArray check since address is a string
        country_code,
        mobile,
        Array.isArray(product) ? product.join(',') : product, // Join if it's an array
        category_id,
      ]
    );
  
    // 5. Return the created supplier
    const newSupplier = await this.dataSource.query(
      `SELECT * FROM supplier WHERE supplier_id = $1 AND shop_id = $2`,
      [supplier_id, shop_id]
    );
  
    return newSupplier[0];
  }
  

  // ✅ Get all suppliers (non-deleted)
  async getAllSuppliers(shop_id: number): Promise<Supplier[]> {
    const suppliers = await this.dataSource.query(
      `SELECT * FROM supplier WHERE shop_id = $1 AND sup_del = FALSE`,
      [shop_id]
    );
    if (!suppliers.length) {
      throw new NotFoundException(`No suppliers found for shop ${shop_id}`);
    }
    return suppliers;
  }

  // ✅ Get suppliers with pagination
  async getSuppliersWithPagination(
    shop_id: number,
    page: number,
    limit: number
  ): Promise<{ suppliers: Supplier[]; totalPages: number }> {
    const offset = (page - 1) * limit;

    const suppliers = await this.dataSource.query(
      `SELECT s.*, c.category_name
       FROM supplier s
       LEFT JOIN category c ON s.category_id = c.category_id
       WHERE s.shop_id = $1 AND s.sup_del = FALSE
       ORDER BY s.id ASC
       LIMIT $2 OFFSET $3`,
      [shop_id, limit, offset]
    );

    const totalCountRes = await this.dataSource.query(
      `SELECT COUNT(*) AS total FROM supplier WHERE shop_id = $1 AND sup_del = FALSE`,
      [shop_id]
    );

    const total = parseInt(totalCountRes[0].total, 10);
    const totalPages = Math.ceil(total / limit);

    return { suppliers, totalPages };
  }

  // ✅ Update supplier (based on supplier_id + shop_id)
  async updateSupplier(
    shop_id: number,
    supplier_id: string,
    updateDto: CreateSupplierDto
  ): Promise<Supplier> {
    const {
      supplier_name,
      address,
      country_code,
      mobile,
      product,
      category_id,
    } = updateDto;

    // Check if supplier exists
    const supplier = await this.dataSource.query(
      `SELECT * FROM supplier WHERE supplier_id = $1 AND shop_id = $2`,
      [supplier_id, shop_id]
    );
    if (!supplier.length) throw new NotFoundException("Supplier not found");

    const formattedAddress = Array.isArray(address) ? address.join(',') : address;
    console.log("@@@@@@@@@@@",supplier_name,
      formattedAddress, // Use formattedAddress here
      country_code,
      mobile,
      product?.join(','),
      category_id,
      supplier_id,
      shop_id,)

    await this.dataSource.query(
      `UPDATE supplier SET 
    supplier_name = $1,
    address = $2,
    country_code = $3,
    mobile = $4,
    product = $5,
    category_id = $6
   WHERE supplier_id = $7 AND shop_id = $8`,
      [
        supplier_name,
        formattedAddress, // Use formattedAddress here
        country_code,
        mobile,
        product?.join(','),
        category_id,
        supplier_id,
        shop_id,
      ]
    );


    const updated = await this.dataSource.query(
      `SELECT * FROM supplier WHERE supplier_id = $1 AND shop_id = $2`,
      [supplier_id, shop_id]
    );

    return updated[0];
  }

  // ✅ Soft delete supplier (based on supplier_id + shop_id)
  async softDeleteSupplier(shop_id: number, supplier_id: string): Promise<Supplier> {
    const supplier = await this.dataSource.query(
      `SELECT * FROM supplier WHERE supplier_id = $1 AND shop_id = $2`,
      [supplier_id, shop_id]
    );
    if (!supplier.length) throw new NotFoundException('Supplier not found');

    await this.dataSource.query(
      `UPDATE supplier SET sup_del = TRUE WHERE supplier_id = $1 AND shop_id = $2`,
      [supplier_id, shop_id]
    );

    const updated = await this.dataSource.query(
      `SELECT * FROM supplier WHERE supplier_id = $1 AND shop_id = $2`,
      [supplier_id, shop_id]
    );

    return updated[0];
  }
}
