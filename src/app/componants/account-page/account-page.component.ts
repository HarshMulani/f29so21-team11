import { unescapeIdentifier } from '@angular/compiler';
import { AfterViewInit, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { retry } from 'rxjs';
import { User } from 'src/app/models/User';
import { AccountManagerService } from 'src/app/services/account-manager/account-manager.service';
import { SocketManagerService } from 'src/app/services/socket-manager/socket-manager.service';

@Component({
  selector: 'app-account-page',
  templateUrl: './account-page.component.html',
  styleUrls: ['./account-page.component.scss']
})
export class AccountPageComponent implements OnInit, AfterViewInit {

  isOpen = false;
  
  constructor(private socketMan: SocketManagerService, private accountMan: AccountManagerService, private router: Router) { }

  get username() : string {
    return localStorage.getItem('login-token')!;
  }

  get accountStats(): {posts: number, groups: number, chats: number} {
    // if (this.accountMan.account == null) {this.socketMan.emitEvent('get-personal-user', localStorage.getItem('login-token'))}
    return this.accountMan.account!.stats!;
  }

  get account(): User | null {
    return this.accountMan.account
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

  id: any;
  ngAfterViewInit(): void {
    if (!this.id) {
      this.id = setInterval(() => {
        console.log("checking for account")
        if (!this.account && localStorage.getItem('login-token')) {
          this.socketMan.emitEvent('get-personal-user', localStorage.getItem('login-token'))
        } else {
          clearInterval(this.id);
        }
      }, 1000);   
    }

    this.socketMan.subscribeToEvent('get-user', (account) => {
      console.log("updating account")
      this.accountMan.account = account
    })
  }

  logout() {
    localStorage.removeItem('login-token')
    localStorage.removeItem('auth-token')
    this.router.navigateByUrl('account/login')
  }

  editBio() {
    let newbio = prompt("enter new bio");
    this.accountMan.account!.bio = newbio!
    this.socketMan.emitEvent('update-user', this.accountMan.account)
  }
}
