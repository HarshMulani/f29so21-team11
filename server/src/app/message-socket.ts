import { Server } from "socket.io";
import { Message } from "../models/Message";
import { crudtemplate } from "./crud-template";
import { EventTypes } from "./event-types";
import { RoomSocket } from "./room-socket";
import { v4 as uuidv4 } from 'uuid';
import { Connection } from "typeorm";


export class MessageSocket extends crudtemplate<Message> {
    
    private connection: Connection;
    private roomSocket: RoomSocket; // link to RoomSocket

    constructor(io: Server, rs: RoomSocket/*, connection: Connection*/) {
        super(io, EventTypes.Message);
        this.roomSocket = rs;
        // this.connection = connection;
    }

    emitUpdate({socket, id}) { // Updates list of messages
        socket.on(id, (msg: Message) => {
            this.makeItem(msg); // Creates new message 
            this.io.emit(`${this.name}-update-${id}`, msg) // emitting new message
        })
    }

    makeItem(payload : Message) { // Create new message
        payload.id = uuidv4(); // sets message id
        let currRoom = this.roomSocket.currentRooms.find((room) => room.id == payload.roomid) // finds current room
        currRoom.history.push(payload); // adds message to current room
    }
}