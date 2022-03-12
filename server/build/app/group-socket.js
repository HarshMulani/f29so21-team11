"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GroupSockets = void 0;
const crud_template_1 = require("./crud-template");
const uuid_1 = require("uuid");
const event_types_1 = require("./event-types");
const canvas_1 = require("canvas");
class GroupSockets extends crud_template_1.crudtemplate {
    constructor(io, rs, connection) {
        super(io, event_types_1.EventTypes.Group);
        this.currentGroups = [];
        this.roomSocket = rs;
        this.connection = connection;
    }
    setupEvents(socket) {
        super.setupEvents(socket);
        this.setCanvas(socket);
    }
    emitUpdate() {
        // console.log(this.currentGroups)
        this.io.emit(`${this.name}-list-update`, this.currentGroups);
    }
    makeItem() {
        super.makeItem( /* repository, payload */);
        let roomId = (0, uuid_1.v4)();
        let room = { id: roomId, type: `${this.name}`, name: 'name', history: [] };
        let canvas = (0, canvas_1.createCanvas)(2560, 1440).toDataURL();
        this.currentGroups.push({ id: roomId, name: 'name', whiteboard: canvas, chat: room });
        this.roomSocket.currentRooms.push(room);
    }
    itemExists(id) {
        return this.currentGroups.find((group) => group.id == id) ? true : false;
    }
    update(socket) {
        socket.on(`update-${this.name}`, (actions) => {
            if (actions.color == undefined) {
                this.io.emit(`${this.name}-update-${actions.roomId}`, null);
                return;
            }
            this.io.emit(`${this.name}-update-${actions.roomId}`, actions);
        });
    }
    setCanvas(socket) {
        socket.on('update-group-canvas', ({ canvas: can, RoomId: id }) => {
            if (id == undefined)
                return;
            let curRoom = this.currentGroups.find((room) => room.id == id);
            curRoom.whiteboard = can;
            this.emitUpdate();
        });
    }
}
exports.GroupSockets = GroupSockets;
