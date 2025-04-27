import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    OneToMany,
    JoinColumn,
    Unique,
  } from 'typeorm';
  import { User } from 'src/user/user.entity';
  import { Product } from 'src/product/product.entity';
  
  @Entity()
  @Unique(['shop', 'store_name']) // Ensures store_name is unique per shop
  export class Store {
    @PrimaryGeneratedColumn()
    id: number;
  
    @Column()
    store_del: boolean;
  
    @Column()
    store_name: string;
  
    @Column({ nullable: true })
    address: string;
  
    @Column({ nullable: true })
    phone_number: string;
  
    @Column({ nullable: true })
    lock_key: string;
  
    @Column({ nullable: true })
    login_password: string;
  
    @Column({ nullable: true })
    admin_password: string;
  
    // 🔗 Relation to User (Shop)
    @ManyToOne(() => User, (user) => user.stores, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'shop_id', referencedColumnName: 'shop_id' })
    shop: User;
  
    // 🔗 One-to-Many relation with Product
    @OneToMany(() => Product, (product) => product.store)
    products: Product[];
  }
  