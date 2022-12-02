import { Timestamp } from '@angular/fire/firestore';

export class Tweet {
  id?: string;
  name?: string;
  tag?: string;
  ts?: Date;
  text?: string;
  userId?: string;
}

export class TweetDTO {
  id?: string;
  name?: string;
  tag?: string;
  ts?: Timestamp;
  text?: string;
  userId?: string;
}

export interface Feed {
  tweets: TweetDTO[];
  userId: string;
}
