import { Injectable } from '@angular/core';
import { ActivatedRoute, ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { RoomManagerService } from 'src/app/services/room-manager/room-manager.service';

@Injectable({
  providedIn: 'root'
})
export class RoomIdExistsGuard implements CanActivate {
  
  constructor(private roomMan: RoomManagerService, private router : Router,private activeRoute: ActivatedRoute) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    const id = route.params['id']
    const t = this.roomMan.rooms.find(x => x.id == id) ? true : false;
      if (!t) {
        this.router.navigate([state.url.split('/').slice(0, 2).join('/')]);
      }
    return t;
  }
  

}
