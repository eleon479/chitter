import { Component, OnInit } from '@angular/core';
import {
  AccountAction,
  AccountEvent,
  AccountService,
  EmptySession,
  UserAccount,
} from './services/account.service';
import {
  TimelineEvent,
  TimelineService,
  UserTimeline,
} from './services/timeline.service';
import { Subject, Subscriber, Subscription } from 'rxjs';

/*
  - 1. commit changes
  - 2. add routes (login, home)
*/

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  userAccount: UserAccount = EmptySession;
  isAccountLoading: boolean = true;

  userTimeline: UserTimeline = {} as UserTimeline;
  isTimelineLoading: boolean = true;
  isUserTweetsLoading: boolean = true; // check if this is necessary

  constructor(
    private accountService: AccountService,
    private timelineService: TimelineService
  ) {
    this.timelineService = new TimelineService(accountService);
    //let logConstructor = () => {
    // console.debug('AppComponent.constructor():');
    // console.debug('-userAccount', this.userAccount);
    // console.debug('--userAccount.loggedIn', this.userAccount.loggedIn);
    // console.debug('-isAccountLoading', this.isAccountLoading);
    // console.debug('-userTimeline', this.userTimeline);
    // console.debug('-isTimelineLoading', this.isTimelineLoading);
    // console.debug('-isUserTweetsLoading', this.isUserTweetsLoading);
    //};

    // logConstructor();
  }

  ngOnInit() {
    // const sessionEventSubscription$ =
    this.userAccount = EmptySession;
    // const handler = this.handleAccountEvents.bind(this);
    // this.accountService.getSessionEvents(this.handleAccountEvents);
    this.accountService.onSessionEvent((event: AccountEvent) => {
      this.handleAccountEvents(event);

      // remove
      this.onLoginClick();
    });

    //.subscribe({
    // next: (event) => {
    //   console.log('ngOnInit() sessionSubscription -> next(): ', event);
    //   this.handleAccountEvents(event);
    //   this.accountService.actionHandler({
    //     source: 'client',
    //     type: 'init',
    //     data:
    //   });
    // },
    // error: (err) => {
    //   console.error('ngOnInit() sessionSubscription -> error: ', err);
    // },
    // complete: () => {
    //   console.log('ngOnInit() sessionSubscription -> complete');
    // },
    // });

    // this.accountService.loadSession();
    // this.accountService.accountEvents$.subscribe((event) => {
    // this.handleAccountEvents(event);
    // });

    // @todo profile updates
    // this.timelineService.loadFeed();
    // this.timelineService.timelineEvents$.subscribe((event) => {
    // this.handleTimelineEvents(event);
    // });
  }

  onLoginClick() {
    this.dispatchAction({
      type: 'login',
      source: 'client',
      data: {
        identifier: 'viberisk.bsky.social',
        password: '2907189el',
      },
    });
  }

  dispatchAction(action: AccountAction) {
    this.accountService.actionHandler(action);
  }

  handleAccountEvents(event: AccountEvent) {
    const loggedInEvents = ['load', 'login', 'switch'];
    const loggedOutEvents = ['empty', 'logout', 'expire', 'error'];

    if (loggedInEvents.includes(event.type)) {
      this.isAccountLoading = false;
      this.userAccount = {
        name: event.data.name,
        service: event.data.service,
        session: event.data.session,
        loggedIn: event.data.loggedIn,
      };
    } else if (loggedOutEvents.includes(event.type)) {
      this.isAccountLoading = false;
      this.userAccount = {
        session: null,
        name: '',
        service: '',
        loggedIn: false,
      };
    }
  }

  handleTimelineEvents(event: TimelineEvent) {
    this.userTimeline = event.data;
    switch (event.type) {
      case 'empty':
        this.isTimelineLoading = true;
        this.isUserTweetsLoading = true;
        break;
      case 'load':
        this.isTimelineLoading = false;
        this.isUserTweetsLoading = false;
        break;
      case 'update':
        this.isTimelineLoading = false;
        this.isUserTweetsLoading = false;
        break;
      case 'error':
        this.isTimelineLoading = true;
        this.isUserTweetsLoading = true;
        break;
    }
  }
}
