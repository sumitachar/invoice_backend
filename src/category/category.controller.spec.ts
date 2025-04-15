import { Controller, Get, Post, Patch, Delete, Param, Body, NotFoundException } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CreateCategoryDto, UpdateCategoryDto } from './dto/category.dto';
import { Category } from './category.entity';

@Controller('categories')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  // Create a new category
  @Post('/create')
  async createCategory(@Body() createCategoryDto: CreateCategoryDto): Promise<Category> {
   
    return this.categoryService.createCategory(createCategoryDto);
  }



}
