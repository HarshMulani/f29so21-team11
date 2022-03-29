import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { User } from 'src/app/models/User';
import { AccountManagerService } from 'src/app/services/account-manager/account-manager.service';
import { SocketManagerService } from 'src/app/services/socket-manager/socket-manager.service';

@Component({
  selector: 'app-user-search',
  templateUrl: './user-search.component.html',
  styleUrls: ['./user-search.component.scss']
})
export class UserSearchComponent implements OnInit {

  // user: User | null = null;

  constructor(private socketMan: SocketManagerService, private router: Router, private activeRoute: ActivatedRoute, private accountMan: AccountManagerService) { }

  get user(): User | null {
    return this.accountMan.searchedUser
  }
  ngOnInit(): void {
    this.socketMan.subscribeToEvent('get-user', (user) => {
      this.accountMan.searchedUser = user
      this.router.navigate([user.username], {relativeTo: this.activeRoute})
    })

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

  search() {
    let search = document.getElementById('search-box') as HTMLInputElement
    this.router.navigateByUrl('/users')
    this.socketMan.emitEvent('get-personal-user', search.value)
  }
}
