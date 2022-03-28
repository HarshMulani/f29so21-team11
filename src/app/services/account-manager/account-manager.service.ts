import { Injectable, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { User } from 'src/app/models/User';
import { SocketManagerService } from '../socket-manager/socket-manager.service';

@Injectable({
  providedIn: 'root'
})
export class AccountManagerService implements OnInit {

  account : User | null = null;

  listeners : boolean = false;

  constructor(private socketMan: SocketManagerService, private router: Router) { }

  login(uName: string, pWord: string) {
    console.log(this.listeners)
    if (!this.listeners) {
      this.setupListeners();
      this.listeners = true;
    }
    console.log(uName, pWord)
    let account = { username: uName, password: pWord };
    this.socketMan.emitEvent('user-login', account);
  }

  signup(uName: string, pWord: string, eMail: string) {
    console.log(this.listeners)
    if (!this.listeners) {
      this.setupListeners();
      this.listeners = true;
    }
    console.log(uName, pWord, eMail)
    let account = { username: uName, password: pWord, email: eMail };
    this.socketMan.emitEvent('create-user', account);
    setTimeout(() => {
      this.socketMan.emitEvent('user-login', account);
    }, 50);
  }

  deleteUsers() {
    this.socketMan.emitEvent('delete-user', this.account?.username);
  }

  setupListeners() {
    this.socketMan.subscribeToEvent('update-stats', (account) => {
      this.account = account;
      console.log('Adding one to stats')
    })

    this.socketMan.subscribeToEvent('user-log-in', (account) => {
      this.account = account; 
      console.log(this.account, 'Successfully logged in'); 
      alert('Successfully logged in'); 

      localStorage.setItem('login-token', account.username);

      const today = new Date()
      const tomorrow = new Date(today)
      tomorrow.setDate(tomorrow.getDate() + 1)

      localStorage.setItem('auth-token', tomorrow.getTime().toString())
      this.router.navigateByUrl('/account')
    });

    this.socketMan.subscribeToEvent('user-log-in-failed', () => {
      console.log('Failed to log in'); 
      alert('Failed to log in, please try again')
    });
  }

  ngOnInit(): void {
  }

}
