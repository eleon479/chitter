import { EventEmitter, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AccountEvent, AccountService, UserAccount } from './account.service';

export type UserTimeline = {
  posts: any[];
  isLoading: boolean;
};

export type TimelineEvent = {
  type: 'empty' | 'load' | 'update' | 'error';
  data: UserTimeline;
};

@Injectable({ providedIn: 'root' })
export class TimelineService {
  private timeline: UserTimeline;
  public readonly timeline$: Observable<UserTimeline>;
  public readonly timelineEvents$: EventEmitter<TimelineEvent>;

  constructor(private accountService: AccountService) {
    this.accountService = accountService;
    this.timeline = {} as UserTimeline;
    this.timeline$ = new Observable<UserTimeline>();
    this.timelineEvents$ = new EventEmitter<TimelineEvent>();
  }

  loadFeed() {
    this.timeline.isLoading = true;
    this.timeline.posts = [];

    this.timelineEvents$.emit({
      type: 'empty',
      data: {
        posts: this.timeline.posts,
        isLoading: true,
      },
    });

    // listen for account events
    this.accountService.accountEvents$.subscribe(this.handleAccountEvent);
  }

  handleAccountEvent(event: AccountEvent) {
    if (event.type === 'switch') {
      this.stopFeed(event.data);
    }

    const startEvents = ['load', 'login', 'switch'];
    const stopEvents = ['empty', 'logout', 'expire', 'error'];

    if (stopEvents.includes(event.type)) this.stopFeed(event.data);
    else if (startEvents.includes(event.type)) this.startFeed(event.data);
    else console.warn('Unhandled account event', event);
  }

  startFeed(account: UserAccount) {
    console.debug('startFeed()');

    // listen for new posts
    this.addPostToFeed('A');
    this.addPostToFeed('B');
    this.addPostToFeed('C');
    setTimeout(() => this.addPostToFeed('D'), 3000);
    setTimeout(() => this.addPostToFeed('E'), 1000);
  }

  stopFeed(account) {
    console.debug(`stopFeed(${account})`);

    // 1. stop listening for new posts

    // 2. clear feed
    this.resetFeed();
  }

  resetFeed() {
    this.timeline.posts = [];
    this.timeline.isLoading = false;
    this.timelineEvents$.emit({
      type: 'empty',
      data: {
        posts: this.timeline.posts,
        isLoading: true,
      },
    });
  }

  addPostToFeed(post: string) {
    console.debug(`addPostToFeed(${post})`);
    this.timeline.posts.push(post);
    this.timelineEvents$.emit({
      type: 'update',
      data: {
        posts: this.timeline.posts,
        isLoading: false,
      },
    });
  }

  create(data) {
    console.log(`create() ${data}`);
  }
}
