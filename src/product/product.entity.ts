import { User } from 'src/user/user.entity';
import { Category } from 'src/category/category.entity';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, PrimaryColumn } from 'typeorm';

@Entity()
export class Product {
  @PrimaryColumn() // 👈 use this instead of @PrimaryGeneratedColumn()
  shop_id: number;

  @ManyToOne(() => User, (user) => user.products, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'shop_id' })
  shop: User; // Foreign key reference to User (shop)

  @Column()
  category_id: number; // Reference to the category

  @ManyToOne(() => Category, (category) => category.products, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'category_id' })
  category: Category; // Foreign key reference to Category

  @Column()
  name: string;

  @Column({ type: 'decimal' })
  price: number;

  @Column({ nullable: true })
  description: string;
}
