import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatCardModule} from '@angular/material/card';
import {MatButtonModule} from '@angular/material/button';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { RoomListComponent } from './componants/room-list/room-list.component';

import { SocketIoModule, SocketIoConfig } from 'ngx-socket-io';
import { SocketManagerService } from './services/socket-manager/socket-manager.service';
import { HomePageComponent } from './componants/home-page/home-page.component';
import { ChatScreenLayoutComponent } from './componants/chat-screen-layout/chat-screen-layout.component';
import { ChatWindowComponent } from './componants/chat-window/chat-window.component';
import { LoginComponent } from './auth/login/login.component';
import { RoomManagerService } from './services/room-manager/room-manager.service';
import { AccountManagerService } from './services/account-manager/account-manager.service';
import { WhiteboardComponent } from './componants/whiteboard/whiteboard.component';
import { GroupRoomComponent } from './componants/group-room/group-room.component';
import { GroupManagerService } from './services/group-manager/group-manager.service';
import { WhiteboardManagerService } from './services/whiteboard-manager/whiteboard-manager.service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

const config: SocketIoConfig = { url: 'https://f29so-project.herokuapp.com', options: {} }

@NgModule({
  declarations: [
    AppComponent,
    RoomListComponent,
    HomePageComponent,
    ChatScreenLayoutComponent,
    ChatWindowComponent,  
    WhiteboardComponent,
    GroupRoomComponent,
    LoginComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    SocketIoModule.forRoot(config),
    BrowserAnimationsModule
  ],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
  providers: [SocketManagerService, RoomManagerService, AccountManagerService, GroupManagerService, WhiteboardManagerService],
  bootstrap: [AppComponent]
})
export class AppModule { }
