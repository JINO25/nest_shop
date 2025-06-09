/* eslint-disable prettier/prettier */
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { User } from "./User.entity";

@Entity("voucher", { schema: "public" })
export class Voucher {
  @PrimaryGeneratedColumn({ type: "integer", name: "id" })
  id: number;

  @Column("character varying", {
    name: "description",
    nullable: true,
    length: 45,
  })
  description: string | null;

  @Column("double precision", {
    name: "discount_value",
    nullable: true
  })
  discountValue: number | null;

  @Column("double precision", {
    name: "min_order_value",
    nullable: true
  })
  minOrderValue: number | null;

  @Column("double precision", {
    name: "max_order_value",
    nullable: true
  })
  maxOrderValue: number | null;

  @Column("date", { name: "start_date", nullable: true })
  startDate: string | null;

  @Column("date", { name: "end_date", nullable: true })
  endDate: string | null;

  @Column("integer", { name: "quantity", nullable: true })
  quantity: number | null;

  @Column("text", { name: "status", nullable: true })
  status: string | null;

  @Column("integer", { name: "User_id" })
  userId: number;

  @ManyToOne(() => User, (user) => user.vouchers)
  @JoinColumn([{ name: "User_id", referencedColumnName: "id" }])
  user: User;
}
