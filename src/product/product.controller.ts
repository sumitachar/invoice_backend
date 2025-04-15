import { Controller, Post, Body, Get, Param, Put, Delete, Query } from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto, UpdateProductDto } from './dto/product.dto';
import { Product } from './product.entity';

@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  // Create a new product
  @Post()
  async createProduct(@Body() createProductDto: CreateProductDto): Promise<Product> {
    return this.productService.createProduct(createProductDto);
  }

  // Get all products by shop_id and category_id
  @Get('shop/:shop_id/category/:category_id')
  async getProductsByShopAndCategory(
    @Param('shop_id') shop_id: number,
    @Param('category_id') category_id: number,
  ): Promise<Product[]> {
    return this.productService.getProductsByShopAndCategory(shop_id, category_id);
  }

  // Get a single product by its ID
  @Get(':id')
  async getProductById(@Param('id') id: number): Promise<Product> {
    return this.productService.getProductById(id);
  }

  // Update product details
  @Put(':id')
  async updateProduct(
    @Param('id') id: number,
    @Body() updateProductDto: UpdateProductDto,
  ): Promise<Product> {
    return this.productService.updateProduct(id, updateProductDto);
  }

  // Soft delete a product
  @Put(':id/soft-delete')
  async softDeleteProduct(@Param('id') id: number): Promise<Product> {
    return this.productService.softDeleteProduct(id);
  }

  // Hard delete a product
  @Delete(':id')
  async hardDeleteProduct(@Param('id') id: number): Promise<void> {
    return this.productService.hardDeleteProduct(id);
  }
}
