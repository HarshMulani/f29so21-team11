import { Injectable } from '@angular/core';
import { Room } from 'src/app/models/Room';
import { SocketManagerService } from '../socket-manager/socket-manager.service';

@Injectable({
  providedIn: 'root'
})
export class RoomManagerService {

  rooms: Array<Room> = [];

  constructor(private socketMan: SocketManagerService) {  }

  createRoom() {
    this.socketMan.emitEvent('create-room', null);
  }

  subscribeToRoom() {
    this.socketMan.subscribeToEvent('room-list-update', (rooms) => {this.rooms = rooms;})
    this.socketMan.emitEvent('get-all-room', null);
  }

  sendMessage(mVal : string,  id : string | null) {
    let message = { roomid: id, message: mVal, sentBy: "User", timestamp: new Date() };
    console.log("Message: ", message)
    if (id == null) {return}
    this.socketMan.emitEvent(id, message);
  }

  // listenToRoom(id:string) {
  //   console.log(`Subscribing to Room with id: ${id}`)
  // }

}
