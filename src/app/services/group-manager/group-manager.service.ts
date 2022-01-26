import { Injectable } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { WhiteBoardAction } from 'src/app/models/WhiteBoardAction';
import { WhiteBoardRoom } from 'src/app/models/WhiteBoardRoom';
import { RoomManagerService } from '../room-manager/room-manager.service';
import { SocketManagerService } from '../socket-manager/socket-manager.service';
import { WhiteboardManagerService } from '../whiteboard-manager/whiteboard-manager.service';

@Injectable({
  providedIn: 'root'
})
export class GroupManagerService {
  
  rooms : Array<WhiteBoardRoom> = []

  subscribedRooms: Array<{id: string, val: boolean}> = []

  tempcan : HTMLCanvasElement | null = null;
  
  constructor(private socketMan: SocketManagerService, private activeRoute: ActivatedRoute, private roomMan: RoomManagerService) {}

  get currentRoomId() : string | null {
    return this.activeRoute.snapshot.params['id']
  }


  emitDraw(actions: WhiteBoardAction) {
    this.socketMan.emitEvent(`update-group`, actions)
  }

  draw(id: string, actions: WhiteBoardAction) {
    let canvas = document.getElementById('Canvas') as HTMLCanvasElement;
    if (canvas == undefined) return
    if (canvas.getContext('2d') == null) return

    // canvas embedded in website
    let ctx = canvas.getContext('2d')
    ctx!.setTransform(1, 0, 0, 1, 0, 0)
    ctx!.beginPath()
    ctx!.ellipse(
      actions.x * (canvas.width / 2560), // x-point
      actions.y * (canvas.height / 1440), // y-point
      actions.size * (canvas.width / 2560), // x-width
      actions.size * (canvas.height / 1440), // y-width
      Math.PI / 4, // rotation
      0, // start angle
      2 * Math.PI // end angle
    )
    ctx!.fillStyle = `#${actions.color.r}${actions.color.g}${actions.color.b}`
    ctx!.fill()
    ctx!.closePath()

    // 2560 x 1440 Canvas
    let tempctx = this.tempcan!.getContext('2d')
    tempctx!.setTransform(1, 0, 0, 1, 0, 0)
    tempctx!.beginPath()
    tempctx!.ellipse(
      actions.x, // x-point
      actions.y, // y-point
      actions.size, // x-width
      actions.size, // y-width
      Math.PI / 4, // rotation
      0, // start angle
      2 * Math.PI // end angle
    )
    tempctx!.fillStyle = `#${actions.color.r}${actions.color.g}${actions.color.b}`
    tempctx!.fill()
    tempctx!.closePath()
  }

  shareCanvas(id: string | null) {
    let room = this.rooms.find((room) => room.id == id)
    room!.whiteboard = this.tempcan!.toDataURL();
    this.socketMan.emitEvent('update-group-canvas', ({canvas: room?.whiteboard, RoomId: id}));
  }

  setCanvas(id: string | null, canvas: HTMLCanvasElement) {
    if (id == null) return
    this.rooms.find((room) => room.id == id)!.whiteboard = canvas.toDataURL();
  }

  setupCanvas() {
    this.tempcan = document.createElement('canvas') as HTMLCanvasElement;
    this.tempcan.width = 2560
    this.tempcan.height = 1440
  }

  createRoom() {
    let can = document.createElement('canvas') as HTMLCanvasElement
    can.width = window.innerWidth * (3 / 5) - 20;
    can.height = can.width * (0.5625);
    this.socketMan.emitEvent('create-group', can)
  }

  subscribeToRoom() {
    this.socketMan.subscribeToEvent('group-list-update', (rooms) => {this.rooms = rooms;})
    this.socketMan.emitEvent('get-all-group', null);
  }

  sendAction(actions: WhiteBoardAction) {
    this.emitDraw(actions)
  }

  listenToRoomWhiteboard(id: string) {
    this.socketMan.subscribeToEvent(`group-update-${id}`, (actions: WhiteBoardAction) => {
      if (actions == null) return
      this.draw(id, actions)
    })
  }

  listenToRoomMessage(id: string) {
    if (!this.roomMan.rooms.find((room) => room.id == id)) {
      this.roomMan.rooms.push(this.rooms.find((room) => room.id == id)!.chat)
    }
    this.roomMan.listenToRoom(id);
  }
}
