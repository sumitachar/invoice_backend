import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn, ManyToOne } from 'typeorm';
import { Category } from 'src/category/category.entity';
import { User } from 'src/user/user.entity';

@Entity()
export class Gst {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('decimal', { precision: 5, scale: 2 })
  SGST: number;

  @Column('decimal', { precision: 5, scale: 2 })
  CGST: number;

  @Column('decimal', { precision: 5, scale: 2 })
  IGST: number;

  // 🔗 One-to-One relation with Category
  @OneToOne(() => Category, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'category_id', referencedColumnName: 'id' })
  category: Category;


  @ManyToOne(() => User, (user) => user.gsts, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'shop_id', referencedColumnName: 'shop_id' })
  shop: User;
}
