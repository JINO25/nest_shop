/* eslint-disable prettier/prettier */
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Cart } from "./Cart.entity";
import { ProductVariant } from "./ProductVariant.entity";

@Entity("cart_item", { schema: "public" })
export class CartItem {
  @PrimaryGeneratedColumn({ type: "integer", name: "id" })
  id: number;

  @Column("integer", { name: "quantity", nullable: false })
  quantity: number;

  @Column("character varying", { name: "status", length: 20 })
  status: string;

  @Column("integer", { name: "cart_id" })
  cartId: number;

  @Column("integer", { name: "product_variant_id" })
  productVariantId: number;

  @ManyToOne(() => Cart, (cart) => cart.cartItems)
  @JoinColumn([{ name: "cart_id", referencedColumnName: "id" }])
  cart: Cart;

  @ManyToOne(() => ProductVariant, (productVariant) => productVariant.cartItems, { onDelete: "CASCADE", eager: true })
  @JoinColumn([{ name: "product_variant_id", referencedColumnName: "id" }])
  productVariant: ProductVariant;
}
