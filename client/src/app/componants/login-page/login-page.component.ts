import { Component, OnInit } from '@angular/core';
import { AccountManagerService } from 'src/app/services/account-manager/account-manager.service';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.scss']
})
export class LoginPageComponent implements OnInit {

  constructor(private accountMan : AccountManagerService) { }

  login(uName: string, pWord: string, email: string) {
    this.accountMan.login(uName, pWord, email);
  }

  signup(uName: string, pWord: string, email: string) {
    this.accountMan.signup(uName, pWord, email)
  }

  deleteUsers() {
    this.accountMan.deleteUsers();
  }

  ngOnInit(): void {
  }

}
