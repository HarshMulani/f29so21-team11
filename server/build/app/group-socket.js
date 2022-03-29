"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GroupSockets = void 0;
const crud_template_1 = require("./crud-template");
const uuid_1 = require("uuid");
const event_types_1 = require("./event-types");
const canvas_1 = require("canvas");
const fs_1 = require("fs");
class GroupSockets extends crud_template_1.crudtemplate {
    constructor(io, rs, us /*, connection: Connection*/) {
        super(io, event_types_1.EventTypes.Group);
        this.currentGroups = [];
        this.roomSocket = rs;
        this.userSocket = us;
        // this.connection = connection;
    }
    setupEvents(socket) {
        super.setupEvents(socket);
        this.setCanvas(socket);
        this.updateRoom(socket);
    }
    emitUpdate() {
        // console.log(this.currentGroups)
        let json = (0, fs_1.readFileSync)("./server/groups.json", 'utf-8');
        let d = JSON.parse(json);
        let keys = Object.keys(d);
        let groups = [];
        for (let i = 0; i < keys.length; i++) {
            groups.push(d[keys[i]]);
        }
        // console.log(groups.length)
        this.io.emit(`${this.name}-list-update`, groups);
    }
    create(socket) {
        socket.on(`create-${this.name}`, (data) => {
            this.makeItem(data);
            this.emitUpdate();
        });
    }
    makeItem(data) {
        super.makeItem( /* repository, payload */);
        let id = (0, uuid_1.v4)();
        let room = { id: id, type: `room`, name: data.name, manager: data.manager, history: [], participants: [] };
        let canvas = (0, canvas_1.createCanvas)(2560, 1440).toDataURL();
        let group = { id: id, name: data.name, manager: data.manager, whiteboard: canvas, chat: room, participants: [] };
        let json = (0, fs_1.readFileSync)("./server/groups.json", 'utf-8');
        let d = JSON.parse(json);
        d[id] = group;
        (0, fs_1.writeFileSync)("./server/groups.json", JSON.stringify(d));
        let json2 = (0, fs_1.readFileSync)("./server/rooms.json", 'utf-8');
        let d2 = JSON.parse(json2);
        d2[id] = room;
        (0, fs_1.writeFileSync)("./server/rooms.json", JSON.stringify(d2));
        // this.currentGroups.push(group)
        // this.roomSocket.currentRooms.push(room)
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
            let json = (0, fs_1.readFileSync)("./server/actions.json", 'utf-8');
            let d = JSON.parse(json);
            if (!d[actions.roomId])
                d[actions.roomId] = [];
            d[actions.roomId].push(actions);
            (0, fs_1.writeFileSync)("./server/actions.json", JSON.stringify(d));
            this.io.emit(`${this.name}-update-${actions.roomId}`, actions);
        });
    }
    setCanvas(socket) {
        socket.on('update-group-canvas', (data) => {
            if (data.RoomId == undefined)
                return;
            // let curRoom = this.currentGroups.find((room) => room.id == data.RoomId);
            // if (!curRoom) return
            // curRoom.whiteboard = data.canvas;
            let json = (0, fs_1.readFileSync)("./server/groups.json", 'utf-8');
            let d = JSON.parse(json);
            d[data.RoomId].whiteboard = data.canvas;
            (0, fs_1.writeFileSync)("./server/groups.json", JSON.stringify(d));
            this.emitUpdate();
        });
    }
    updateRoom(socket) {
        socket.on('update-group-room', (uRoom) => {
            // let index = this.currentGroups.indexOf(this.currentGroups.find(room => room.id == uRoom.id))
            // this.currentGroups[index] = uRoom;
            let json = (0, fs_1.readFileSync)("./server/groups.json", 'utf-8');
            let d = JSON.parse(json);
            d[uRoom.id] = uRoom;
            (0, fs_1.writeFileSync)("./server/groups.json", JSON.stringify(d));
            this.emitUpdate();
        });
    }
}
exports.GroupSockets = GroupSockets;
