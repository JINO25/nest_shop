/* eslint-disable prettier/prettier */
import {
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { User } from "./User.entity";

@Entity("role", { schema: "public" })
export class Role {
  @PrimaryGeneratedColumn({ type: "integer", name: "id" })
  id: number;

  @Column("character varying", { name: "role", length: 45 })
  role: string;

  @OneToMany(() => User, (user) => user.role)
  users: User[];
}
