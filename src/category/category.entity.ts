import { Product } from 'src/product/product.entity';
import { Supplier } from 'src/supplier/supplier.entity';
import { User } from 'src/user/user.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  JoinColumn,
  Unique,
} from 'typeorm';

@Entity()
@Unique(['shop', 'category_name']) // ensures category_name is unique per shop
export class Category {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true }) // Optional custom ID if needed
  category_id: number;

  @Column()
  cat_del: boolean;

  @Column()
  category_name: string;

  @Column({ nullable: true })
  description: string;

  // 🔗 Relation to User (Shop)
  @ManyToOne(() => User, (user) => user.categories, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'shop_id', referencedColumnName: 'shop_id' })
  shop: User;

  // 🔗 One-to-Many relation with Product
  @OneToMany(() => Product, (product) => product.category)
  products: Product[];

  // 🔗 One-to-Many relation with Supplier
  @OneToMany(() => Supplier, (supplier) => supplier.category)
  suppliers: Supplier[];
}
