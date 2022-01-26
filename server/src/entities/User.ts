import { Entity, Column, PrimaryColumn, Generated } from 'typeorm';

@Entity()
export class User {

    @Column({ length: 40 })
    ID: string;

    @PrimaryColumn({ length: 25 })
    Username: string;

    @Column({ length: 100 })
    Password: string;

    @Column({ length: 50, nullable: true, })
    Email: string;
}