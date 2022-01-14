import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Message } from 'src/app/models/Message';
import { RoomManagerService } from 'src/app/services/room-manager/room-manager.service';
import { SocketManagerService } from 'src/app/services/socket-manager/socket-manager.service';

@Component({
  selector: 'app-chat-window',
  templateUrl: './chat-window.component.html',
  styleUrls: ['./chat-window.component.scss']
})
export class ChatWindowComponent implements OnInit, OnDestroy {


  // currentRoomId: string | null = null;

  subscribed: { [key: string]: boolean } = {};

  constructor(private activeRoute: ActivatedRoute, private roomMan: RoomManagerService, private router: Router) { }
  ngOnDestroy(): void {
    // this.historyService.messages = [];
  }

  ngOnInit(): void { }

  get currentRoomId() : string | null {
    return this.activeRoute.snapshot.params['id'];
  }

  get messages(): Array<Message> {
    let id = this.currentRoomId;
    let currRoom = this.roomMan.rooms.find((room) => room.id == id);
    return (currRoom == undefined) ? [] : currRoom.history;
  }

  sendMessage(mVal: string) {
    if (mVal == '') { return }
    let messageHist = document.getElementById('messageHist');
    messageHist?.scrollTo(0, messageHist.scrollHeight);
    this.roomMan.sendMessage(mVal, this.currentRoomId)
  }
}
