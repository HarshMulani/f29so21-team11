import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Router } from "@angular/router";
import { Subject } from "rxjs";
import { authModel } from "./auth-model";
// import { UserSocket } from "server/src/app/user-socket";
import { v4 as uuidv4 } from 'uuid';
import { authLoginModel } from "./auth-login-model";
import { SocketManagerService } from "../services/socket-manager/socket-manager.service";

@Injectable({ providedIn: "root" })
export class AuthService {
  private isAuthenticated = false;
  private token!: string | null;
  private tokenTimer: any;
  private authStatusListener = new Subject<boolean>();
  

  constructor(private http: HttpClient, private router: Router, private socketManager: SocketManagerService) {}

  getToken() {
    return this.token;
  }

  getIsAuth() {
    return this.isAuthenticated;
  }

  getAuthStatusListener() {
    return this.authStatusListener.asObservable();
  }

  createUser(user: string, email: string, password: string) {
    //this.socketManager.emitEvent(https://f29soproject.herokuapp.com/login");
    console.log(user);
    //console.log(inputAuthModel.id);
  }

  login(user: string, password: string) {
    const inputLogin: authLoginModel = {username: user, password: password};
    this.http
      .post<{ token: string; expiresIn: number }>(
        "https://f29so-project.herokuapp.com/login",
        inputLogin
      )
      .subscribe(response => {
        const token = response.token;
        this.token = token;
        if (token) {
          const expiresInDuration = response.expiresIn;
          this.setAuthTimer(expiresInDuration);
          this.isAuthenticated = true;
          this.authStatusListener.next(true);
          const currentTime = new Date();
          const expirationDate = new Date(currentTime.getTime() + expiresInDuration * 1000);
          console.log(expirationDate);
          this.saveAuthData(token, expirationDate);
          this.router.navigate(["/"]);
        }
      });
  }

  autoAuthUser() {
    const authInformation = this.getAuthData();
    if (!authInformation) {
      return;
    }
    const now = new Date();
    const expiresIn = authInformation.expirationDate.getTime() - now.getTime();
    if (expiresIn > 0) {
      this.token = authInformation.token;
      this.isAuthenticated = true;
      this.setAuthTimer(expiresIn / 1000);
      this.authStatusListener.next(true);
    }
  }

  logout() {
    this.token = null;
    this.isAuthenticated = false;
    this.authStatusListener.next(false);
    clearTimeout(this.tokenTimer);
    this.clearAuthData();
    this.router.navigate(["/"]);
  }

  private setAuthTimer(duration: number) {
    console.log("Setting timer: " + duration);
    this.tokenTimer = setTimeout(() => {
      this.logout();
    }, duration * 1000);
  }

  private saveAuthData(token: string, expirationDate: Date) {
    localStorage.setItem("token", token);
    localStorage.setItem("expiration", expirationDate.toISOString());
  }

  private clearAuthData() {
    localStorage.removeItem("token");
    localStorage.removeItem("expiration");
  }

  private getAuthData() {
    const token = localStorage.getItem("token");
    const expirationDate = localStorage.getItem("expiration");
    if (!token || !expirationDate) {
      return;
    }
    return {
      token: token,
      expirationDate: new Date(expirationDate)
    }
  }
}
