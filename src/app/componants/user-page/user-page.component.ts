import { AfterViewInit, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { User } from 'src/app/models/User';
import { AccountManagerService } from 'src/app/services/account-manager/account-manager.service';
import { SocketManagerService } from 'src/app/services/socket-manager/socket-manager.service';

@Component({
  selector: 'app-user-page',
  templateUrl: './user-page.component.html',
  styleUrls: ['./user-page.component.scss']
})
export class UserPageComponent implements OnInit, AfterViewInit {

  // account: User | null = null;

  constructor(private socketMan: SocketManagerService, private activatedRoute: ActivatedRoute, private accountMan: AccountManagerService) { }

  get account(): User | null {
    return this.accountMan.searchedUser
  }

  get name(): string | null {
    return this.activatedRoute.snapshot.params['name']
  }

  ngOnInit(): void {}

  ngAfterViewInit(): void {
  }

}
