import { Server, Socket } from "socket.io";
import { crudtemplate } from "./crud-template";
import { EventTypes } from "./event-types";
import { v4 as uuidv4 } from 'uuid';
import { Room } from "../models/Room";
import { Connection } from "typeorm";
import { readFileSync, writeFileSync } from "fs";


export class RoomSocket extends crudtemplate<Room> {

    private connection: Connection;
    public currentRooms: Array<Room> = []; // list of current rooms on server

    constructor(io: Server/*, connection: Connection*/) {
        super(io, EventTypes.Room);
    }

    setupEvents(socket: Socket) {
        super.setupEvents(socket);
    }

    emitUpdate() {
        let json = readFileSync("./server/rooms.json", 'utf-8')
        let d = JSON.parse(json)
        let keys = Object.keys(d)
        
        let rooms: Array<Room> = []

        for (let i = 0; i < keys.length; i++) {
            rooms.push(d[keys[i]])
        }

        this.io.emit(`${this.name}-list-update`, rooms) // emits all rooms to users listening
    }

    makeItem(room: Room) {
        super.makeItem(/* repository, payload */); // adding item to database from abstract class
        let id = uuidv4();
        let newRoom = {id: id, type: `${this.name}`, name: room.name, manager: room.manager, history: [], participants: []}
        this.currentRooms.push(newRoom); // default of a new room created

        let json = readFileSync("./server/rooms.json", 'utf-8')
        let d = JSON.parse(json)
        d[id] = newRoom
        writeFileSync("./server/rooms.json", JSON.stringify(d))
    }

    itemExists(id: string) : boolean {
        return this.currentRooms.find((room) => room.id == id) ? true : false; // determines if a room exists, from id
    }

    update(socket: Socket) {
        socket.on(`update-${this.name}`, (uRoom: Room) => { // Update item
            let index = this.currentRooms.indexOf(this.currentRooms.find(room => room.id == uRoom.id))
            this.currentRooms[index] = uRoom;
            let json = readFileSync("./server/rooms.json", 'utf-8')
            let d = JSON.parse(json)
            d[uRoom.id] = uRoom
            writeFileSync("./server/rooms.json", JSON.stringify(d))
            this.emitUpdate()
        })
    }
}