import { Column, Entity, OneToMany, PrimaryColumn } from "typeorm";
import { Message } from "./Message";

@Entity()
export class ChatRoom {
    
    @PrimaryColumn({ length: 40 })
    id: string;

    @Column({ length: 10})
    type: string;

    @Column({ length: 50})
    name: string;

    @OneToMany(() => Message, msg => msg)
    history: Message[];

}