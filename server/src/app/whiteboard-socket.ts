import { Server, Socket } from "socket.io";
import { crudtemplate } from "./crud-template";
import { EventTypes } from "./event-types";
import { GroupSockets } from "./group-socket";

export class WhiteboardSocket extends crudtemplate<any> {

    private groupSocket: GroupSockets;

    constructor(io: Server, gs: GroupSockets) {
        super(io, EventTypes.Group);
        this.groupSocket = gs;
    }

    setupEvents(socket: Socket) {
        super.setupEvents(socket);
    }

}