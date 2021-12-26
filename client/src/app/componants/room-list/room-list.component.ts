import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Message } from 'src/app/models/Message';
import { Room } from 'src/app/models/Room';
import { RoomManagerService } from 'src/app/services/room-manager/room-manager.service';
import { SocketManagerService } from 'src/app/services/socket-manager/socket-manager.service';
import { ChatWindowComponent } from '../chat-window/chat-window.component';

@Component({
  selector: 'app-room-list',
  templateUrl: './room-list.component.html',
  styleUrls: ['./room-list.component.scss'],
})
export class RoomListComponent implements OnInit {

  constructor(private socketMan: SocketManagerService, private roomMan: RoomManagerService, private router: Router, private activeRoute: ActivatedRoute) { }

  get rooms(): Array<Room> {
    return this.roomMan.rooms;
  }

  createRoom() {
    this.roomMan.createRoom();
  }

  deleteRoom() {

  }

  selectRoom(id: string) {
    this.router.navigate([id], { relativeTo: this.activeRoute });
    this.socketMan.emitEvent('get-room-list', null);
    // this.roomMan.listenToRoom(id);
    console.log(`Listening to messages for room with id : ${id}`)
    this.socketMan.emitEvent('update-message', id);
    this.socketMan.subscribeToEvent(`message-update`, (msg : Message) => {
      let roomId = id;
      let currRoom = this.roomMan.rooms.find((room) => room.id == roomId);
      console.log(`Recieving message for room with id: ${roomId}`);
      // currRoom?.history.push(msg);
      currRoom?.history.push(msg);

    });
  }

  ngOnInit(): void {
    this.roomMan.subscribeToRoom();
  }

}
