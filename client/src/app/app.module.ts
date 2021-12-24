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
const config: SocketIoConfig = { url: 'http://localhost:3000', options: {} }

@NgModule({
  declarations: [
    AppComponent,
    RoomListComponent,
    HomePageComponent,
    ChatScreenLayoutComponent,
    ChatWindowComponent,
    LoginPageComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    SocketIoModule.forRoot(config)
  ],
  providers: [SocketManagerService, RoomManagerService],
  bootstrap: [AppComponent]
})
export class AppModule { }
