import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { windowWhen } from 'rxjs';
import { SocketManagerService } from 'src/app/services/socket-manager/socket-manager.service';
import { CreatePostComponent } from '../create-post/create-post.component';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss']
})
export class HomePageComponent implements OnInit, AfterViewInit, OnDestroy {

  pictures : Array<{ id: string, uploadTime: string, caption: string, img: string, uploader: string }> = [];

  events: any = {};

  constructor(private socketMan: SocketManagerService, private dialog: MatDialog) { }

  ngOnDestroy(): void {
    document.removeEventListener('scroll', this.events['scroll'], false)
  }

  ngOnInit(): void {
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

  ngAfterViewInit(): void {
    this.socketMan.subscribeToEvent('image-list-update', (data: Array<{ id: string, uploadTime: string, caption: string, img: string, uploader: string }>) => {
      // this.pictures = [];
      // console.log(data.length)
      for (var i = 0; i < data.length; i++) {
        setTimeout(() => {
          let d1 = data.shift();
          if (d1) {
          let img = new Image;
          img.onload = () => {
            let can = document.createElement('canvas') as HTMLCanvasElement;
            
              if (window.innerWidth <= 1000) {
                console.log("making small")
                can.setAttribute('width', (window.innerWidth - 10).toString())
                can.setAttribute('height', (window.innerWidth - 10).toString())
                let ctx = can.getContext('2d')
                ctx!.drawImage(img, 0, 0, window.innerWidth - 10, window.innerWidth - 10)
              } else {
                can.setAttribute('width', '1000')
                can.setAttribute('height', '1000')
                let ctx = can.getContext('2d')
                ctx!.drawImage(img, 0, 0, 1000, 1000)
              }
              
              if (!this.pictures.find((picture) => picture.id == d1!.id)) {
                console.log("Caption: " + d1!.caption, "Adding picture with url: ", can.toDataURL())
                this.pictures.unshift({ id: d1!.id, uploadTime: d1!.uploadTime, caption: d1!.caption, img: can.toDataURL(), uploader: d1!.uploader });
              }
          }
          img.src = d1!.img;
          // console.log(d1!.img)
        }
        }, i * 100)
      }
    })
    let id = setInterval(() => {
      if(window.scrollY==0){
        this.Read()
      }
    }, 10000);
  }

  Upload () {
    this.dialog.open(CreatePostComponent);
    document.getElementsByClassName('to-hide')[0].scrollTo(0, 0)
    // let reader = new FileReader();
    // let input = document.getElementById('image') as HTMLInputElement;
    // let file = input.files![0];

    // let cap = prompt("Add Caption", "caption")

    // reader.addEventListener('load', (e) => {
    //   console.log("adding 1 to posts")
    //   this.socketMan.emitEvent('create-image', {img: reader.result, owner: localStorage.getItem('login-token'), caption: cap, uploader: localStorage.getItem('login-token')});
    //   this.socketMan.emitEvent('update-user-stats', {name: localStorage.getItem('login-token'), stat: 'posts'})
    //   console.log(reader.result)
    // })
    // reader.readAsDataURL(file);
  }

  Read() {
    this.socketMan.emitEvent('get-all-image', null);
    // console.log(this.pictures.length)
  }
}
