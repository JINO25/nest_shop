/* eslint-disable prettier/prettier */
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Image } from "./Image.entity";
import { Category } from "./Category.entity";
import { User } from "./User.entity";
import { ProductVariant } from "./ProductVariant.entity";

@Entity("product", { schema: "public" })
export class Product {
  @PrimaryGeneratedColumn({ type: "integer", name: "id" })
  id: number;

  @Column("character varying", {
    name: "name",
    nullable: false,
    length: 255,
  })
  name: string;

  @Column("character varying", {
    name: "description",
    nullable: true,
    length: 255,
  })
  description: string | null;

  @Column("integer", { name: "User_id" })
  userId: number;

  @Column("integer", { name: "Category_id" })
  categoryId: number;

  @OneToMany(() => Image, (image) => image.product, { onDelete: "CASCADE" })
  images: Image[];

  @ManyToOne(() => Category, (category) => category.products)
  @JoinColumn([{ name: "Category_id", referencedColumnName: "id" }])
  category: Category;

  @ManyToOne(() => User, (user) => user.products, { onDelete: 'CASCADE' })
  @JoinColumn([{ name: "User_id", referencedColumnName: "id" }])
  user: User;

  @OneToMany(() => ProductVariant, (productVariant) => productVariant.product, { onDelete: "CASCADE" })
  productVariants: ProductVariant[];
}
