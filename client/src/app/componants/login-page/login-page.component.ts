import { Component, OnInit } from '@angular/core';
import { SocketManagerService } from 'src/app/services/socket-manager/socket-manager.service';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.scss']
})
export class LoginPageComponent implements OnInit {

  constructor(private socketMan: SocketManagerService) { }

  login(uName: string, pWord: string) {
    let account = { username: uName, password: pWord };
    this.socketMan.emitEvent('login', account);
  }

  signup(uName: string, pWord: string) {
    let account = { username: uName, password: pWord };
    this.socketMan.emitEvent('account-created', account);
  }

  deleteUsers() {
    this.socketMan.emitEvent('clear-users', null);
  }

  ngOnInit(): void {
  }

}
