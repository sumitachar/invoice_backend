import {
  Controller,
  Post,
  Patch,
  Body,
  BadRequestException,
  Query,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto, UpdateProductDto } from './dto/product.dto';
import { Product } from './product.entity';

@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  // ✅ Create Product
  @Post('/create')
  async createProduct(
    @Body('shop_id') shop_id: number,
    @Body() createProductDto: CreateProductDto,
  ) {
    if (!shop_id) {
      throw new BadRequestException('shop_id is required');
    }
    return this.productService.createProduct(shop_id, createProductDto);
  }

  // ✅ List Products by category with Pagination — shop_id in body, page+limit in query
  @Post('/listByCategory')
  async getProductsByCategory(
    @Body('shop_id') shop_id: number,
    @Body('category_id') category_id: number,
  ): Promise<Product[]> {
    if (!shop_id || !category_id) {
      throw new BadRequestException('shop_id and category_id are required');
    }
  
    return this.productService.getProductsByCategory(shop_id, category_id);
  }
  

  @Post('/all_list')
  async getAllProducts(
    @Body('shop_id') shop_id: number,
    @Query('page') page = 1,
    @Query('limit') limit = 10,
  ): Promise<{ products: Product[]; totalPages: number }> {
    if (!shop_id) {
      throw new BadRequestException('shop_id is required');
    }
  
    return this.productService.getAllProductsPaginated(shop_id, +page, +limit);
  }
  

  // ✅ Update Product — shop_id, product_code in body
  @Patch('/update')
  async updateProduct(
    @Body() body: UpdateProductDto & { shop_id: number; product_code: string },
  ) {
    const { shop_id, product_code } = body;

    if (!shop_id || !product_code) {
      throw new BadRequestException('shop_id and product_code are required');
    }

    return this.productService.updateProduct(shop_id, product_code, body);
  }

  // ✅ Soft Delete Product — shop_id and product_code in body
  @Patch('/soft-delete')
  async softDeleteProduct(@Body() body: { shop_id: number; product_code: string }) {
    const { shop_id, product_code } = body;

    if (!product_code || !shop_id) {
      throw new BadRequestException('product_code and shop_id are required');
    }

    return this.productService.softDeleteProduct(shop_id, product_code);
  }
}
