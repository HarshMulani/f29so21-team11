"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RoomSocket = void 0;
const crud_template_1 = require("./crud-template");
const event_types_1 = require("./event-types");
const uuid_1 = require("uuid");
class RoomSocket extends crud_template_1.crudtemplate {
    constructor(io /*, connection: Connection*/) {
        super(io, event_types_1.EventTypes.Room);
        this.currentRooms = []; // list of current rooms on server
    }
    emitUpdate() {
        this.io.emit(`${this.name}-list-update`, this.currentRooms); // emits all rooms to users listening
    }
    makeItem() {
        super.makeItem( /* repository, payload */); // adding item to database from abstract class
        this.currentRooms.push({ id: (0, uuid_1.v4)(), type: `${this.name}`, name: 'name', history: [] }); // default of a new room created
    }
    itemExists(id) {
        return this.currentRooms.find((room) => room.id == id) ? true : false; // determines if a room exists, from id
    }
}
exports.RoomSocket = RoomSocket;
