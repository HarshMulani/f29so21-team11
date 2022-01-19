"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.crudtemplate = void 0;
// This template contains the default implementations for all types of socket communications
class crudtemplate {
    constructor(io, name) {
        this.name = name;
        this.io = io;
    }
    setupEvents(socket) {
        this.create(socket); // create brand new item
        this.read(socket); // returns all items
        this.update(socket); // updates item that already exists
        this.delete(socket); // delete item that exists
    }
    // all abstract functions, modified or used on extended classes
    // functions can be overwritten but don't have to be
    // this can never be a class but always must be extended
    itemExists(id) {
        throw new Error('Not implemented');
    }
    makeItem(payload) {
        // make item in db
        // return item from db
        // use item from db await()
    }
    emitUpdate(options) {
        throw new Error('Not implemented');
    }
    create(socket) {
        socket.on(`create-${this.name}`, (data) => {
            this.makeItem(data);
            this.emitUpdate();
        });
    }
    read(socket) {
        socket.on(`get-all-${this.name}`, () => {
            this.emitUpdate();
        });
    }
    update(socket) {
        socket.on(`update-${this.name}`, (id) => {
            this.emitUpdate({ socket, id });
        });
    }
    delete(socket) {
        socket.on(`delete-${this.name}`, (id) => {
            if (!this.itemExists(id))
                return;
            this.emitUpdate();
        });
    }
}
exports.crudtemplate = crudtemplate;
