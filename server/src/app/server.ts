import { Server, Socket } from "socket.io";
import { Connection } from "typeorm";
import { User } from "../entities/User";
import { RoomSocket } from "./room-socket";
import { MessageSocket } from "./message-socket";
import { UserSocket } from "./user-socket";


var server = (io: Server, connection: Connection) => {

    // const ws = new WhiteBoardSocket(io);
    const rs = new RoomSocket(io); // setting up functionality of rooms
    const ms = new MessageSocket(io, rs); // setting up functionality of messages
    const us = new UserSocket(io, connection); // setting up functionality of user connections

    io.on('connection', (socket: Socket) => { // user connects

        console.log("User with id " + socket.id + " joined")
        
        /* Room socket management */
        rs.setupEvents(socket); // making listeners for recieving room events
        
        /* message socket management */
        ms.setupEvents(socket); // making listeners for recieving chat message events
        
        /* user/account socket management */
        us.setupEvents(socket); // making listeners for recieving user account events

        socket.on('disconnect', async (reason) => {
            console.log(`User with id ${socket.id} has disconnected with reason: ${reason}`);
        })
    })
}

export { server };