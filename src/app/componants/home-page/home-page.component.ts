import { AfterViewInit, Component, OnInit } from '@angular/core';
import { SocketManagerService } from 'src/app/services/socket-manager/socket-manager.service';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss']
})
export class HomePageComponent implements OnInit, AfterViewInit {

  pictures : Array<{id: string, uploadTime: Date, img: string}> = [];

  constructor(private socketMan: SocketManagerService) { }

  ngOnInit(): void {
    let can = document.createElement('canvas') as HTMLCanvasElement
    if (window.innerWidth < 500) {
      can.setAttribute('width', (window.innerWidth - 10).toString())
      can.setAttribute('height', (window.innerWidth - 10).toString())
      let ctx = can.getContext('2d')
      ctx!.beginPath()
      ctx!.fillStyle = "#ffffff"
      ctx!.rect(0, 0, window.innerWidth, window.innerWidth)
      ctx!.fill()
      ctx!.closePath()

      ctx!.beginPath()
      ctx!.fillStyle = "#ff00ff"
      ctx!.rect(10, 10, 100, 100)
      ctx!.fill()
      ctx!.closePath()

    } else {
      can.setAttribute('width', '500')
      can.setAttribute('height', '500')
      let ctx = can.getContext('2d')
      ctx!.beginPath()
      ctx!.fillStyle = "#ffffff"
      ctx!.rect(0, 0, 500, 500)
      ctx!.fill()
      ctx!.closePath()

      ctx!.beginPath()
      ctx!.fillStyle = "#ff00ff"
      ctx!.rect(10, 10, 100, 100)
      ctx!.fill()
      ctx!.closePath()

    }
    
    this.pictures.push({id: "1", uploadTime: new Date(), img: can.toDataURL()});
    this.pictures.push({id: "2", uploadTime: new Date(), img: can.toDataURL()});
    this.pictures.push({id: "3", uploadTime: new Date(), img: can.toDataURL()});
  }

  ngAfterViewInit(): void {

  }

  Upload () {
    let reader = new FileReader();
    reader.addEventListener('load', (e) => {
      this.socketMan.emitEvent('create-image', e.target!.result);
    })
  }


}
