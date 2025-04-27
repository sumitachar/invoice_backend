import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Product } from './product.entity';
import { User } from 'src/user/user.entity';
import { CreateProductDto, UpdateProductDto } from './dto/product.dto';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly dataSource: DataSource,
  ) {}

  // ✅ Create Product
  async createProduct(
    shop_id: number,
    createDto: CreateProductDto,
  ): Promise<Product> {
    const {
      product_code,
      category_id,
      category_name,
      product_name,
      unit_rp,
      unit_tp,
      total_pack,
      qty_pr_pack,
      ro_level,
      batch,
      mfg,
      exp_date,
      packing,
      packing_tp,
      packing_rp,
      unit_stock,
    } = createDto;

    // console.log("createDto", product_code,
    //   category_id,
    //   product_name,
    //   category_name,
    //   unit_rp,
    //   unit_tp,
    //   total_pack,
    //   qty_pr_pack,
    //   ro_level,
    //   batch,
    //   mfg,
    //   exp_date,
    //   packing,
    //   packing_tp,
    //   packing_rp,
    //   unit_stock)
    // 1. Check shop exists
    const shop = await this.dataSource.query(
      `SELECT * FROM "user" WHERE shop_id = $1`,
      [shop_id],
    );

    if (!shop.length)
      throw new NotFoundException(`Shop with ID ${shop_id} not found`);

    // 2. Check category exists for shop
    const category = await this.dataSource.query(
      `SELECT * FROM category WHERE category_id = $1 AND shop_id = $2`,
      [category_id, shop_id],
    );
    if (!category.length)
      throw new NotFoundException(
        `Category ID ${category_id} not found for shop ${shop_id}`,
      );

    // 3. Check product_code uniqueness
    const existing = await this.dataSource.query(
      `SELECT * FROM product WHERE product_code = $1 AND shop_id = $2`,
      [product_code, shop_id],
    );
    if (existing.length)
      throw new ConflictException(
        `Product code '${product_code}' already exists for this shop`,
      );

    // 4. Insert product
    await this.dataSource.query(
      `INSERT INTO product (
        product_code, shop_id, product_name, category_name, category_id,
        unit_tp, unit_rp, total_pack, qty_pr_pack, ro_level,
        batch, mfg, exp_date, packing, packing_tp, packing_rp,unit_stock, del_product
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8, $9,
        $10, $11, $12, $13, $14, $15, $16, $17, FALSE
      )`,
      [
        product_code,
        shop_id,
        product_name,
        category_name,
        category_id,
        unit_tp,
        unit_rp,
        total_pack,
        qty_pr_pack,
        ro_level,
        batch,
        mfg,
        exp_date,
        packing,
        packing_tp,
        packing_rp,
        unit_stock, 
      ],
    );
    
    // 5. Return created product
    const newProduct = await this.dataSource.query(
      `SELECT * FROM product WHERE product_code = $1 AND shop_id = $2`,
      [product_code, shop_id],
    );

    return newProduct[0];
  }

  async getAllProductsPaginated(
    shop_id: number,
    page: number,
    limit: number,
  ): Promise<{ products: Product[]; totalPages: number }> {
    const offset = (page - 1) * limit;
  
    const productsRaw = await this.dataSource.query(
      `SELECT * FROM product 
       WHERE shop_id = $1 AND del_product = FALSE 
       ORDER BY id ASC 
       LIMIT $2 OFFSET $3`,
      [shop_id, limit, offset],
    );
  
    const totalCountRes = await this.dataSource.query(
      `SELECT COUNT(*) AS total 
       FROM product 
       WHERE shop_id = $1 AND del_product = FALSE`,
      [shop_id],
    );
  
    const total = parseInt(totalCountRes[0].total, 10);
    const totalPages = Math.ceil(total / limit);
  
    // ✅ Format dates in DD/MM/YYYY (Indian) format
    const products = productsRaw.map((product) => ({
      ...product,
      mfg: product.mfg ? new Date(product.mfg).toLocaleDateString('en-IN') : null,
      exp_date: product.exp_date ? new Date(product.exp_date).toLocaleDateString('en-IN') : null,
    }));
  
    return { products, totalPages };
  }
  
  

  // ✅ Get products by category with pagination
  async getProductsByCategory(
    shop_id: number,
    category_id: number,
  ): Promise<Product[]> {
    const products = await this.dataSource.query(
      `SELECT p.*, c.category_name 
       FROM product p
       LEFT JOIN category c ON p.category_id = c.category_id
       WHERE p.shop_id = $1 AND p.category_id = $2 AND p.del_product = FALSE
       ORDER BY p.id ASC`,
      [shop_id, category_id],
    );
  
    return products;
  }
  

  // ✅ Update product
  async updateProduct(
    shop_id: number,
    product_code: string,
    updateDto: UpdateProductDto,
  ): Promise<Product> {
    // Destructure properties from updateDto with fallback values (null for optional fields)
    const {
      product_name = null,
      category_id = null,
      unit_tp = null,
      unit_rp = null,
      total_pack = null,
      qty_pr_pack = null,
      ro_level = null,
      batch = null,
      mfg = null,
      exp_date = null,
      packing = null,
      packing_tp = null,
      packing_rp = null,
    } = updateDto ?? {}; // Use empty object if updateDto is undefined
  
    // 1. Check product exists
    const product = await this.dataSource.query(
      `SELECT * FROM product WHERE product_code = $1 AND shop_id = $2`,
      [product_code, shop_id],
    );
    if (!product.length) throw new NotFoundException('Product not found');
  
    // 2. Update product
    await this.dataSource.query(
      `UPDATE product SET 
        product_name = $1,
        category_id = $2,
        unit_tp = $3,
        unit_rp = $4,
        total_pack = $5,
        qty_pr_pack = $6,
        ro_level = $7,
        batch = $8,
        mfg = $9,
        exp_date = $10,
        packing = $11,
        packing_tp = $12,
        packing_rp = $13
      WHERE product_code = $14 AND shop_id = $15`,
      [
        product_name,  // Optional fields can be null if not provided
        category_id,
        unit_tp,
        unit_rp,
        total_pack,
        qty_pr_pack,
        ro_level,
        batch,
        mfg,
        exp_date,
        packing,
        packing_tp,
        packing_rp,
        product_code,
        shop_id,
      ],
    );
  
    // 3. Return the updated product
    const updated = await this.dataSource.query(
      `SELECT * FROM product WHERE product_code = $1 AND shop_id = $2`,
      [product_code, shop_id],
    );
  
    return updated[0];
  }
  

  // ✅ Soft delete product
  async softDeleteProduct(
    shop_id: number,
    product_code: string,
  ): Promise<Product> {
    const product = await this.dataSource.query(
      `SELECT * FROM product WHERE product_code = $1 AND shop_id = $2`,
      [product_code, shop_id],
    );
    if (!product.length) throw new NotFoundException('Product not found');

    await this.dataSource.query(
      `UPDATE product SET del_product = TRUE WHERE product_code = $1 AND shop_id = $2`,
      [product_code, shop_id],
    );

    const updated = await this.dataSource.query(
      `SELECT * FROM product WHERE product_code = $1 AND shop_id = $2`,
      [product_code, shop_id],
    );

    return updated[0];
  }
}
