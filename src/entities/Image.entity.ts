/* eslint-disable prettier/prettier */
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Product } from "./Product.entity";

@Entity("image", { schema: "public" })
export class Image {
  @PrimaryGeneratedColumn({ type: "integer", name: "id" })
  id: number;

  @Column("character varying", {
    name: "name",
    nullable: true,
    length: 255,
  })
  name: string | null;

  @Column("character varying", { name: "url", length: 255 })
  url: string;

  @Column("character varying", { name: "public_id", length: 255 })
  publicId: string;

  @Column("integer", { name: "product_id" })
  productId: number;

  @ManyToOne(() => Product, (product) => product.images)
  @JoinColumn([{ name: "product_id", referencedColumnName: "id" }])
  product: Product;
}
