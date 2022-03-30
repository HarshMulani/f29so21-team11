import { Component, InjectionToken, OnInit } from '@angular/core';
import { AccountManagerService } from 'src/app/services/account-manager/account-manager.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  uMatcher = /^[a-zA-Z0-9][a-zA-Z0-9_]{2,29}$/
  eMatcher = /^(\D)+(\w)*((\.(\w)+)?)+@(\D)+(\w)*((\.(\D)+(\w)*)+)?(\.)[a-z]{2,}$/
  pMatcher = /^([a-zA-Z0-9@*#]{8,15})$/

  state = AuthenticatorCompState.LOGIN;
  constructor(private accountMan: AccountManagerService, private router: Router) { }

  ngOnInit(): void {
  }

  Login(user: string, password: string) {
    this.accountMan.login(user, password);
  }

  Signup(user: string, email: string, password: string) {
    if (user.match(this.uMatcher)) {
      if (email.match(this.eMatcher)) {
        if (password.match(this.pMatcher)) {
          this.accountMan.signup(user, password, email);
        } else {
          alert("Password doesn't work")
        }
      } else {
        alert("Email doesn't work")
      }
    } else {
      alert("Username doesn't work")
    }
  }



  onForgotPasswordClick(){
    this.state = AuthenticatorCompState.FORGOT_PASSWORD;
  }

  onCreateAccountClick(){
    this.state = AuthenticatorCompState.REGISTER;
  }

  onLoginClick(){
    this.state = AuthenticatorCompState.LOGIN;
  }



  isLoginState(){
    return this.state == AuthenticatorCompState.LOGIN;
  }

  isRegisterState(){
    return this.state == AuthenticatorCompState.REGISTER;
  }

  isForgotPasswordState(){
    return this.state == AuthenticatorCompState.FORGOT_PASSWORD;
  }
  getStateText(){
    switch(this.state){
      case AuthenticatorCompState.LOGIN:
        return "Login";
      case AuthenticatorCompState.REGISTER:
        return "Create Account";
      case AuthenticatorCompState.FORGOT_PASSWORD:
        return "Forgotten your password?";
    }
  }


}



export enum AuthenticatorCompState{
  LOGIN,
  REGISTER,
  FORGOT_PASSWORD
}
