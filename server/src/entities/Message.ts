import { Entity, Column, PrimaryColumn, Generated } from 'typeorm';

@Entity()
export class Message {

    @Column({ length: 40 })
    roomID: string;

    @PrimaryColumn({ length: 40 })
    id: string;

    @Column({ length: 256 })
    message: string;

    @Column({ length: 50 })
    sentBy: string;

    @Column()
    timestamp: Date
}