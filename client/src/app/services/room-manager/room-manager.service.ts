import { Injectable } from '@angular/core';
import { Message } from 'src/app/models/Message';
import { Room } from 'src/app/models/Room';
import { SocketManagerService } from '../socket-manager/socket-manager.service';

@Injectable({
  providedIn: 'root'
})
export class RoomManagerService {

  rooms: Array<Room> = [];

  subscribedRooms: Array<{id: string, val: boolean}> = []

  constructor(private socketMan: SocketManagerService) {  }

  createRoom() {
    this.socketMan.emitEvent('create-room', null);
  }

  subscribeToRoom() {
    this.socketMan.subscribeToEvent('room-list-update', (rooms) => {this.rooms = rooms; console.log(this.rooms)})
    this.socketMan.emitEvent('get-all-room', null);
  }

  sendMessage(mVal : string,  id : string | null) {
    let message = { roomid: id, message: mVal, sentBy: "User", timestamp: new Date() };
    if (id == null) {return}
    this.socketMan.emitEvent(id, message);
  }

  listenToRoom(id: string) {
    this.socketMan.subscribeToEvent(`message-update-${id}`, (msg : Message) => {
      let currRoom = this.rooms.find((room) => room.id == id);
      if (currRoom?.history.find((message) => message == msg)) return
      currRoom?.history.push(msg);
    });
  }

}
