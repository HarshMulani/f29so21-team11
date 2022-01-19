"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WhiteboardSocket = void 0;
const crud_template_1 = require("./crud-template");
const event_types_1 = require("./event-types");
class WhiteboardSocket extends crud_template_1.crudtemplate {
    constructor(io, gs) {
        super(io, event_types_1.EventTypes.Group);
        this.groupSocket = gs;
    }
    setupEvents(socket) {
        super.setupEvents(socket);
    }
}
exports.WhiteboardSocket = WhiteboardSocket;
