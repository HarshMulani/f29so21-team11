import { Component, Injector, OnInit } from '@angular/core';
import { AccountManagerService } from 'src/app/services/account-manager/account-manager.service';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.scss', './login-page-small.component.scss']
})
export class LoginPageComponent {

  constructor(private accountMan : AccountManagerService) { }

  login(user: string, password: string) {
    this.accountMan.login(user, password);
  }

  deleteUsers() {
    this.accountMan.deleteUsers();
  }
}
