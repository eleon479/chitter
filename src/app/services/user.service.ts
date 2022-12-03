import { Injectable } from '@angular/core';
import {
  AngularFirestore,
  AngularFirestoreCollection,
  AngularFirestoreDocument,
} from '@angular/fire/compat/firestore';
import { map } from 'rxjs';
import { TweetDTO } from '../models/tweet.model';
import { Follow, User } from '../models/user.model';

@Injectable({ providedIn: 'root' })
export class UserService {
  private userCollectionPath = '/users';
  usersRef: AngularFirestoreCollection<User>;

  constructor(private db: AngularFirestore) {
    this.usersRef = db.collection(this.userCollectionPath);
  }

  getUserById(id: string): AngularFirestoreDocument<User> {
    return this.db.doc<User>(`/users/${id}`);
  }

  getAll(): AngularFirestoreCollection<User> {
    return this.usersRef;
  }

  updateUserTag(id: string, tag: string) {
    return this.db.doc<User>(`/users/${id}`).update({ tag });
  }

  createUser(user: User) {
    return this.db.doc<User>(`/users/${user.id}`).set({ ...user });
  }

  followUser(followerId: string, followingId: string) {
    return this.db
      .collection<Follow>(`/follows`)
      .add({ followerUserId: followerId, followingUserId: followingId });
  }

  addTweetsToFollowerFeed(followerId: string, followingId: string) {
    const tweetQuery = this.db.collection<TweetDTO>(`/tweets`, (tweetRef) =>
      tweetRef.where('userId', '==', followingId)
    );

    return tweetQuery
      .snapshotChanges()
      .pipe(
        map((changes) =>
          changes.map((c) => ({
            id: c.payload.doc.id,
            ...c.payload.doc.data(),
          }))
        )
      )
      .subscribe((tweets) => {
        tweets.forEach((tweet) => {
          this.db
            .doc(`/feeds/${followerId}/tweets/${tweet.id}`)
            .set({ ...tweet });
        });
      });
  }
}
