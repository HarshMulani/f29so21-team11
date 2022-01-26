import { Server, Socket } from "socket.io";
import { crudtemplate } from "./crud-template";
import { EventTypes } from "./event-types";

export class ImageSocket extends crudtemplate<any> {

    pictures : Array<{id: string, uploadTime: Date, link: string}> = []

    constructor(io: Server) {
        super(io, EventTypes.Image)
    }

    setupEvents(socket: Socket) {
        super.setupEvents(socket)
    }

    emitUpdate(): void {
        this.io.emit('', null)
    }

    makeItem(): void {
        
    }

    itemExists(id: string): boolean {

        return this.pictures.find((pic) => pic.id == id)? true: false;
    }
}