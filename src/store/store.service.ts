import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';

import { CreateStoreDto, UpdateStoreDto } from './dto/store.dto';
import { Store } from './store.entity';
import { User } from 'src/user/user.entity';

@Injectable()
export class StoreService {
  constructor(
    @InjectRepository(Store)
    private readonly storeRepository: Repository<Store>,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    private readonly dataSource: DataSource
  ) {}

  // ✅ CREATE a new store
  async createStore(createStoreDto: CreateStoreDto): Promise<Store> {
    const {
      shop_id,
      store_name,
      address,
      phone_number,
      lock_key,
      login_password,
      admin_password,
    } = createStoreDto;

    const shop = await this.dataSource.query(
      `SELECT * FROM "user" WHERE shop_id = $1`,
      [shop_id]
    );

    if (shop.length === 0) {
      throw new NotFoundException(`Shop with ID ${shop_id} not found`);
    }

    await this.dataSource.query(
      `INSERT INTO store (store_del, store_name, address, phone_number, lock_key, login_password, admin_password, shop_id) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
      [
        false,
        store_name,
        address,
        phone_number,
        lock_key,
        login_password,
        admin_password,
        shop_id,
      ]
    );

    const newStore = await this.dataSource.query(
      `SELECT * FROM store WHERE store_name = $1 AND shop_id = $2`,
      [store_name, shop_id]
    );

    return newStore[0];
  }

  // ✅ READ: Get all stores by shop_id
  async getAllStores(shop_id: number): Promise<Store[]> {
    const stores = await this.dataSource.query(
      `SELECT * FROM store WHERE shop_id = $1 AND store_del = false ORDER BY id ASC`,
      [shop_id]
    );

    if (stores.length === 0) {
      throw new NotFoundException(`No stores found for shop_id ${shop_id}`);
    }

    return stores;
  }

  // ✅ READ: Get paginated stores
  async getStoresWithPagination(shop_id: number, page: number, limit: number): Promise<{ stores: Store[], totalPages: number }> {
    const offset = (page - 1) * limit;

    const stores = await this.dataSource.query(
      `SELECT * FROM store WHERE shop_id = $1 AND store_del = false ORDER BY id ASC LIMIT $2 OFFSET $3`,
      [shop_id, limit, offset]
    );

    const totalCountResult = await this.dataSource.query(
      `SELECT COUNT(*) as total FROM store WHERE shop_id = $1`,
      [shop_id]
    );

    const totalCount = parseInt(totalCountResult[0].total, 10);
    const totalPages = Math.ceil(totalCount / limit);

    return { stores, totalPages };
  }

  // ✅ UPDATE a store
  async updateStore(shop_id: number, store_id: number, updateStoreDto: UpdateStoreDto): Promise<Store> {
    const store = await this.dataSource.query(
      `SELECT * FROM store WHERE id = $1 AND shop_id = $2`,
      [store_id, shop_id]
    );

    if (!store.length) {
      throw new NotFoundException(`Store with ID ${store_id} not found in shop ${shop_id}`);
    }

    const fields = Object.entries(updateStoreDto);
    if (fields.length === 0) {
      throw new Error('No fields provided to update.');
    }

    const setClause = fields.map(([key], index) => `${key} = $${index + 1}`).join(', ');
    const values = fields.map(([, value]) => value);

    await this.dataSource.query(
      `UPDATE store SET ${setClause} WHERE id = $${fields.length + 1} AND shop_id = $${fields.length + 2}`,
      [...values, store_id, shop_id]
    );

    const updatedStore = await this.dataSource.query(
      `SELECT * FROM store WHERE id = $1`,
      [store_id]
    );

    return updatedStore[0];
  }

  // ✅ SOFT DELETE a store
  async softDeleteStore(store_id: number,shop_id:number): Promise<Store> {
    const store = await this.dataSource.query(
      `SELECT * FROM store WHERE id = $1 and shop_id= $2`,
      [store_id,shop_id]
    );

    if (store.length === 0) {
      throw new NotFoundException(`Store with ID ${store_id} not found`);
    }

    await this.dataSource.query(
      `UPDATE store SET store_del = TRUE WHERE id = $1 and shop_id = $2`,
      [store_id,shop_id]
    );

    const updated = await this.dataSource.query(
      `SELECT * FROM store WHERE id = $1 and shop_id = $2`,
      [store_id,shop_id]
    );

    return updated[0];
  }
}
