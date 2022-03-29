import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { SocketManagerService } from 'src/app/services/socket-manager/socket-manager.service';

@Injectable({
  providedIn: 'root'
})
export class UserExistsGuard implements CanActivate {

  exists: boolean = false;
  count: number = 0;
  constructor(private socketMan: SocketManagerService, private router : Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

    const name = route.params['name']
    this.socketMan.subscribeToEvent('get-user', (user) => {
      if (user) {
        this.exists = true;
      }
    })
    this.socketMan.emitEvent('get-personal-user', name)
    
    if (!this.exists) {
      this.router.navigate([state.url.split('/').slice(0, 2).join('/')]);
    }

    let id = setInterval(() => {
      this.count++
    }, 500)

    while (this.exists == false) {
      if (this.count > 2) {
        clearInterval(id)
        break
      }
    }
    return this.exists
  }
}
