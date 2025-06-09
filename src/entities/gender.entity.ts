/* eslint-disable prettier/prettier */

import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Gender {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string
}