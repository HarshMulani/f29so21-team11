import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomePageComponent } from './componants/home-page/home-page.component';
import { ChatScreenLayoutComponent } from './componants/chat-screen-layout/chat-screen-layout.component';
import { ChatWindowComponent } from './componants/chat-window/chat-window.component';
import { RoomIdExistsGuard } from './guards/room-id-exists/room-id-exists.guard';
import { WhiteboardComponent } from './componants/whiteboard/whiteboard.component';
import { GroupRoomComponent } from './componants/group-room/group-room.component';
import { AccountComponent } from './componants/account/account.component';
import { AccountPageComponent } from './componants/account-page/account-page.component';
import { LoginComponent } from './componants/login/login.component';
import { LoginTestComponent } from './componants/login-test/login-test.component';
import { UserSearchComponent } from './componants/user-search/user-search.component';
import { UserPageComponent } from './componants/user-page/user-page.component';
import { UserExistsGuard } from './guards/user-exists/user-exists.guard';

const routes: Routes = [
  {
    path: 'account',
    component: AccountComponent,
    children: [{path: '', component: AccountPageComponent}, {path:'login', component: LoginTestComponent}]
  },
  {
    path: 'whiteboard',
    component: GroupRoomComponent,
    children: [{ path: ':id', component: WhiteboardComponent, canActivate: [RoomIdExistsGuard] }],
  },
  {
    path: 'home',
    component: HomePageComponent,
  },
  {
    path: 'chat',
    component: ChatScreenLayoutComponent,
    children: [{ path: ':id', component: ChatWindowComponent, canActivate: [RoomIdExistsGuard] }],
  },
  {
    path: 'users',
    component: UserSearchComponent,
    children: [{ path: ':name', component: UserPageComponent }]
  },
  {
    path: '**',
    redirectTo: 'home',
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

/*


 */