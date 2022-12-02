import { Injectable } from '@angular/core';
import {
  AngularFirestore,
  AngularFirestoreCollection,
  AngularFirestoreDocument,
} from '@angular/fire/compat/firestore';
import { User } from '../models/user.model';

@Injectable({ providedIn: 'root' })
export class UserService {
  private userCollectionPath = '/users';
  usersRef: AngularFirestoreCollection<User>;

  constructor(private db: AngularFirestore) {
    this.usersRef = db.collection(this.userCollectionPath);
  }

  getUserById(id: string): AngularFirestoreDocument<User> {
    return this.db.doc<User>(this.userCollectionPath + '/' + id);
  }

  /*
    ex: 
      this.userService
      .getAll()
      .valueChanges()
      .subscribe({
        next: (users) => {
          console.log(users);
        },
      });
  */

  getAll(): AngularFirestoreCollection<User> {
    return this.usersRef;
  }
}
