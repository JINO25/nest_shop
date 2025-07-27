/* eslint-disable prettier/prettier */
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Order } from "./Order.entity";
import { ProductVariant } from "./ProductVariant.entity";

@Entity("order_detail", { schema: "public" })
export class OrderDetail {
  @PrimaryGeneratedColumn({ type: "integer", name: "id" })
  id: number;

  @Column("integer", { name: "quantity" })
  quantity: number;

  @Column("double precision", { name: "price", nullable: false })
  price: number;

  @Column("integer", { name: "Order_id" })
  orderId: number;

  @Column("integer", { name: "product_variant_id" })
  productVariantId: number;

  @ManyToOne(() => Order, (order) => order.orderDetails, { onDelete: 'CASCADE' })
  @JoinColumn([{ name: "Order_id", referencedColumnName: "id" }])
  order: Order;

  @ManyToOne(
    () => ProductVariant,
    (productVariant) => productVariant.orderDetails,
    { onDelete: "CASCADE" }
  )
  @JoinColumn([{ name: "product_variant_id", referencedColumnName: "id" }])
  productVariant: ProductVariant;
}
