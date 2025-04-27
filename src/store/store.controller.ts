import {
    Controller,
    Post,
    Get,
    Patch,
    Query,
    Body,
    BadRequestException,
  } from '@nestjs/common';
  import { StoreService } from './store.service';
  import { CreateStoreDto, UpdateStoreDto } from './dto/store.dto';
  import { Store } from './store.entity';
  
  @Controller('stores')
  export class StoreController {
    constructor(private readonly storeService: StoreService) {}
  
    // ✅ Create Store
    @Post('/create')
    async createStore(@Body() createStoreDto: CreateStoreDto) {
      return this.storeService.createStore(createStoreDto);
    }
  
    // ✅ Get Stores With Pagination (shop_id in body, page+limit in query)
    @Post('/list')
    async getStoresWithPagination(
      @Body('shop_id') shop_id: number,
      @Query('page') page = 1,
      @Query('limit') limit = 10,
    ): Promise<{ stores: Store[]; totalPages: number }> {
      if (!shop_id) throw new BadRequestException('shop_id is required');
      return this.storeService.getStoresWithPagination(shop_id, page, limit);
    }
  
    // ✅ Get All Stores by User ID
    @Post('/all_list')
    async getAllStores(@Body('user_id') user_id: number): Promise<{ stores: Store[] }> {
      if (!user_id) throw new BadRequestException('user_id is required');
      const stores = await this.storeService.getAllStores(user_id);
      return { stores };
    }
  
    // ✅ Update Store (store_id in query, user_id in body)
    @Patch('/update')
    async updateStore(
      @Query('store_id') store_id: number,
      @Body() body: UpdateStoreDto & { shop_id: number },
    ) {
      const { shop_id } = body;
      if (!shop_id || !store_id) {
        throw new BadRequestException('shop_id and store_id are required');
      }
  
      return this.storeService.updateStore(shop_id, store_id, body);
    }
  
    // ✅ Soft Delete Store (store_id in query)
    @Patch('/delete')
    async softDeleteStore(
        @Query('store_id') store_id: number,
        @Body('shop_id') shop_id: number,) {
      if (!store_id || !shop_id) {
        throw new BadRequestException('shop_id and store_id are required');
      }
  
      return this.storeService.softDeleteStore(store_id,shop_id);
    }
  }
  