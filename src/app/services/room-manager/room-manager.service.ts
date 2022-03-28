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

  a: any = {}

  constructor(private socketMan: SocketManagerService) {  }

  createRoom(n: string) {
    this.socketMan.emitEvent('create-room', {name: n, manager: localStorage.getItem('login-token')});
  }

  subscribeToRoom() {
    this.socketMan.subscribeToEvent('room-list-update', (rooms) => {this.rooms = rooms; console.log(this.rooms)})
    this.socketMan.emitEvent('get-all-room', null);
  }

  sendMessage(mVal : string,  id : string | null) {
    let message = { roomid: id, message: mVal, sentBy: localStorage.getItem('login-token'), timestamp: new Date() };
    if (id == null) {return}
    this.socketMan.emitEvent(id, message);
  }

  listenToRoom(id: string) {
    let currRoom = this.rooms.find((room) => room.id == id)
    if (!currRoom!.participants.includes(localStorage.getItem('login-token')!)) {
      console.log("adding 1 to chats")
      this.rooms.find((room) => room.id == id)!.participants.push(localStorage.getItem('login-token')!)
      this.socketMan.emitEvent('update-room', currRoom)
      this.socketMan.emitEvent('update-user-stats', {name: localStorage.getItem('login-token'), stat: 'chats'})
    }

    this.rooms.find((room) => room.id == id)!.participants
    this.a[id] = this.socketMan.subscribeToEvent(`message-update-${id}`, (msg : Message) => {
      let currRoom = this.rooms.find((room) => room.id == id);
      if (currRoom?.history.find((message) => message == msg)) return
      currRoom?.history.push(msg);
    });
  }
}
