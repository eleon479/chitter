import { Component } from '@angular/core';
import { TimelineService } from './services/timeline.service';
import {
  AngularFirestore,
  AngularFirestoreDocument,
  AngularFirestoreCollection,
} from '@angular/fire/compat/firestore';
import { map, Observable } from 'rxjs';

interface Tweet {
  id?: string;
  name?: string;
  tag?: string;
  ts?: boolean;
  text?: string;
}
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'chitter';
  tweets = [];
  isTimelineLoading = true;
  newTweetBuffer = '';

  // account
  currentName = 'Some User';
  currentTag = 'usertag23';
  currentTs = '1s';

  tweetsRef: AngularFirestoreCollection<Tweet>;
  // db: AngularFireStore
  finalTweets: Tweet[];

  constructor(
    private timelineService: TimelineService,
    private db: AngularFirestore
  ) {
    setTimeout(() => {
      this.tweets = timelineService.fetchTweets();
      this.isTimelineLoading = false;
    }, 1500);
    this.tweetsRef = db.collection('/tweets');

    this.getAll()
      .snapshotChanges()
      .pipe(
        map((changes) =>
          changes.map((c) => ({
            id: c.payload.doc.id,
            ...c.payload.doc.data(),
          }))
        )
      )
      .subscribe((data) => {
        this.finalTweets = data;
      });
  }

  getAll(): AngularFirestoreCollection<Tweet> {
    return this.tweetsRef;
  }

  onWriteTweetInput(event) {
    console.log(event);
    if (event.key === 'Enter' && event.ctrlKey) {
      this.onWriteTweetButtonClick();
    }
  }

  onWriteTweetButtonClick() {
    this.tweets = [
      {
        name: this.currentName,
        tag: this.currentTag,
        ts: this.currentTs,
        text: this.newTweetBuffer,
      },
    ].concat(this.tweets);
    this.newTweetBuffer = '';
  }
}
