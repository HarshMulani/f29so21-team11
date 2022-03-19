import { AfterViewInit, Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss', './app2.component.scss', './app-small.component.scss', './app-small2.component.scss']
})
export class AppComponent implements AfterViewInit {
  title = 'f29so-Project';

  tab = ['', 'company', 'home', 'chat', 'whiteboard', 'login']

  currentMode = -1;

  constructor(private router: Router, private activeRoute: ActivatedRoute) { this.changeMode() }


  ngAfterViewInit(): void {
    this.activeLink(this.tab.indexOf('login'));
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
      document.documentElement.style.setProperty('--bgc', 'beige');
      document.documentElement.style.setProperty('--cbgc', '#a8f0e6');
    }

    this.currentMode *= -1;
  }
}
