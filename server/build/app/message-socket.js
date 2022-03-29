"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MessageSocket = void 0;
const crud_template_1 = require("./crud-template");
const event_types_1 = require("./event-types");
const uuid_1 = require("uuid");
const fs_1 = require("fs");
class MessageSocket extends crud_template_1.crudtemplate {
    constructor(io, rs /*, connection: Connection*/) {
        super(io, event_types_1.EventTypes.Message);
        this.roomSocket = rs;
        // this.connection = connection;
    }
    emitUpdate({ socket, id }) {
        socket.on(id, (msg) => {
            this.makeItem(msg); // Creates new message
            this.io.emit(`${this.name}-update-${id}`, msg); // emitting new message
        });
    }
    makeItem(payload) {
        let id = payload.roomid;
        payload.id = (0, uuid_1.v4)(); // sets message id
        // let currRoom = this.roomSocket.currentRooms.find((room) => room.id == payload.roomid) // finds current room
        // currRoom.history.push(payload); // adds message to current room
        let json = (0, fs_1.readFileSync)("./server/rooms.json", 'utf-8');
        let d = JSON.parse(json);
        d[id].history.push(payload);
        (0, fs_1.writeFileSync)("./server/rooms.json", JSON.stringify(d));
    }
}
exports.MessageSocket = MessageSocket;
