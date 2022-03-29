"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RoomSocket = void 0;
const crud_template_1 = require("./crud-template");
const event_types_1 = require("./event-types");
const uuid_1 = require("uuid");
const fs_1 = require("fs");
class RoomSocket extends crud_template_1.crudtemplate {
    constructor(io /*, connection: Connection*/) {
        super(io, event_types_1.EventTypes.Room);
        this.currentRooms = []; // list of current rooms on server
    }
    setupEvents(socket) {
        super.setupEvents(socket);
    }
    emitUpdate() {
        let json = (0, fs_1.readFileSync)("./server/rooms.json", 'utf-8');
        let d = JSON.parse(json);
        let keys = Object.keys(d);
        let rooms = [];
        for (let i = 0; i < keys.length; i++) {
            rooms.push(d[keys[i]]);
        }
        this.io.emit(`${this.name}-list-update`, rooms); // emits all rooms to users listening
    }
    makeItem(room) {
        super.makeItem( /* repository, payload */); // adding item to database from abstract class
        let id = (0, uuid_1.v4)();
        let newRoom = { id: id, type: `${this.name}`, name: room.name, manager: room.manager, history: [], participants: [] };
        this.currentRooms.push(newRoom); // default of a new room created
        let json = (0, fs_1.readFileSync)("./server/rooms.json", 'utf-8');
        let d = JSON.parse(json);
        d[id] = newRoom;
        (0, fs_1.writeFileSync)("./server/rooms.json", JSON.stringify(d));
    }
    itemExists(id) {
        return this.currentRooms.find((room) => room.id == id) ? true : false; // determines if a room exists, from id
    }
    update(socket) {
        socket.on(`update-${this.name}`, (uRoom) => {
            let index = this.currentRooms.indexOf(this.currentRooms.find(room => room.id == uRoom.id));
            this.currentRooms[index] = uRoom;
            let json = (0, fs_1.readFileSync)("./server/rooms.json", 'utf-8');
            let d = JSON.parse(json);
            d[uRoom.id] = uRoom;
            (0, fs_1.writeFileSync)("./server/rooms.json", JSON.stringify(d));
            this.emitUpdate();
        });
    }
}
exports.RoomSocket = RoomSocket;
