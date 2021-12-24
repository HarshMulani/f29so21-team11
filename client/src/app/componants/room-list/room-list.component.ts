import { Message } from '@angular/compiler/src/i18n/i18n_ast';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
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

  constructor(private roomMan: RoomManagerService, private router: Router, private activeRoute: ActivatedRoute) { }

  get rooms(): Array<Room> {
    return this.roomMan.rooms;
  }

  createRoom() {
    this.roomMan.createRoom();
  }

  deleteRoom() {

  }

  selectRoom(id: string) {
    // Object.keys(this.chatComponant.subscribed).forEach((ids) => { this.chatComponant.subscribed[ids] = false })
    this.router.navigate([id], { relativeTo: this.activeRoute });

    // this.socketMan.subscribeToEvent(`${id}chat-history`, (messages : Array<Message>) => {messages.forEach((element) => { this.chatComponant.messages.push(element)});});
    // this.socketMan.emitEvent('load-chat-history', id);

    // this.socketMan.subscribeToEvent(`${id}msg`, (msg) => { this.chatComponant.messages.push(msg); });
    // this.socketMan.subscribeToEvent(this.router.url.split('/chat/')[1], () => { });
  }

  ngOnInit(): void {
    this.roomMan.subscribeToRoom();
  }

}
