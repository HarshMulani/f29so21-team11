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
exports.ImageSocket = void 0;
const fs_1 = require("fs");
const crud_template_1 = require("./crud-template");
const event_types_1 = require("./event-types");
const uuid_1 = require("uuid");
class ImageSocket extends crud_template_1.crudtemplate {
    constructor(io /*, connection: Connection*/) {
        super(io, event_types_1.EventTypes.Image);
        this.pictures = [];
        // this.connection = connection;
    }
    setupEvents(socket) {
        super.setupEvents(socket);
    }
    emitUpdate() {
        this.io.emit('', null);
    }
    read(socket) {
        socket.on(`get-all-${this.name}`, () => __awaiter(this, void 0, void 0, function* () {
            let d = (0, fs_1.readFileSync)("./server/images.json", 'utf8');
            let js;
            let data = [];
            js = JSON.parse(d);
            for (var i = 0; i < Object.keys(js).length; i++) {
                // console.log(js[Object.keys(js)[i]].id)
                // console.log(Object.keys(js)[i])
                data[i] = { id: js[Object.keys(js)[i]].id, uploadTime: Object.keys(js)[i], caption: js[Object.keys(js)[i]].caption, img: js[Object.keys(js)[i]].URL, uploader: js[Object.keys(js)[i]].uploader };
            }
            // console.log(data.length)
            socket.emit('image-list-update', data);
        }));
    }
    makeItem(data) {
        return __awaiter(this, void 0, void 0, function* () {
            // console.log(data);
            // let js = require("./server/images.json");
            // let table = {};
            // table[Date()] = { id: uuid, URL: data };
            let d = (0, fs_1.readFileSync)("./server/images.json", 'utf8');
            let a = JSON.parse(d);
            for (var i = 0; i < Object.keys(a).length; i++) {
                if (a[Object.keys(a)[i]].URL == data.img)
                    return;
            }
            a[Date().toString()] = { id: (0, uuid_1.v4)(), owner: data.owner, caption: data.caption, URL: data.img, uploader: data.uploader };
            (0, fs_1.writeFileSync)("./server/images.json", JSON.stringify(a));
        });
    }
    itemExists(id) {
        return this.pictures.find((pic) => pic.id == id) ? true : false;
    }
}
exports.ImageSocket = ImageSocket;
