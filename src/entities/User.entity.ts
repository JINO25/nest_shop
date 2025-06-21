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
import { Address } from "./Address.entity";
import { Cart } from "./Cart.entity";
import { Order } from "./Order.entity";
import { Product } from "./Product.entity";
import { Role } from "./Role.entity";
import { Voucher } from "./Voucher.entity";
import { Exclude } from "class-transformer";

@Entity("user", { schema: "public" })
export class User {
  @PrimaryGeneratedColumn({ type: "integer", name: "id" })
  id: number;

  @Column("character varying", { name: "name", length: 45 })
  name: string;

  @Column("character varying", { name: "email", length: 45 })
  email: string;

  @Exclude()
  @Column("character varying", { name: "password", length: 255 })
  password: string;

  @Column("character varying", {
    name: "photo",
    nullable: true,
    length: 255,
  })
  photo: string | null;

  @Column("integer", { name: "Role_id" })
  roleId: number;

  @Column("date", { name: "create_at", nullable: true })
  createAt: Date | null;

  @OneToMany(() => Address, (address) => address.user, { onDelete: "CASCADE" })
  addresses: Address[];

  @OneToOne(() => Cart, (cart) => cart.user, { onDelete: "CASCADE" })
  cart: Cart;

  @OneToMany(() => Order, (order) => order.user, { onDelete: "CASCADE" })
  orders: Order[];

  @OneToMany(() => Product, (product) => product.user, { onDelete: "CASCADE" })
  products: Product[];

  @ManyToOne(() => Role, (role) => role.users)
  @JoinColumn([{ name: "Role_id", referencedColumnName: "id" }])
  role: Role;

  @OneToMany(() => Voucher, (voucher) => voucher.user)
  vouchers: Voucher[];
}
