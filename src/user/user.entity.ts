import { Category } from 'src/category/category.entity';
import { Gst } from 'src/gst/gst.entity';
import { Product } from 'src/product/product.entity';
import { Store } from 'src/store/store.entity';
import { Supplier } from 'src/supplier/supplier.entity';
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  shop_id: number; // Unique shop ID for each user

  @Column({ unique: true })
  email: string;

  @Column()
  shop_name: string;

  @Column()
  owner_name: string;

  @Column()
  password: string;

  @Column()
  mobile_number: string;

  @Column({ default: 'inactive' }) // Default subscription status
  subscription_status: string; // Possible: 'active', 'inactive', 'expired'

  @Column({ type: 'date', nullable: true }) // Subscription expiry date
  subscription_expiry: Date | null;

  @OneToMany(() => Category, (category) => category.shop)
  categories: Category[];

  @OneToMany(() => Store, (store) => store.shop)
  stores: Store[];

  @OneToMany(() => Product, (product) => product.shop)
  products: Product[];

  @OneToMany(() => Supplier, (supplier) => supplier.shop)
  suppliers: Supplier[]; // 👈 Add this to establish reverse relation

  @OneToMany(() => Gst, (gst) => gst.shop)
  gsts: Gst;
}
