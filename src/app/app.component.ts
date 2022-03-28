import { AfterViewInit, Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SocketManagerService } from './services/socket-manager/socket-manager.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss', './app2.component.scss', './app-small.component.scss', './app-small2.component.scss']
})
export class AppComponent implements AfterViewInit {
  title = 'f29so-Project';

  tab = ['', 'company', 'home', 'chat', 'whiteboard', 'account']

  currentMode = -1;

  constructor(private socketMan: SocketManagerService, private router: Router, private activeRoute: ActivatedRoute) { this.currentMode = -1; this.changeMode() }


  ngAfterViewInit(): void {

    // setTimeout(() => {
    //   if (localStorage.getItem('login-token')) {
    //     this.socketMan.emitEvent('get-personal-user', localStorage.getItem('login-token'))
    //   }
    // }, 10000);

    if (!localStorage.getItem('auth-token')) {
      console.log(this.router.url)
      // this.router.navigate(['/account'], { relativeTo: this.activeRoute });
      this.router.navigateByUrl('/account/login')
      this.activeLink(5)
      return;
    }

    this.activeLink(this.tab.indexOf(window.location.href.split('/')[3]));

  }

  activeLink(id: number) {
    let list = document.getElementsByClassName('item');
    for (var i = 0; i < list.length; i++) {
      list[i].classList.remove('active')
    }
    console.log(id)
    let item = document.getElementById(id.toString());
    item!.classList.add('active');
  }

  changeMode() {
    if (this.currentMode > 0) {
      document.documentElement.style.setProperty('--bgc', '#3a445d');
      document.documentElement.style.setProperty('--cbgc', '#5e5768');
    } else {
      document.documentElement.style.setProperty('--bgc', '#F4FFF8');
      document.documentElement.style.setProperty('--cbgc', '#FFE499');
    }

    this.currentMode *= -1;
  }
}
