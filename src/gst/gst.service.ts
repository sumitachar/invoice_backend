import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Gst } from './gst.entity';
import { Category } from 'src/category/category.entity';
import { User } from 'src/user/user.entity';
import { CreateGstDto, UpdateGstDto } from './dto/gst.dto';



@Injectable()
export class GstService {
  constructor(
    @InjectRepository(Gst)
    private readonly gstRepository: Repository<Gst>,
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly dataSource: DataSource // Injecting DataSource for raw SQL queries
  ) {}

  // Create a new GST entry using raw SQL
  async createGst(createGstDto: CreateGstDto): Promise<Gst> {
    const { category_id, shop_id, SGST, CGST, IGST } = createGstDto;

    // Check if the category exists
    const category = await this.dataSource.query(
      `SELECT * FROM category WHERE id = $1`,
      [category_id]
    );
    if (category.length === 0) {
      throw new NotFoundException(`Category with ID ${category_id} not found`);
    }

    // Check if the shop exists
    const shop = await this.dataSource.query(
      `SELECT * FROM "user" WHERE shop_id = $1`,
      [shop_id]
    );
    if (shop.length === 0) {
      throw new NotFoundException(`Shop with ID ${shop_id} not found`);
    }

    // Insert GST entry
    await this.dataSource.query(
      `INSERT INTO gst (SGST, CGST, IGST, category_id, shop_id) VALUES ($1, $2, $3, $4, $5)`,
      [SGST, CGST, IGST, category_id, shop_id]
    );

    // Return the newly created GST entry
    const newGst = await this.dataSource.query(
      `SELECT * FROM gst WHERE category_id = $1 AND shop_id = $2`,
      [category_id, shop_id]
    );
    return newGst[0];
  }

// In GstService
async getGstsByShop(
    shop_id: number,
    page: number = 1,
    limit: number = 10
  ): Promise<{ gsts: Gst[]; totalPages: number }> {
    const offset = (page - 1) * limit;
  
    const [gsts, total] = await this.dataSource.query(
      `SELECT * FROM gst WHERE shop_id = $1 LIMIT $2 OFFSET $3`,
      [shop_id, limit, offset]
    );
  
    const totalPages = Math.ceil(total.length / limit);
  
    if (gsts.length === 0) {
      throw new NotFoundException(`No GST entries found for shop ID ${shop_id}`);
    }
  
    return { gsts, totalPages };
  }
  

  // Get a single GST entry by category ID and shop ID using raw SQL
  async getGstByCategoryAndShop(
    category_id: number,
    shop_id: number
  ): Promise<Gst> {
    const gst = await this.dataSource.query(
      `SELECT * FROM gst WHERE category_id = $1 AND shop_id = $2`,
      [category_id, shop_id]
    );

    if (gst.length === 0) {
      throw new NotFoundException(
        `No GST entry found for category ID ${category_id} and shop ID ${shop_id}`
      );
    }

    return gst[0];
  }

  // Update an existing GST entry using raw SQL
  async updateGst(
    category_id: number,
    shop_id: number,
    updateGstDto: UpdateGstDto
  ): Promise<Gst> {
    const { SGST, CGST, IGST } = updateGstDto;

    // Check if the GST entry exists
    const gst = await this.dataSource.query(
      `SELECT * FROM gst WHERE category_id = $1 AND shop_id = $2`,
      [category_id, shop_id]
    );

    if (gst.length === 0) {
      throw new NotFoundException(
        `No GST entry found for category ID ${category_id} and shop ID ${shop_id}`
      );
    }

    // Update the GST entry
    await this.dataSource.query(
      `UPDATE gst SET SGST = $1, CGST = $2, IGST = $3 WHERE category_id = $4 AND shop_id = $5`,
      [SGST, CGST, IGST, category_id, shop_id]
    );

    // Return the updated GST entry
    const updatedGst = await this.dataSource.query(
      `SELECT * FROM gst WHERE category_id = $1 AND shop_id = $2`,
      [category_id, shop_id]
    );
    return updatedGst[0];
  }

  // Soft delete (set `cat_del = true`) using raw SQL
  async softDeleteGst(id: number): Promise<Gst> {
    const gst = await this.dataSource.query(
      `SELECT * FROM gst WHERE id = $1`,
      [id]
    );

    if (gst.length === 0) {
      throw new NotFoundException(`GST entry with ID ${id} not found`);
    }

    // Perform soft delete
    await this.dataSource.query(
      `UPDATE gst SET cat_del = TRUE WHERE id = $1`,
      [id]
    );

    // Return updated GST entry
    const updatedGst = await this.dataSource.query(
      `SELECT * FROM gst WHERE id = $1`,
      [id]
    );

    return updatedGst[0];
  }

  // Hard delete (permanent removal) using raw SQL
  async hardDeleteGst(id: number): Promise<void> {
    const gst = await this.dataSource.query(
      `SELECT * FROM gst WHERE id = $1`,
      [id]
    );

    if (gst.length === 0) {
      throw new NotFoundException(`GST entry with ID ${id} not found`);
    }

    // Perform hard delete
    await this.dataSource.query(
      `DELETE FROM gst WHERE id = $1`,
      [id]
    );
  }
}
