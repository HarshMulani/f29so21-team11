import { Server, Socket } from "socket.io";
import { crudtemplate } from "./crud-template";
import { v4 as uuidv4 } from 'uuid';
import { EventTypes } from "./event-types";
import { WhiteBoardRoom } from "../models/WhiteboardRoom";
import { RoomSocket } from "./room-socket";
import { WhiteBoardAction } from "../models/WhiteBoardAction";
import { createCanvas } from "canvas";
import { Connection } from "typeorm";
import { UserSocket } from "./user-socket";
import { User } from "../models/User";
import { readFileSync, writeFileSync } from "fs";

export class GroupSockets extends crudtemplate<WhiteBoardRoom> {
    
    private connection: Connection;
    private currentGroups: Array<WhiteBoardRoom> = []
    private roomSocket: RoomSocket;
    private userSocket: UserSocket;

    constructor(io: Server, rs: RoomSocket, us: UserSocket/*, connection: Connection*/) {
        super(io, EventTypes.Group);
        this.roomSocket = rs;
        this.userSocket = us;
        // this.connection = connection;
    }

    setupEvents(socket: Socket) {
        super.setupEvents(socket);
        this.setCanvas(socket);
        this.updateRoom(socket);
    }

    emitUpdate() {
        // console.log(this.currentGroups)
        
        let json = readFileSync("./server/groups.json", 'utf-8')
        let d = JSON.parse(json)
        let keys = Object.keys(d)
        
        let groups: Array<WhiteBoardRoom> = []

        for (let i = 0; i < keys.length; i++) {
            groups.push(d[keys[i]])
        }
        // console.log(groups.length)
        this.io.emit(`${this.name}-list-update`, groups)
    }

    create(socket: Socket) {
        socket.on(`create-${this.name}`, (data: { name: string, manager: string }) => { // create item
        this.makeItem(data);
        
        this.emitUpdate();
    })}

    makeItem(data: { name: string, manager: string }) {
        super.makeItem(/* repository, payload */)
        let id = uuidv4();
        let room = { id: id, type: `room`, name: data.name, manager: data.manager, history: [], participants: [] }
        let canvas = createCanvas(2560, 1440).toDataURL();
        let group = { id: id, name: data.name, manager: data.manager, whiteboard: canvas, chat: room, participants: [] };

        let json = readFileSync("./server/groups.json", 'utf-8')
        let d = JSON.parse(json)
        d[id] = group
        writeFileSync("./server/groups.json", JSON.stringify(d))

        let json2 = readFileSync("./server/rooms.json", 'utf-8')
        let d2 = JSON.parse(json2)
        d2[id] = room
        writeFileSync("./server/rooms.json", JSON.stringify(d2))

        // this.currentGroups.push(group)
        // this.roomSocket.currentRooms.push(room)
    }

    itemExists(id: string): boolean {
        return this.currentGroups.find((group) => group.id == id) ? true : false;
    }

    update(socket: Socket) {
        socket.on(`update-${this.name}`, (actions : WhiteBoardAction) => {
            if (actions.color == undefined) {this.io.emit(`${this.name}-update-${actions.roomId}`, null); return }

            let json = readFileSync("./server/actions.json", 'utf-8')
            let d = JSON.parse(json) 
            if (!d[actions.roomId]) d[actions.roomId] = []
            d[actions.roomId].push(actions)
            writeFileSync("./server/actions.json", JSON.stringify(d))
            
            this.io.emit(`${this.name}-update-${actions.roomId}`, actions)
        })
    }

    setCanvas(socket: Socket) {
        socket.on('update-group-canvas', (data: {canvas: string, RoomId: string}) => {
            if (data.RoomId == undefined) return
            // let curRoom = this.currentGroups.find((room) => room.id == data.RoomId);
            // if (!curRoom) return
            // curRoom.whiteboard = data.canvas;

            let json = readFileSync("./server/groups.json", 'utf-8')
            let d = JSON.parse(json)
            d[data.RoomId].whiteboard = data.canvas;
            writeFileSync("./server/groups.json", JSON.stringify(d))
            
            this.emitUpdate();
        })
    }

    updateRoom(socket: Socket) {
        socket.on('update-group-room', (uRoom: WhiteBoardRoom) => {
            // let index = this.currentGroups.indexOf(this.currentGroups.find(room => room.id == uRoom.id))
            // this.currentGroups[index] = uRoom;

            let json = readFileSync("./server/groups.json", 'utf-8')
            let d = JSON.parse(json)
            d[uRoom.id] = uRoom
            writeFileSync("./server/groups.json", JSON.stringify(d))

            this.emitUpdate()
        })
    }
}