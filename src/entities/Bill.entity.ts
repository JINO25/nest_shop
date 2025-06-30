/* eslint-disable prettier/prettier */
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Order } from "./Order.entity";

@Entity("bill", { schema: "public" })
export class Bill {
  @PrimaryGeneratedColumn({ type: "integer", name: "id" })
  id: number;

  @Column("double precision", { name: "total", nullable: true })
  total: number | null;

  @Column("character varying", {
    name: "method",
    nullable: true,
    length: 45,
  })
  method: string | null;

  @Column("date", { name: "payment_time", nullable: true })
  paymentTime: string | null;

  @Column("date", { name: "bill_date", nullable: true })
  billDate: Date | null;

  @Column("character varying", {
    name: "payment_status",
    nullable: true,
    length: 20,
  })
  paymentStatus: string | null;

  @Column("integer", { name: "Order_id" })
  orderId: number;

  @ManyToOne(() => Order, (order) => order.bills)
  @JoinColumn([{ name: "Order_id", referencedColumnName: "id" }])
  order: Order;
}
