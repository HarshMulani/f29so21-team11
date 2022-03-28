import { AfterViewInit, Component, OnInit } from '@angular/core';
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
export class RoomListComponent implements OnInit, AfterViewInit {

  constructor(private socketMan: SocketManagerService, private roomMan: RoomManagerService, private router: Router, private activeRoute: ActivatedRoute) { }

  selectedRooms: Array<Room> = [];

  get rooms(): Array<Room> {
    return this.roomMan.rooms;
  }

  // get selectedRooms(): Array<Room> {
  //   let roomList: Array<Room> = new Array<Room>();
    
  //   let searchVal = document.getElementById('search-box') as HTMLInputElement;

  //   this.rooms.forEach((room) => { if (room.name.toLowerCase().includes(searchVal.value.toLowerCase())) { roomList.push(room) } });
  //   return roomList;
  // }

  createRoom() {
    let name = prompt("Enter the room name", "name");
    if (name != null) {
      this.roomMan.createRoom(name);
    }
    setTimeout(() => {
      this.search();
    }, 10);
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

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.search();
    }, 400);
  }

  search() {
    let roomList: Array<Room> = new Array<Room>();
    let searchVal = document.getElementById('search-box') as HTMLInputElement;
    if (searchVal.value.length != 0) {
      this.rooms.forEach((room) => { if (room.name.toLowerCase().includes(searchVal.value.toLowerCase())) { roomList.push(room) } });
      this.selectedRooms = roomList;
    } else {
      this.selectedRooms = this.rooms;
    }
  }

}
