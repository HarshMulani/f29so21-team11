import { Injectable } from '@angular/core';
import { User } from 'src/app/models/User';

@Injectable({
  providedIn: 'root'
})
export class AccountManagerService {

  account : User | null = null;

  constructor() { }


}
