import { AfterViewInit, Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss']
})
export class HomePageComponent implements OnInit, AfterViewInit {

  pictures : Array<{id: string, uploadTime: Date, img: string}> = [];

  constructor() { }

  ngOnInit(): void {
    let can = document.createElement('canvas') as HTMLCanvasElement
    can.width = 500
    can.height = 500
    let ctx = can.getContext('2d')
    ctx!.beginPath()
    ctx!.fillStyle = "#ffffff"
    ctx!.rect(0, 0, 500, 500)
    ctx!.fill()
    ctx!.closePath()
    // ctx!.stroke()

    ctx!.beginPath()
    ctx!.fillStyle = "#ff00ff"
    ctx!.rect(100, 100, 300, 300)
    ctx!.fill()
    ctx!.closePath()
    // ctx!.stroke()
    this.pictures.push({id: "1", uploadTime: new Date(), img: can.toDataURL()});
    this.pictures.push({id: "2", uploadTime: new Date(), img: can.toDataURL()});
    this.pictures.push({id: "3", uploadTime: new Date(), img: can.toDataURL()});
  }

  ngAfterViewInit(): void {
    
  }

}
