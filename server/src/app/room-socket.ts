import { Server } from "socket.io";
import { crudtemplate } from "./crud-template";
import { EventTypes } from "./event-types";
import { v4 as uuidv4 } from 'uuid';
import { Room } from "../models/Room";


export class RoomSocket extends crudtemplate<Room> {

    public currentRooms = []; // list of current rooms on server

    constructor(io: Server) {
        super(io, EventTypes.Room);
    }

    emitUpdate() {
        this.io.emit(`${this.name}-list-update`, this.currentRooms) // emits all rooms to users listening
    }

    makeItem() {
        super.makeItem(/* repository, payload */); // adding item to database from abstract class
        this.currentRooms.push({id: uuidv4(), name: 'name', history: []}); // default of a new room created
    }

    itemExists(id: string) : boolean {
        return this.currentRooms.find((room) => room.id == id) ? true : false; // determines if a room exists, from id
    }    
}