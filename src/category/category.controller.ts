import { Controller, Post, Get, Patch, Query, Body, BadRequestException } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CreateCategoryDto, UpdateCategoryDto } from './dto/category.dto';
import { Category } from './category.entity';

@Controller('categories')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) { }

  // ✅ Create
  @Post('/create')
  async createCategory(@Body() createCategoryDto: CreateCategoryDto) {
    return this.categoryService.createCategory(createCategoryDto);
  }

  // ✅ List — shop_id in body, page+limit in query
  @Post('/list')
  async getCategoriesWithPagination(
    @Body('shop_id') shop_id: number,
    @Query('page') page = 1,
    @Query('limit') limit = 10,
  ): Promise<{ categories: Category[]; totalPages: number }> {
    if (!shop_id) throw new BadRequestException("shop_id is required");
    return this.categoryService.getCategoriesWithPagination(shop_id, page, limit);
  }
  // ✅ List — shop_id in body, page+limit in query
  @Post('/all_list')
  async getAllCategories(
    @Body('shop_id') shop_id: number,
  ): Promise<{ categories: Category[] }> {
    if (!shop_id) throw new BadRequestException("shop_id is required");
    const categories = await this.categoryService.getAllCategories(shop_id);
    return { categories };
  }


  // ✅ Update — shop_id in body, category_id in query
  @Patch('/update')
  async updateCategory(
    @Query('category_id') category_id: number,
    @Body() body: UpdateCategoryDto & { shop_id: number }
  ) {
    const { shop_id } = body;
    if (!shop_id || !category_id) {
      throw new BadRequestException("shop_id and category_id are required");
    }

    return this.categoryService.updateCategory(shop_id, category_id, body);
  }

  // ✅ Soft delete — shop_id in body, id in query
  @Patch('/shopDelete')
  async softDeleteCategory(
    @Query('id') id: number
  ) {
    if (!id) {
      throw new BadRequestException("shop_id and id are required");
    }

    return this.categoryService.softDeleteCategory(id);
  }
}
