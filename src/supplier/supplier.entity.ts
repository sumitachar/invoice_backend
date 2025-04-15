import { Category } from 'src/category/category.entity';
import { User } from 'src/user/user.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  Unique,
} from 'typeorm';

@Entity()
@Unique(['supplier_id', 'shop']) // 👈 Composite unique constraint
export class Supplier {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true }) // Removed global unique
  supplier_id: string;

  @Column()
  sup_del: boolean;

  @Column()
  supplier_name: string;

  @Column('simple-array', { nullable: true })
  address: string[];

  @Column({ nullable: true })
  country_code: string;

  @Column({ nullable: true })
  mobile: string;

  @Column('simple-array', { nullable: true })
  product: string[];

  @ManyToOne(() => Category, (category) => category.suppliers)
  @JoinColumn({ name: 'category_id', referencedColumnName: 'category_id' })
  category: Category;

  @ManyToOne(() => User, (user) => user.suppliers, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'shop_id', referencedColumnName: 'shop_id' })
  shop: User;
}
