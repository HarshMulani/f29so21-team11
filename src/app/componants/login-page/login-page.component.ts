import { Component, OnInit } from '@angular/core';
import { AccountManagerService } from 'src/app/services/account-manager/account-manager.service';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.scss', './login-page-small.component.scss']
})
export class LoginPageComponent implements OnInit {

  constructor(private accountMan : AccountManagerService) { }

  login(uName: string, pWord: string, eMail: string) {
    this.accountMan.login(uName, pWord, eMail);
  }

  signup(uName: string, pWord: string, eMail: string) {
    this.accountMan.signup(uName, pWord, eMail)
  }

  deleteUsers() {
    this.accountMan.deleteUsers();
  }

  ngOnInit(): void {
  }

}
