import { AfterViewInit, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss']
})
export class AccountComponent implements OnInit, AfterViewInit {

  constructor(private router: Router, private activeRoute: ActivatedRoute) { }

  ngAfterViewInit(): void {
    let date = localStorage.getItem('auth-token')
    let currDate = new Date().getTime().toString();
    
    // console.log(date, currDate)
    if (date) {
      if (date > currDate) {
        return;
      }
    }
    this.router.navigateByUrl('/account/login')
    // this.router.navigate(['/login'], { relativeTo: this.activeRoute })
    console.log(this.router.url)
  }

  ngOnInit(): void {
  }

}
