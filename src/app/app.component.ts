import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Timestamp } from '@angular/fire/firestore';
import { map, UnsubscriptionError } from 'rxjs';

import { Tweet, TweetDTO } from './models/tweet.model';
import { User } from './models/user.model';

import { UserService } from './services/user.service';
import { TimelineService } from './services/timeline.service';

import firebase from 'firebase/compat/app';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  // (temp) user account
  tempUserId = 'zQGYBBxL4whNQZ3uC0jo';
  userList = [];
  currentUser: User;

  // new tweet creation
  newTweetBuffer = '';
  newTweetSending = false;

  // timeline / tweet feed
  tweets: Tweet[];
  followingTweets: Tweet[];
  userTweets: Tweet[];
  isTimelineLoading = true;
  isUserTweetsLoading = true;

  constructor(
    public auth: AngularFireAuth,
    private timelineService: TimelineService,
    private userService: UserService
  ) {
    this.tweets = [];
    this.followingTweets = [];
    this.userTweets = [];

    this.getUserList();
    // this.setupUserApp(this.tempUserId);

    this.auth.user.subscribe((user) => {
      if (!user) {
        console.log('user is not authed');
        this.userService
          .getUserById(this.tempUserId)
          .valueChanges({ idField: 'id' })
          .subscribe({
            next: (user) => {
              this.currentUser = user;
              this.fetchUserTweets();
              this.fetchFeedTweets();
            },
          });
        // const anon = this.auth.signInAnonymously();
      } else {
        console.log('user is authed');
        this.userService
          .getUserById(user.uid)
          .valueChanges({ idField: 'id' })
          .subscribe({
            next: (user) => {
              this.currentUser = user;
              this.fetchUserTweets();
              this.fetchFeedTweets();
            },
          });
      }

      console.log('auth.user: ', user);
    });

    this.auth.authState.subscribe((user) =>
      console.log('auth.authState: ', user)
    );
  }

  ngOnInit(): void {}

  setupUserApp(userId) {
    this.getUser(userId).subscribe((user) => {
      this.currentUser = user;
      this.fetchUserTweets();
      this.fetchFeedTweets();
    });
  }

  async login() {
    this.auth
      .signInWithPopup(new firebase.auth.TwitterAuthProvider())
      .then((cred) => {
        console.log('login:cred:', cred.additionalUserInfo);
        if (cred.additionalUserInfo.isNewUser) {
          const newUser: User = {
            id: cred.user.uid,
            name: cred.user.displayName,
            tag: cred.additionalUserInfo.username,
          };

          // update user doc with tag
          this.userService.createUser(newUser).then((ok) => {
            console.log('new user added: ', newUser);
          });
        } else {
          // 1. get user acc
        }
      });
  }

  // async loginAnonymously() {
  //   const user = await this.auth.signInAnonymously();
  // }

  logout() {
    this.auth.signOut();
  }

  switchUser(e) {
    // this.tempUserId = e.target.value;
    // this.setupUserApp(this.tempUserId);
  }

  getUserList() {
    // @TODO - remove after adding auth/login
    this.userService
      .getAll()
      .snapshotChanges()
      .pipe(
        map((changes) =>
          changes.map((c) => ({
            id: c.payload.doc.id,
            ...c.payload.doc.data(),
          }))
        )
      )
      .subscribe({
        next: (users) => {
          this.userList = users;
        },
      });
  }

  getUser(userId) {
    return this.userService.getUserById(userId).valueChanges({ idField: 'id' });
  }

  updateTweetFeed() {
    this.tweets = [...this.followingTweets, ...this.userTweets];
    this.tweets.sort((a, b) => b.ts.getTime() - a.ts.getTime());
  }

  fetchUserTweets() {
    this.timelineService
      .getTweetsByUserId(this.currentUser.id)
      .valueChanges({ idField: 'id' })
      .subscribe((userTweets) => {
        this.userTweets = userTweets.map((tweet) => {
          let res = {
            ...tweet,
            ts: tweet.ts.toDate(),
          };
          return res;
        });
        this.isUserTweetsLoading = false;
        this.updateTweetFeed();
      });
  }

  fetchFeedTweets() {
    this.timelineService
      .getFeedByUserId(this.currentUser.id)
      .snapshotChanges()
      .pipe(
        map((changes) =>
          changes.map((c) => ({
            id: c.payload.doc.id,
            ...c.payload.doc.data(),
          }))
        )
      )
      .subscribe((fetchedTweets) => {
        this.followingTweets = fetchedTweets.map((tweet) => {
          let res = {
            ...tweet,
            ts: tweet.ts.toDate(),
          };
          return res;
        });
        this.isTimelineLoading = false;
        this.updateTweetFeed();
      });
  }

  createTweet(): void {
    if (this.newTweetBuffer.length < 1) {
      return;
    }

    this.newTweetSending = true;
    const newTweet: TweetDTO = {
      name: this.currentUser.name,
      tag: this.currentUser.tag,
      ts: new Timestamp(Date.now() / 1000, 0),
      text: this.newTweetBuffer,
      userId: this.currentUser.id,
    };
    this.timelineService.create(newTweet).then(() => {
      this.newTweetBuffer = '';
      this.newTweetSending = false;
    });
  }

  onWriteTweetInput(event) {
    if (event.key === 'Enter' && event.ctrlKey) {
      this.createTweet();
    }
  }

  onWriteTweetButtonClick() {
    this.createTweet();
  }

  followPublic() {
    this.userService
      .followUser(this.currentUser.id, this.tempUserId)
      .then(() => {
        console.log(`You are now following ${this.tempUserId}!`);
        this.userService.addTweetsToFollowerFeed(
          this.currentUser.id,
          this.tempUserId
        );
      });

    // @TODO offload this behavior (and others like) onto the
    // backend cloud function calls w/ a trigger on those collections/docs
  }

  getTweetHoverDate(ts: Date) {
    let hoverTime = ts.toLocaleTimeString('en-us', {
      hour: 'numeric',
      minute: 'numeric',
    });
    let hoverDate = ts.toLocaleDateString('en-us', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });

    return `${hoverTime} - ${hoverDate}`;
  }

  getTweetTimeElapsed(ts: Date) {
    const current = new Date();
    const currentTime = current.getTime();
    const tweetTime = ts.getTime();
    const diffTime = currentTime - tweetTime;
    const diffs = {
      seconds: diffTime / 1000,
      minutes: diffTime / 1000 / 60,
      hours: diffTime / 1000 / 60 / 60,
      days: diffTime / 1000 / 60 / 60 / 24,
    };

    let timeElapsedText = '';
    if (diffs.days >= 1) {
      if (current.getFullYear() !== ts.getFullYear()) {
        timeElapsedText = ts.toLocaleDateString('en-us', {
          month: 'short',
          day: 'numeric',
          year: 'numeric',
        });
      } else {
        timeElapsedText = ts.toLocaleDateString('en-us', {
          month: 'short',
          day: 'numeric',
        });
      }
    } else if (diffs.hours >= 1) {
      timeElapsedText = Math.round(diffs.hours) + 'h';
    } else if (diffs.minutes >= 1) {
      timeElapsedText = Math.round(diffs.minutes) + 'm';
    } else {
      timeElapsedText = Math.round(diffs.seconds) + 's';
    }

    return timeElapsedText;
  }
}
