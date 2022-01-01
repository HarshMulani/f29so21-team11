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
    // this.socketMan.emitEvent('get-room-list', null);
    this.roomMan.listenToRoom(id);
    // console.log(`Listening to messages for room with id : ${id}`)
    let subscribedRoom = this.roomMan.subscribedRooms.find((room) => room.id == id);
    if (subscribedRoom != undefined) return
    this.roomMan.subscribedRooms.push({id: id, val: true});
    this.socketMan.emitEvent('update-message', id);
  }

  ngOnInit(): void {
    this.roomMan.subscribeToRoom();
  }

}
