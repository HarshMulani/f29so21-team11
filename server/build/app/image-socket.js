"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ImageSocket = void 0;
const crud_template_1 = require("./crud-template");
const event_types_1 = require("./event-types");
class ImageSocket extends crud_template_1.crudtemplate {
    constructor(io, connection) {
        super(io, event_types_1.EventTypes.Image);
        this.pictures = [];
        this.connection = connection;
    }
    setupEvents(socket) {
        super.setupEvents(socket);
    }
    emitUpdate() {
        this.io.emit('', null);
    }
    makeItem() {
    }
    itemExists(id) {
        return this.pictures.find((pic) => pic.id == id) ? true : false;
    }
}
exports.ImageSocket = ImageSocket;
