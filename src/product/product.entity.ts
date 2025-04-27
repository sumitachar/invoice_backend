import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, Unique } from 'typeorm';
import { User } from 'src/user/user.entity';
import { Category } from 'src/category/category.entity';
import { Store } from 'src/store/store.entity';

@Entity('product')
@Unique(['shop', 'product_code']) 
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  product_code: string;

  @Column({ nullable: true })
  category_name: string;

  @Column({ nullable: true })
  product_name: string;

  @Column({ type: 'int', nullable: true })
  total_pack: number;

  @Column({ type: 'int', nullable: true })
  qty_pr_pack: number;

  @Column({ type: 'int', nullable: true })
  ro_level: number;

  @Column({ nullable: true })
  batch: string;

  @Column({ type: 'date', nullable: true })
  mfg: Date;

  @Column({ type: 'date', nullable: true })
  exp_date: Date;

  @Column({ type: 'float', nullable: true })
  packing: number;

  @Column({ type: 'float', nullable: true })
  packing_tp: number;

  @Column({ type: 'float', nullable: true })
  packing_rp: number;

  @Column({ type: 'float', nullable: true })
  unit_tp: number;

  @Column({ type: 'float', nullable: true })
  unit_rp: number;

  @Column({ nullable: true })
  unit_stock: number;

  @Column({ type: 'boolean', default: false }) 
  del_product: boolean;

  @ManyToOne(() => User, (user) => user.products, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'shop_id', referencedColumnName: 'shop_id' })
  shop: User;

  @ManyToOne(() => Category, (category) => category.products, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'category_id', referencedColumnName: 'category_id' })
  category: Category;

  @ManyToOne(() => Store, (store) => store.products, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'store_id', referencedColumnName: 'id' })  // Corrected the join column name
  store: Store;  // Reference to the Store entity
}
