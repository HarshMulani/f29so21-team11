import { templateSourceUrl, ThrowStmt } from '@angular/compiler';
import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { windowWhen } from 'rxjs';
import { Color } from 'src/app/models/Color';
import { WhiteBoardAction } from 'src/app/models/WhiteBoardAction';
import { WhiteBoardRoom } from 'src/app/models/WhiteBoardRoom';
import { GroupManagerService } from 'src/app/services/group-manager/group-manager.service';
import { SocketManagerService } from 'src/app/services/socket-manager/socket-manager.service';
import { WhiteboardManagerService } from 'src/app/services/whiteboard-manager/whiteboard-manager.service';

@Component({
  selector: 'app-whiteboard',
  templateUrl: './whiteboard.component.html',
  styleUrls: ['./whiteboard.component.scss']
})
export class WhiteboardComponent implements OnInit, AfterViewInit, OnDestroy {

  mouse = { x: 0, y: 0, scrollTop: 0, button: false, wheel: 0, drag: false };
  events: Array<string> = ["mousedown", "mouseup", "mousemove"]
  listEvents : any = {}

  constructor(private groupMan: GroupManagerService, private activeRoute: ActivatedRoute) { }

  get canvas () : HTMLCanvasElement {
    return document.getElementById('Canvas') as HTMLCanvasElement
  }

  get currentRoomId() : string | null {
    return this.activeRoute.snapshot.params['id']
  }

  ngOnInit(): void {
  }

  ngAfterViewInit() {
    this.setCanvas()
    this.setupMouse()
  }

  ngOnDestroy() {
    this.events.forEach((name) => document.removeEventListener(name, this.listEvents[name], false))
    // document.getElementById('grid')!.remove()
  }

  setupMouse() {
    // this.events.forEach((name) => document.addEventListener(name, (e) => this.mouseEvents(e), false))
    this.events.forEach((name) => document.addEventListener(name, this.listEvents[name] = (e: any) => { this.mouseEvents(e)}, false))
  }

  setCanvas() {
    this.canvas.width = window.innerWidth * (3 / 5) - 20;
    this.canvas.height = this.canvas.width * (0.5625);
    
    let room = this.groupMan.rooms.find((room) => room.id == this.currentRoomId);

    if (room?.whiteboard) {
      let prev = room.whiteboard
      if (prev == null) return
      let img = new Image
      img.onload = () => {
        let cw = this.canvas!.width;
        let ch = this.canvas!.height;
        this.groupMan.setupCanvas()
        this.groupMan.tempcan!.getContext('2d')!.drawImage(img, 0, 0, 2560, 1440)
        this.canvas!.getContext('2d')!.drawImage(this.groupMan.tempcan!, 0, 0, cw, ch);
      }
      img.src = prev;
    }
  }

  mouseEvents(e: any) {
    const bounds = this.canvas.getBoundingClientRect();
    this.mouse.x = e.pageX - bounds.left
    this.mouse.y = e.pageY - bounds.top
    this.mouse.button = e.type === "mousedown" ? true : e.type === "mouseup" ? false : this.mouse.button;
    this.mouse.scrollTop = window.pageYOffset || (document.documentElement || document.body.parentNode || document.body).scrollTop

    if (this.mouse.button) {
      if (!this.mouse.drag) {
        this.mouse.drag = true;
      } else {
      
      }
      if (this.mouse.x >= this.canvas!.getBoundingClientRect().x && this.mouse.x <= this.canvas!.getBoundingClientRect().x + this.canvas!.width) {
        if ((this.mouse.y - this.mouse.scrollTop) >= 0 && (this.mouse.y - this.mouse.scrollTop) <= this.canvas!.height) {
          let actions = {
            roomId: this.currentRoomId!,
            x: this.mouse.x * (2560 / this.canvas!.width),
            y: (this.mouse.y - this.mouse.scrollTop) * (1440 / this.canvas!.height),
            size: this.getSize(),
            color: this.getColors()
          };
          
          this.groupMan.emitDraw(actions);
        }
      }
    } else if (this.mouse.drag) {
      this.mouse.drag = false;
      this.groupMan.shareCanvas(this.currentRoomId);
    }
  }

  getSize() : number {
    let elem = document.getElementById('drawSize') as HTMLInputElement
    return parseInt(elem.value)
  }
  
  getColors() : Color {
    let elem = document.getElementById('colorPick') as HTMLInputElement
    let col = elem.value
    let rCol = col.slice(1, 3);
    let gCol = col.slice(3, 5);
    let bCol = col.slice(5, 7);

    return {r: rCol, g: gCol, b: bCol}
  }
}
