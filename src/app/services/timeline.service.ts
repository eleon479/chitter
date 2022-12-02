import { Injectable } from '@angular/core';
import {
  AngularFirestore,
  AngularFirestoreCollection,
} from '@angular/fire/compat/firestore';
import { map } from 'rxjs';
import { TweetDTO } from '../models/tweet.model';

@Injectable({ providedIn: 'root' })
export class TimelineService {
  private tweetsCollectionPath = '/tweets';
  tweetsRef: AngularFirestoreCollection<TweetDTO>;

  constructor(private db: AngularFirestore) {
    this.tweetsRef = db.collection(this.tweetsCollectionPath, (ref) =>
      ref.orderBy('ts', 'desc')
    );
  }

  getFeedByUserId(userId: string): AngularFirestoreCollection<TweetDTO> {
    return this.db.collection(`/feeds/${userId}/tweets`, (ref) =>
      ref.orderBy('ts', 'desc')
    );
  }

  getTweetsByUserId(userId: string): AngularFirestoreCollection<TweetDTO> {
    return this.db.collection<TweetDTO>(`/tweets`, (ref) =>
      ref.where('userId', '==', userId)
    );
  }

  getAll(): AngularFirestoreCollection<TweetDTO> {
    return this.tweetsRef;
  }

  create(tweet: TweetDTO) {
    return this.tweetsRef.add({ ...tweet }).then((ref) => {
      // get followers
      const followQuery = this.db.collection<{
        followerUserId: string;
        followingUserId: string;
      }>('/follows', (followRef) =>
        followRef.where('followingUserId', '==', tweet.userId)
      );

      followQuery
        .snapshotChanges()
        .pipe(
          map((changes) =>
            changes.map((c) => ({
              id: c.payload.doc.id,
              ...c.payload.doc.data(),
            }))
          )
        )
        .subscribe((followers) => {
          console.log(followers);
          followers.forEach((follower) => {
            this.db
              .collection(`/feeds/${follower.followerUserId}/tweets`)
              .doc(ref.id)
              .set({ ...tweet });
          });
        });
    });
  }
}
