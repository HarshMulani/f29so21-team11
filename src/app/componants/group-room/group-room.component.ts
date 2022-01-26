import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
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

  constructor(private socketMan: SocketManagerService, private groupMan: GroupManagerService, private router: Router, private activeRoute: ActivatedRoute, private roomMan: RoomManagerService) { }

  get rooms(): Array<WhiteBoardRoom> {
    return this.groupMan.rooms;
  }

  createRoom() {
    this.groupMan.createRoom();
  }

  joinRoom(id: string) {
    this.router.navigate([id], { relativeTo: this.activeRoute });

    this.socketMan.emitEvent('get-all-group', null);
    console.log(this.rooms)
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
  }

  ngOnInit(): void {
    this.groupMan.subscribeToRoom();
  }

}
