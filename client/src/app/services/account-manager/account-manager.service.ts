import { Injectable, OnInit } from '@angular/core';
import { User } from 'src/app/models/User';
import { SocketManagerService } from '../socket-manager/socket-manager.service';

@Injectable({
  providedIn: 'root'
})
export class AccountManagerService implements OnInit {

  account : User | null = null;

  constructor(private socketMan: SocketManagerService) { }

  login(uName: string, pWord: string, email: string) {
    this.setupListeners();
    let account = { username: uName, password: pWord, email: email };
    this.socketMan.emitEvent('user-login', account);
  }

  signup(uName: string, pWord: string, email: string) {
    this.setupListeners();
    let account = { username: uName, password: pWord, email: email };
    this.socketMan.emitEvent('create-user', account);

  }

  deleteUsers() {
    this.socketMan.emitEvent('delete-user', this.account?.username);
  }

  setupListeners() {
    this.socketMan.subscribeToEvent('user-log-in', (account) => {this.account = account; console.log(this.account, 'Successfully logged in'); alert('Successfully logged in')});
    this.socketMan.subscribeToEvent('user-log-in-failed', () => {console.log('Failed to log in'); alert('Failed to log in, please try again')});
  }

  ngOnInit(): void {
    
  }

}
