/* eslint-disable prettier/prettier */
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { User } from "./User.entity";

@Entity("address", { schema: "public" })
export class Address {
  @PrimaryGeneratedColumn({ type: "bigint", name: "id" })
  id: number;

  @Column("character varying", {
    name: "city",
    nullable: true,
    length: 255,
  })
  city: string | null;

  @Column("character varying", {
    name: "country",
    nullable: true,
    length: 255,
  })
  country: string | null;

  @Column("character varying", {
    name: "phone_number",
    nullable: true,
    length: 255,
  })
  phoneNumber: string | null;

  @Column("character varying", {
    name: "street",
    nullable: true,
    length: 255,
  })
  street: string | null;

  @Column("integer", { name: "user_id", nullable: true })
  userId: number | null;

  @ManyToOne(() => User, (user) => user.addresses, { onDelete: "CASCADE" })
  @JoinColumn([{ name: "user_id", referencedColumnName: "id" }])
  user: User;
}