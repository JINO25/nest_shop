/* eslint-disable prettier/prettier */
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("password_reset", { schema: "public" })
export class PasswordReset {
  @PrimaryGeneratedColumn({ type: "integer", name: "id" })
  id: number;

  @Column("character varying", { name: "email", length: 255 })
  email: string;

  @Column("timestamp without time zone", { name: "expires" })
  expires: Date;

  @Column("character varying", { name: "token", length: 255 })
  token: string;
}
