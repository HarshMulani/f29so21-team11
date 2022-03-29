"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.server = void 0;
const room_socket_1 = require("./room-socket");
const message_socket_1 = require("./message-socket");
const user_socket_1 = require("./user-socket");
const group_socket_1 = require("./group-socket");
const image_socket_1 = require("./image-socket");
var server = (io /*, connection: Connection*/) => {
    const rs = new room_socket_1.RoomSocket(io /*, connection*/); // setting up functionality of rooms
    const ms = new message_socket_1.MessageSocket(io, rs /*, connection*/); // setting up functionality of messages
    const us = new user_socket_1.UserSocket(io /*, connection*/); // setting up functionality of user connections
    const gs = new group_socket_1.GroupSockets(io, rs, us /*, connection*/); // setting up functionality of groups
    const is = new image_socket_1.ImageSocket(io /*, connection*/); // setting up functonality of image connections
    io.on('connection', (socket) => {
        console.log("User with id " + socket.id + " joined");
        // socket.on('whiteboard-draw', (actions: { x: number, y: number, size: number, color: {r: string, g: string, b: string}}) => {
        //     io.emit('whiteboard-update', actions)
        // })
        /* Room socket management */
        rs.setupEvents(socket); // making listeners for recieving room events
        /* message socket management */
        ms.setupEvents(socket); // making listeners for recieving chat message events
        /* user/account socket management */
        us.setupEvents(socket); // making listeners for recieving user account events
        /* group socket management */
        gs.setupEvents(socket); // making listeners for recieving group events
        /* image socket management */
        is.setupEvents(socket); // making listeners for recieving image events
        socket.on('disconnect', (reason) => __awaiter(void 0, void 0, void 0, function* () {
            console.log(`User with id ${socket.id} has disconnected with reason: ${reason}`);
        }));
    });
};
exports.server = server;
