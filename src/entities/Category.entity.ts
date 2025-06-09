/* eslint-disable prettier/prettier */
import {
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Product } from "./Product.entity";

@Entity("category", { schema: "public" })
export class Category {
  @PrimaryGeneratedColumn({ type: "integer", name: "id" })
  id: number;

  @Column("character varying", {
    name: "name",
    nullable: true,
    length: 45,
  })
  name: string | null;

  @OneToMany(() => Product, (product) => product.category)
  products: Product[];
}
