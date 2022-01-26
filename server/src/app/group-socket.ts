import { Server, Socket } from "socket.io";
import { crudtemplate } from "./crud-template";
import { v4 as uuidv4 } from 'uuid';
import { EventTypes } from "./event-types";
import { WhiteBoardRoom } from "../models/WhiteboardRoom";
import { RoomSocket } from "./room-socket";
import { WhiteBoardAction } from "../models/WhiteBoardAction";
import { createCanvas } from "canvas";

export class GroupSockets extends crudtemplate<WhiteBoardRoom> {
    
    currentGroups: Array<WhiteBoardRoom> = []
    roomSocket: RoomSocket;

    constructor(io: Server, rs: RoomSocket) {
        super(io, EventTypes.Group);
        this.roomSocket = rs;
    }

    setupEvents(socket: Socket) {
        super.setupEvents(socket);
        this.setCanvas(socket);
    }

    emitUpdate() {
        // console.log(this.currentGroups)
        this.io.emit(`${this.name}-list-update`, this.currentGroups)
    }

    makeItem() {
        super.makeItem(/* repository, payload */)
        let roomId = uuidv4();
        let room = {id: roomId, type: `${this.name}`, name: 'name', history: []}
        let canvas = createCanvas(2560, 1440).toDataURL();
        this.currentGroups.push({id: roomId, name: 'name', whiteboard: canvas, chat: room})
        this.roomSocket.currentRooms.push(room)
    }

    itemExists(id: string): boolean {
        return this.currentGroups.find((group) => group.id == id) ? true : false;
    }

    update(socket: Socket) {
        socket.on(`update-${this.name}`, (actions : WhiteBoardAction) => {
            if (actions.color == undefined) {this.io.emit(`${this.name}-update-${actions.roomId}`, null); return }
            this.io.emit(`${this.name}-update-${actions.roomId}`, actions)
        })
    }

    setCanvas(socket: Socket) {
        socket.on('update-group-canvas', ({canvas: can, RoomId: id}) => {
            if (id == undefined) return
            let curRoom = this.currentGroups.find((room) => room.id == id);
            curRoom.whiteboard = can;
            this.emitUpdate();
        })
    }
}