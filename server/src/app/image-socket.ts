import { Server, Socket } from "socket.io";
import { Connection } from "typeorm";
import { crudtemplate } from "./crud-template";
import { EventTypes } from "./event-types";

export class ImageSocket extends crudtemplate<any> {

    private connection : Connection;
    private pictures : Array<{id: string, uploadTime: Date, link: string}> = []

    constructor(io: Server, connection: Connection) {
        super(io, EventTypes.Image)
        this.connection = connection;
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