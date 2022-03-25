import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { Room } from 'src/app/models/Room';

@Injectable({
  providedIn: 'root'
})
export class SocketManagerService {

  rooms: Array<{ room: Room }> = [];


  constructor(private socket: Socket) { }

  emitEvent(name: string, payload: any) {
    this.socket.emit(name, payload);
  }

  subscribeToEvent(name: string, func: (...args: any) => void) {
    this.socket.on(name, func);
  }

  // listOfListeners
}
