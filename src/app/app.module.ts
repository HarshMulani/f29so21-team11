import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicModule } from '@ionic/angular';


import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { RoomListComponent } from './componants/room-list/room-list.component';

import { SocketIoModule, SocketIoConfig } from 'ngx-socket-io';
import { SocketManagerService } from './services/socket-manager/socket-manager.service';
import { HomePageComponent } from './componants/home-page/home-page.component';
import { ChatScreenLayoutComponent } from './componants/chat-screen-layout/chat-screen-layout.component';
import { ChatWindowComponent } from './componants/chat-window/chat-window.component';
import { RoomManagerService } from './services/room-manager/room-manager.service';
import { AccountManagerService } from './services/account-manager/account-manager.service';
import { WhiteboardComponent } from './componants/whiteboard/whiteboard.component';
import { GroupRoomComponent } from './componants/group-room/group-room.component';
import { GroupManagerService } from './services/group-manager/group-manager.service';
import { WhiteboardManagerService } from './services/whiteboard-manager/whiteboard-manager.service';
import { AccountComponent } from './componants/account/account.component';
import { CreatePostComponent } from './componants/create-post/create-post.component'

import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatBottomSheetModule } from '@angular/material/bottom-sheet';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { OverlayModule } from '@angular/cdk/overlay';
import { AccountPageComponent } from './componants/account-page/account-page.component';
import { LoginComponent } from './componants/login/login.component';
import { LoginTestComponent } from './componants/login-test/login-test.component';
import { UserSearchComponent } from './componants/user-search/user-search.component';
import { UserPageComponent } from './componants/user-page/user-page.component';
import { MatIconModule } from '@angular/material/icon';
import { MatFileUploadModule } from 'angular-material-fileupload';
import { MatDialogModule } from '@angular/material/dialog'

const config: SocketIoConfig = { url: 'https://f29so-project.herokuapp.com', options: {} }

// const config: SocketIoConfig = { url: 'http://localhost:3000', options: {} }

@NgModule({
  declarations: [
    AppComponent,
    RoomListComponent,
    HomePageComponent,
    ChatScreenLayoutComponent,
    ChatWindowComponent,
    WhiteboardComponent,
    GroupRoomComponent,
    AccountComponent,
    AccountPageComponent,
    LoginComponent,
    LoginTestComponent,
    UserSearchComponent,
    UserPageComponent,
    CreatePostComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    IonicModule,
    SocketIoModule.forRoot(config),
    MatInputModule,
    MatFormFieldModule,
    MatCardModule,
    MatButtonModule,
    MatBottomSheetModule,
    BrowserAnimationsModule,
    OverlayModule,
    MatIconModule,
    MatFileUploadModule,
    MatDialogModule
  ],
  providers: [SocketManagerService, RoomManagerService, AccountManagerService, GroupManagerService, WhiteboardManagerService],
  bootstrap: [AppComponent]
})
export class AppModule { }
