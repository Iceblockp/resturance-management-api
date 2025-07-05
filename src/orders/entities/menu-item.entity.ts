import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import { OrderItem } from "./order-item.entity";
import { Category } from "./category.entity";

@Entity("menu_items")
export class MenuItem {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  name: string;

  @Column("text")
  description: string;

  @Column("decimal", { precision: 10, scale: 2 })
  price: number;

  // Remove the simple string category
  // @Column()
  // category: string;

  // Add ManyToOne relationship with Category
  @ManyToOne(() => Category, (category) => category.menuItems)
  @JoinColumn({ name: "categoryId" })
  category: Category;

  @Column()
  categoryId: string;

  @Column({ default: true })
  isAvailable: boolean;

  @Column({ default: 0 })
  preparationTime: number; // in minutes

  @Column({ nullable: true })
  image: string;

  @Column("simple-array", { nullable: true })
  allergens: string[];

  @Column("simple-array", { nullable: true })
  ingredients: string[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => OrderItem, (orderItem) => orderItem.menuItem)
  orderItems: OrderItem[];
}
