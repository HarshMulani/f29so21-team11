import { Component, OnInit } from '@angular/core';
import { AccountManagerService } from 'src/app/services/account-manager/account-manager.service';

@Component({
  selector: 'app-signup-page',
  templateUrl: './signup-page.component.html',
  styleUrls: ['./signup-page.component.scss']
})
export class SignUpPageComponent {

  constructor(private accountMan : AccountManagerService) { }

  signup(user: string, email: string, password: string) {
    this.accountMan.createUser(user, email, password);
  }

  deleteUsers() {
    this.accountMan.deleteUsers();
  }

  

}