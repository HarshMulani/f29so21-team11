import { Overlay } from '@angular/cdk/overlay';
import { Component, OnInit } from '@angular/core';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { ActivatedRoute, Router, RouterStateSnapshot } from '@angular/router';
import { WhiteBoardRoom } from 'src/app/models/WhiteBoardRoom';
import { GroupManagerService } from 'src/app/services/group-manager/group-manager.service';
import { RoomManagerService } from 'src/app/services/room-manager/room-manager.service';
import { SocketManagerService } from 'src/app/services/socket-manager/socket-manager.service';


@Component({
  selector: 'app-group-room',
  templateUrl: './group-room.component.html',
  styleUrls: ['./group-room.component.scss']
})
export class GroupRoomComponent implements OnInit {

  isOpen = false;
  regName = /^[a-zA-Z0-9_!]{2,20}$/

  get inRoom() {
    return (this.router.url.split('/')[2]) ? true: false;
  }

  get rooms(): Array<WhiteBoardRoom> {
    return this.groupMan.rooms;
  }

  constructor(private socketMan: SocketManagerService, private groupMan: GroupManagerService, private router: Router, private activeRoute: ActivatedRoute, private roomMan: RoomManagerService) { }

  createRoom() {
    let name = prompt("Enter the room name", "name")!;
    if (name.match(this.regName)) {
      this.groupMan.createRoom(name);
    } else {
      alert("Name not valid, please try again!")
    }
  }

  ngOnInit(): void {
    this.groupMan.subscribeToRoom();

    let date = localStorage.getItem('auth-token')
    let currDate = new Date().getTime().toString();
    
    console.log(date, currDate)
    if (date) {
      if (date > currDate) {
        let elems = document.getElementsByClassName('to-hide')

        for (let i = 0; i < elems.length; i++) {
          elems[i].classList.remove('hidden')
        }
        return;
      }
    }
    let elems = document.getElementsByClassName('to-hide')

    for (let i = 0; i < elems.length; i++) {
      elems[i].classList.add('hidden')
    }
  }

  joinRoom(id: string) {
    this.groupMan.canvas = null;
    document.getElementById('grid')?.remove();
    this.router.navigateByUrl("/whiteboard")
      // this.router.navigateByUrl("/whiteboard/" + id)
      // console.log(id, this.activeRoute)
      setTimeout(() => {
      this.router.navigate([id], { relativeTo: this.activeRoute });
      // this.socketMan.emitEvent('get-all-group', null);
      this.groupMan.listenToRoomMessage(id);
      this.groupMan.listenToRoomWhiteboard(id);
      let subscribedRoom = this.groupMan.subscribedRooms.find((room) => room.id == id);
      let subscribedChatRoom = this.roomMan.subscribedRooms.find((room) => room.id == id);
      if (subscribedRoom == undefined) {
        this.groupMan.subscribedRooms.push({id: id, val: true});
        this.socketMan.emitEvent('update-group', {roomId: id});
      }
      if (subscribedChatRoom == undefined) {
        this.roomMan.subscribedRooms.push({id: id, val: true})
        this.socketMan.emitEvent('update-message', id);
      }
    }, 100);
  }
}
