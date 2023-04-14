import { Component, Input, OnInit } from '@angular/core';
import { UserAccount } from '../services/account.service';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.css'],
})
export class NavigationComponent implements OnInit {
  @Input() userAccount: UserAccount;

  constructor() {}

  ngOnInit() {}
}
