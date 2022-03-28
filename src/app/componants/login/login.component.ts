import { Component, InjectionToken, OnInit } from '@angular/core';
import { Overlay, OverlayConfig, OverlayRef } from '@angular/cdk/overlay';
import { LoginPageComponent } from '../login-page/login-page.component';
import { SignUpPageComponent } from '../signup-page/signup-page.component';
import { ComponentPortal } from '@angular/cdk/portal';
import { AccountManagerService } from 'src/app/services/account-manager/account-manager.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  state = AuthenticatorCompState.LOGIN;
  constructor(private accountMan: AccountManagerService, private router: Router) { }

  ngOnInit(): void {
  }

  Login(user: string, password: string) {
    this.accountMan.login(user, password);
  }

  Signup(user: string, email: string, password: string) {
    this.accountMan.signup(user, password, email);
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
