import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-chat-screen-layout',
  templateUrl: './chat-screen-layout.component.html',
  styleUrls: ['./chat-screen-layout.component.scss']
})
export class ChatScreenLayoutComponent implements OnInit {

  constructor() { }

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

}
