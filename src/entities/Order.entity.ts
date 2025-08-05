/* eslint-disable prettier/prettier */
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Bill } from "./Bill.entity";
import { User } from "./User.entity";
import { OrderDetail } from "./OrderDetail.entity";

@Entity("order", { schema: "public" })
export class Order {
  @PrimaryGeneratedColumn({ type: "integer", name: "id" })
  id: number;

  @Column("date", { name: "order_date", nullable: true })
  orderDate: Date;

  @Column("character varying", {
    name: "status",
    length: 20,
  })
  status: string;

  @Column("integer", { name: "User_id" })
  userId: number;

  @OneToOne(() => Bill, (bill) => bill.order)
  bill: Bill;

  @ManyToOne(() => User, (user) => user.orders, { onDelete: "CASCADE" })
  @JoinColumn([{ name: "User_id", referencedColumnName: "id" }])
  user: User;

  @OneToMany(() => OrderDetail, (orderDetail) => orderDetail.order, {
    eager: true
  })
  orderDetails: OrderDetail[];
}
