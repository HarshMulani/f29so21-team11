import { Server, Socket } from "socket.io";
import { EventTypes } from "./event-types";

// This template contains the default implementations for all types of socket communications

export abstract class crudtemplate<T extends {id: string}> {
    // type T is a generic type that is used by the class and is specified in the classes that extend this
    // extends forces the type specified on the extended class to at least meet the format of the extended type 

    protected name : EventTypes;
    protected io: Server;

    constructor(io: Server, name : EventTypes) {
        this.name = name;
        this.io = io;
    }

    setupEvents(socket: Socket) { // Setting up C, R, U, D listeners for suers socket
        this.create(socket); // create brand new item
        this.read(socket);   // returns all items
        this.update(socket); // updates item that already exists
        this.delete(socket); // delete item that exists
    }
    
    // all abstract functions, modified or used on extended classes
    // functions can be overwritten but don't have to be
    // this can never be a class but always must be extended

    itemExists(id: string) : boolean {
        throw new Error('Not implemented')
    }

    makeItem(payload?: T) {
        // make item in db
        // return item from db
        // use item from db await()
    }

    emitUpdate(options?: {socket?: Socket, id?: string}) {
        throw new Error('Not implemented')
    }


    create(socket: Socket) {
        socket.on(`create-${this.name}`, (data: T) => { // create item
        this.makeItem(data);
        
        this.emitUpdate();
    })}

    read(socket: Socket) {
        socket.on(`get-all-${this.name}`, () => { // Read items
            this.emitUpdate();
        })
    }
    
    update(socket: Socket) {
        socket.on(`update-${this.name}`, (id : string) => { // Update item
            this.emitUpdate({socket, id});
        })
    }
    
    delete(socket: Socket) {
        socket.on(`delete-${this.name}`, (id: string) => { // Delete item
            if (!this.itemExists(id)) return;
            this.emitUpdate();
        })
    }
}