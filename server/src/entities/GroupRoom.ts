import { Column, Entity, OneToMany, OneToOne, PrimaryColumn } from "typeorm";
import { Message } from "./Message";

@Entity()
export class ChatRoom {
    
    @PrimaryColumn({ length: 40 })
    id: string;

    @Column({ length: 10})
    

    @Column({ length: 512})
    whiteboard: string;

    @OneToOne(type => ChatRoom, room => room.id)
    chat: ChatRoom;

}
/*
    id: string;
    name: string;
    whiteboard: string;
    chat: Room;
*/