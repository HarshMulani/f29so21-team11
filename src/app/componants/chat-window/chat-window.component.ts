import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Room } from 'server/src/models/Room';
import { Message } from 'src/app/models/Message';
import { GroupManagerService } from 'src/app/services/group-manager/group-manager.service';
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

  constructor(private router: Router, private roomMan: RoomManagerService, private groupMan: GroupManagerService, private socketMan: SocketManagerService) { }
  ngOnDestroy(): void {
    // this.historyService.messages = [];
  }

  ngOnInit(): void {
    let messageHist = document.getElementById('messageHist');
    setTimeout(() => {
      messageHist?.scrollTo(0, messageHist.scrollHeight);
    }, 100);
  }

  get manager(): boolean {
    return (this.room.manager == localStorage.getItem('login-token')) ? true : false;
  }
  get currentRoomId() : string | null {
    return this.router.url.split('/')[2]
  }

  get room() : Room {
    return this.roomMan.rooms.find((room) => room.id == this.currentRoomId)!
  }

  get messages(): Array<Message> {
    let id = this.currentRoomId;
    let currRoom = this.roomMan.rooms.find((room) => room.id == id);
    return (currRoom == undefined) ? [] : currRoom.history;
  }

  sendMessage() {
    let mVal = document.getElementById('msgInput') as HTMLInputElement
    if (mVal.value == '') { return }
    let messageHist = document.getElementById('messageHist');
    this.roomMan.sendMessage(mVal.value, this.currentRoomId)
    mVal.value = ''
    setTimeout(() => {
      messageHist?.scrollTo(0, messageHist.scrollHeight);
    }, 10);
  }

  unsubscribeFromRoom() {
    this.socketMan.sock.removeListener(`message-update-${this.roomMan.a[this.currentRoomId!]}`);
    this.roomMan.a[this.currentRoomId!] = null;
  }

  changeRoomName() {
    let newName = prompt("Enter new room name")
    let room = this.room
    room.name = newName!
    this.socketMan.emitEvent('update-room', room)
    let group = this.groupMan.rooms.find(group => group.id == this.currentRoomId)
    if (group) {
      group.name = newName!
      this.socketMan.emitEvent('update-group-room', group)
    }
  }
}
