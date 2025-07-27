/* eslint-disable prettier/prettier */
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { CartItem } from "./CartItem.entity";
import { OrderDetail } from "./OrderDetail.entity";
import { Product } from "./Product.entity";

@Entity("product_variant", { schema: "public" })
export class ProductVariant {
  @PrimaryGeneratedColumn({ type: "integer", name: "id" })
  id: number;

  @Column("character varying", {
    name: "option",
    nullable: true,
    length: 45,
  })
  option: string | null;

  @Column("character varying", {
    name: "color",
    nullable: true,
    length: 45,
  })
  color: string | null;

  @Column("double precision", { name: "price", nullable: false })
  price: number;

  @Column("integer", { name: "stock", nullable: false })
  stock: number;

  @Column("integer", { name: "Product_id" })
  productId: number;

  @OneToMany(() => CartItem, (cartItem) => cartItem.productVariant)
  cartItems: CartItem[];

  @OneToMany(() => OrderDetail, (orderDetail) => orderDetail.productVariant)
  orderDetails: OrderDetail[];

  @ManyToOne(() => Product, (product) => product.productVariants, { onDelete: "CASCADE" })
  @JoinColumn([{ name: "Product_id", referencedColumnName: "id" }])
  product: Product;
}
