import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomePageComponent } from './componants/home-page/home-page.component';
import { RoomListComponent } from './componants/room-list/room-list.component';
import { ChatScreenLayoutComponent } from './componants/chat-screen-layout/chat-screen-layout.component';
import { ChatWindowComponent } from './componants/chat-window/chat-window.component';
import { LoginPageComponent } from './componants/login-page/login-page.component';
import { RoomIdExistsGuard } from './guards/room-id-exists/room-id-exists.guard';

const routes: Routes = [
  {
    path: '',
    component: HomePageComponent,
    children: [{
      path: '',
      component: RoomListComponent
    }]
  },
  {
    path: 'chat',
    component: ChatScreenLayoutComponent,
    children: [{ path: ':id', component: ChatWindowComponent, canActivate: [RoomIdExistsGuard]}],
  },
  {
    path: 'login',
    component: LoginPageComponent
  },
  {
    path: '**',
    redirectTo: '',
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
