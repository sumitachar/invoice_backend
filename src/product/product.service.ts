import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './product.entity';

import { CreateProductDto, UpdateProductDto } from './dto/product.dto';
import { Category } from 'src/category/category.entity';
import { User } from 'src/user/user.entity';

@Injectable()
export class ProductService {
    constructor(
        @InjectRepository(Product)
        private readonly productRepository: Repository<Product>, // Inject ProductRepository
        @InjectRepository(Category)
        private readonly categoryRepository: Repository<Category>, // Inject CategoryRepository
        @InjectRepository(User)
        private readonly userRepository: Repository<User>, // Inject UserRepository
      )  {}

  // Create a new product
  async createProduct(createProductDto: CreateProductDto): Promise<Product> {
    const { shop_id, category_id, name, price, description } = createProductDto;

    // Check if the shop exists
    const shop = await this.userRepository.findOne({ where: { shop_id } });
    if (!shop) {
      throw new NotFoundException(`Shop with ID ${shop_id} not found`);
    }

    // Check if the category exists for the shop
    // const category = await this.categoryRepository.findOne({ where: { shop_id, id: category_id } });
    // if (!category) {
    //   throw new NotFoundException(`Category with ID ${category_id} not found for this shop`);
    // }

    // Create a product and save it
    const product = this.productRepository.create({
      shop,
      name,
      price,
      description,
      shop_id,
      // category_id,
    });

    return this.productRepository.save(product);
  }

  // Get all products by shop_id and category_id
  async getProductsByShopAndCategory(shop_id: number, category_id: number): Promise<Product[]> {
    const products = await this.productRepository.find({
      where: { shop_id, category_id },
      relations: ['shop'],
    });

    if (!products || products.length === 0) {
      throw new NotFoundException(`No products found for Shop ID ${shop_id} and Category ID ${category_id}`);
    }

    return products;
  }

  // Get a single product by its ID
  async getProductById(id: number): Promise<Product> {
    const product = await this.productRepository.findOne({
      relations: ['shop'],
    });

    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }

    return product;
  }

  // Update product details
  async updateProduct(id: number, updateProductDto: UpdateProductDto): Promise<Product> {
    const product = await this.getProductById(id);

    // Merge the updates into the product
    Object.assign(product, updateProductDto);

    return this.productRepository.save(product);
  }

  // Soft delete (set product as deleted)
  async softDeleteProduct(id: number): Promise<Product> {
    const product = await this.getProductById(id);
    product.description = 'This product has been deleted'; // Optional: Adding a 'deleted' flag or status
    return this.productRepository.save(product);
  }

  // Hard delete (permanent removal)
  async hardDeleteProduct(id: number): Promise<void> {
    const result = await this.productRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }
  }
}
