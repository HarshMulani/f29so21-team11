import { writeFile } from "fs/promises";
import { readFile, readFileSync, writeFileSync } from "fs";
import { resolve } from "path";
import { Server, Socket } from "socket.io";
import { Connection } from "typeorm";
import { crudtemplate } from "./crud-template";
import { EventTypes } from "./event-types";
import { v4 as uuid } from "uuid";

export class ImageSocket extends crudtemplate<any> {

    private connection : Connection;
    private pictures : Array<{id: string, uploadTime: Date, link: string}> = []

    constructor(io: Server/*, connection: Connection*/) {
        super(io, EventTypes.Image)
        // this.connection = connection;
    }

    setupEvents(socket: Socket) {
        super.setupEvents(socket)
    }

    emitUpdate(): void {
        this.io.emit('', null)
    }

    read(socket: Socket) {
        socket.on(`get-all-${this.name}`, async () => {
            let d = readFileSync("./server/images.json", 'utf8')
            let js: JSON;
            let data: Array<{id: string, uploadTime: string, caption: string, img: string, uploader: string}> = []

            js = JSON.parse(d);

            for (var i = 0; i < Object.keys(js).length; i++) {
                // console.log(js[Object.keys(js)[i]].id)
                // console.log(Object.keys(js)[i])
                data[i] = { id: js[Object.keys(js)[i]].id, uploadTime: Object.keys(js)[i], caption: js[Object.keys(js)[i]].caption, img: js[Object.keys(js)[i]].URL, uploader: js[Object.keys(js)[i]].uploader };
            }
            // console.log(data.length)
            socket.emit('image-list-update', data)
        })
    }

    async makeItem(data: {img: string, owner: string, caption: string, uploader: string}): Promise<void> {
        // console.log(data);
        // let js = require("./server/images.json");
        // let table = {};
        // table[Date()] = { id: uuid, URL: data };


        let d = readFileSync("./server/images.json", 'utf8')
        let a = JSON.parse(d);
        for (var i = 0; i < Object.keys(a).length; i++) {
            if (a[Object.keys(a)[i]].URL == data.img) return;
        }
        a[Date().toString()] = { id: uuid(), owner: data.owner, caption: data.caption, URL: data.img, uploader: data.uploader };
        writeFileSync("./server/images.json", JSON.stringify(a));
    }

    itemExists(id: string): boolean {

        return this.pictures.find((pic) => pic.id == id)? true: false;
    }
}