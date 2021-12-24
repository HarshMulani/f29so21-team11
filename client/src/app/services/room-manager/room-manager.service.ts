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
    this.socketMan.emitEvent('createRoom', null);
  }

  subscribeToRoom() {
    this.socketMan.subscribeToEvent('room-list-update', (rooms) => {console.log(rooms); this.rooms = rooms})
    this.socketMan.emitEvent('get-room-list', null);
  }
}
