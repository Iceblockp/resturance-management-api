import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";
import { User } from "../../users/entities/user.entity";
import { OrderItem } from "./order-item.entity";
import { OrderStatus } from "../../common/enums/order-status.enum";
import { OrderPriority } from "../../common/enums/order-priority.enum";

@Entity("orders")
export class Order {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  orderNumber: string;

  @Column()
  tableNumber: string;

  @Column({
    type: "enum",
    enum: OrderStatus,
    default: OrderStatus.NEW,
  })
  status: OrderStatus;

  @Column({
    type: "enum",
    enum: OrderPriority,
    default: OrderPriority.NORMAL,
  })
  priority: OrderPriority;

  @Column("decimal", { precision: 10, scale: 2 })
  totalAmount: number;

  @Column("text", { nullable: true })
  notes: string;

  @Column({ nullable: true })
  estimatedReadyTime: Date;

  @Column({ nullable: true })
  actualReadyTime: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => User, (user) => user.orders)
  @JoinColumn({ name: "createdById" })
  createdBy: User;

  @Column()
  createdById: string;

  @OneToMany(() => OrderItem, (orderItem) => orderItem.order, { cascade: true })
  orderItems: OrderItem[];
}
