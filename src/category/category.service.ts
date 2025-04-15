import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';

import { CreateCategoryDto, UpdateCategoryDto } from './dto/category.dto';
import { Category } from './category.entity';
import { User } from 'src/user/user.entity';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly dataSource: DataSource // Injecting DataSource for raw SQL queries
  ) { }

  // Create a new category using raw SQL
  async createCategory(createCategoryDto: CreateCategoryDto): Promise<Category> {
    const { category_id, shop_id, category_name, description } = createCategoryDto;

    // Check if shop exists
    const shop = await this.dataSource.query(
      `SELECT * FROM "user" WHERE shop_id = $1`,
      [shop_id]
    );
    // console.log("shop",shop)
    if (shop.length === 0) {
      throw new NotFoundException(`Shop with ID ${shop_id} not found`);
    }

    // Insert category
    await this.dataSource.query(
      `INSERT INTO category (category_id, shop_id, category_name, description, cat_del) VALUES ($1, $2, $3, $4, FALSE)`,
      [category_id, shop_id, category_name, description]
    );

    // Return the newly created category
    const newCategory = await this.dataSource.query(
      `SELECT * FROM category WHERE category_id = $1`,
      [category_id]
    );
    return newCategory[0];
  }


  async getCategoriesWithPagination(shop_id: number, page: number, limit: number): Promise<{ categories: Category[], totalPages: number }> {
    const offset = (page - 1) * limit; // Calculate the starting index
    // console.log("getCategoriesByShopId",shop_id, limit, offset)

    // Fetch paginated categories
    const categories = await this.dataSource.query(
      `SELECT c.id,c.category_id,c.category_name,c.description,c.shop_id 
      FROM category c 
      JOIN "user" u ON c.shop_id = u.shop_id 
      WHERE c.shop_id = $1 
      AND c.cat_del = false
      ORDER BY c.id ASC  
      LIMIT $2 OFFSET $3;
      `,
      [shop_id, limit, offset]
    );
    // console.log("######",categories)

    // Get total count of categories
    const totalCountResult = await this.dataSource.query(
      `SELECT COUNT(*) as total FROM category WHERE shop_id = $1`,
      [shop_id]
    );

    const totalCount = parseInt(totalCountResult[0].total, 10);
    const totalPages = Math.ceil(totalCount / limit);

    // console.log( categories, totalPages)
    return { categories, totalPages };
  }



  // Get a single category by ID using raw SQL
  async getAllCategories(shop_id: number): Promise<Category[]> {
    const categories = await this.dataSource.query(
      `SELECT c.* FROM category c JOIN "user" u ON c.shop_id = u.shop_id WHERE c.shop_id = $1 AND c.cat_del = false`,
      [shop_id]
    );
    
  
    if (categories.length === 0) {
      throw new NotFoundException(`No categories found for shop_id ${shop_id}`);
    }
  
    return categories;
  }
  

  // Update a category using raw SQL
  async updateCategory(shop_id: number, category_id: number, updateCategoryDto: UpdateCategoryDto): Promise<Category> {
    const { category_name, description } = updateCategoryDto;

    // Check if the category exists using shop_id and category_id
    const category = await this.dataSource.query(
        `SELECT * FROM category WHERE category_id = $1 AND shop_id = $2`,
        [category_id, shop_id]
    );

    if (!category.length) {
        throw new Error("Category not found");
    }

    // Update the category
    await this.dataSource.query(
        `UPDATE category 
         SET category_name = $1, description = $2 
         WHERE category_id = $3 AND shop_id = $4`,
        [category_name, description, category_id, shop_id]
    );

    // Return the updated category
    const updatedCategory = await this.dataSource.query(
        `SELECT * FROM category WHERE shop_id = $1 AND cat_del = false ORDER BY category_id ASC;`,
        [shop_id]
    );

    return updatedCategory[0]; // Return the first result as a single object
}


  // Soft delete (set `cat_del = true`) using raw SQL
  async softDeleteCategory(id: number): Promise<Category> {
    try {
      // Get category by ID
      const category = await this.dataSource.query(
        `SELECT * FROM category WHERE id = $1`,
        [id]
      );
  
      if (category.length === 0) {
        throw new Error('Category not found');
      }
  
      // Perform soft delete
      await this.dataSource.query(
        `UPDATE category SET cat_del = TRUE WHERE id = $1`,
        [id]
      );
  
      // Return updated category
      const updatedCategory = await this.dataSource.query(
        `SELECT * FROM category WHERE id = $1`,
        [id]
      );
  
      return updatedCategory[0];
    } catch (error) {
      console.error('Soft delete failed:', error.message || error);
      throw new Error('Failed to soft delete category');
    }
  }
  
  

  // Hard delete (permanent removal) using raw SQL
//   async hardDeleteCategory(shop_id: number): Promise<void> {
//     // Check if the category exists
//     const category = await this.getAllCategories(id);

//     // Delete the category
//     const result = await this.dataSource.query(
//       `DELETE FROM category WHERE id = ?`,
//       [id]
//     );

//     if (result.affected === 0) {
//       throw new NotFoundException(`Category with ID ${id} not found`);
//     }
//   }
}
