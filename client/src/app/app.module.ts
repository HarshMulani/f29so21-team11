import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { RoomListComponent } from './componants/room-list/room-list.component';

import { SocketIoModule, SocketIoConfig } from 'ngx-socket-io';
import { SocketManagerService } from './services/socket-manager/socket-manager.service';
import { HomePageComponent } from './componants/home-page/home-page.component';
import { ChatScreenLayoutComponent } from './componants/chat-screen-layout/chat-screen-layout.component';
import { ChatWindowComponent } from './componants/chat-window/chat-window.component';
import { LoginPageComponent } from './componants/login-page/login-page.component';
import { RoomManagerService } from './services/room-manager/room-manager.service';
import { AccountManagerService } from './services/account-manager/account-manager.service';
import { WhiteboardComponent } from './componants/whiteboard/whiteboard.component';
import { GroupRoomComponent } from './componants/group-room/group-room.component';
import { GroupManagerService } from './services/group-manager/group-manager.service';
import { WhiteboardManagerService } from './services/whiteboard-manager/whiteboard-manager.service';
// const config: SocketIoConfig = { url: 'http://localhost:3000', options: {} }
// const config: SocketIoConfig = { url: 'https://f29so-project.herokuapp.com:3000', options: {} }

// let hostname = window.location.hostname;
// let url = ( hostname === 'localhost' ) ? `${window.location.protocol}//${hostname}:3000` : undefined;
// const config: SocketIoConfig = { url: url!, options: {} };

let port = ( window.location.hostname === 'localhost' ) ? ':3000' : '';
let url = `${window.location.protocol}//${window.location.hostname}${port}`;
const config: SocketIoConfig = { url: url, options: {} };
@NgModule({
  declarations: [
    AppComponent,
    RoomListComponent,
    HomePageComponent,
    ChatScreenLayoutComponent,
    ChatWindowComponent,
    LoginPageComponent,
    WhiteboardComponent,
    GroupRoomComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    SocketIoModule.forRoot(config)
  ],
  providers: [SocketManagerService, RoomManagerService, AccountManagerService, GroupManagerService, WhiteboardManagerService],
  bootstrap: [AppComponent]
})
export class AppModule { }
