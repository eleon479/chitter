import { Component, Input } from '@angular/core';
import { Timestamp } from '@angular/fire/firestore';
import { Tweet, TweetDTO } from '../models/tweet.model';
import { User } from '../models/user.model';
import { TimelineService } from '../services/timeline.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent {
  @Input() currentUser: User;

  @Input() isTimelineLoading = true;
  @Input() isUserTweetsLoading = true;

  @Input() tweets: Tweet[] = [];
  @Input() followingTweets: Tweet[] = [];
  @Input() userTweets: Tweet[] = [];

  newTweetBuffer = '';
  newTweetSending = false;

  constructor(private timelineService: TimelineService) {}

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
