import { Server, Socket } from "socket.io";
import { Connection } from "typeorm";
import { RoomSocket } from "./room-socket";
import { MessageSocket } from "./message-socket";
import { UserSocket } from "./user-socket";
import { GroupSockets } from "./group-socket";
import { ImageSocket } from "./image-socket";


var server = (io: Server/*, connection: Connection*/) => {

    const rs = new RoomSocket(io/*, connection*/); // setting up functionality of rooms
    const ms = new MessageSocket(io, rs/*, connection*/); // setting up functionality of messages
    const us = new UserSocket(io/*, connection*/); // setting up functionality of user connections
    const gs = new GroupSockets(io, rs, us/*, connection*/); // setting up functionality of groups
    const is = new ImageSocket(io/*, connection*/); // setting up functonality of image connections

    io.on('connection', (socket: Socket) => { // user connects

        console.log("User with id " + socket.id + " joined")
        
        // socket.on('whiteboard-draw', (actions: { x: number, y: number, size: number, color: {r: string, g: string, b: string}}) => {
        //     io.emit('whiteboard-update', actions)
        // })

        /* Room socket management */
        rs.setupEvents(socket); // making listeners for recieving room events
        
        /* message socket management */
        ms.setupEvents(socket); // making listeners for recieving chat message events
        
        /* user/account socket management */
        us.setupEvents(socket); // making listeners for recieving user account events

        /* group socket management */
        gs.setupEvents(socket); // making listeners for recieving group events

        /* image socket management */
        is.setupEvents(socket); // making listeners for recieving image events

        socket.on('disconnect', async (reason) => {
            console.log(`User with id ${socket.id} has disconnected with reason: ${reason}`);
        })
    })
}

export { server };