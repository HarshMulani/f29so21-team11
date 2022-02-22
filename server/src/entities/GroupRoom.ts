import { Column, Entity, JoinColumn, OneToOne, PrimaryColumn } from "typeorm";
import { Message } from "./Message";

@Entity()
export class ChatRoom {
    
    @PrimaryColumn({ length: 40 })
    id: string;

    @Column({ length: 10 })
    type: string;
    
    @Column({ length: 10})
    name: string;

    @Column({ length: 512})
    whiteboard: string;

    @OneToOne(() => ChatRoom, room => room.id)
    @JoinColumn()
    chat: ChatRoom;

}
/*
    id: string;
    name: string;
    whiteboard: string;
    chat: Room;
*/