import { Component } from '@angular/core';

@Component({
  selector: 'app-explore',
  templateUrl: './explore.component.html',
  styleUrls: ['./explore.component.css'],
})
export class ExploreComponent {
  trending = ['#ByeTwitter', '#WorldCup2022', '#SomethingElse'];
  suggested = ['@userA', '@userB', '@userC'];

  constructor() {}
  ngOnInit() {}
}
