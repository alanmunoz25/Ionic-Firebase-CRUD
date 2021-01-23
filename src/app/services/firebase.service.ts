import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, DocumentReference} from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Note } from '../models/Note';
import { map, take } from 'rxjs/operators';
import { User } from '../models/User';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {

  private notes: Observable<Note[]>;
  private noteCollection: AngularFirestoreCollection<Note>;
  private userCollection: AngularFirestoreCollection<User>;
  private users: Observable<any>;

  constructor( private firebaseService: AngularFirestore) { 
    // Working with 'notes' in firestore database as a table
    this.noteCollection = this.firebaseService.collection<Note>('notes');
    this.userCollection = this.firebaseService.collection<User>('users');

    // Get collection details
    this.notes = this.noteCollection.snapshotChanges().pipe(
      map(
        actions => {
          return actions.map(a => {
            const data = a.payload.doc.data();
            const id = a.payload.doc.id;
            return { id, ...data };
          });
        })
    );

    this.users = this.userCollection.snapshotChanges().pipe(
      map(
        usersData => {
          return usersData.map( u => {
            const user = u.payload.doc.data();
            const uid = u.payload.doc.id;
            return { uid, ...user };
          })
        }
      )
    )
  }

  // return the data with method
  getNotes(): Observable<Note[]> {
    return this.notes;
  }

  getUser(): Observable<User> {
    return this.users;
  }

  getUserData(uid: string): Observable<any> {
    return this.userCollection.doc(uid).valueChanges().pipe(
      take(1),
      map( user => {
        console.log('user data,', user);
        return user;
      })
    );
  }

  updateUser(uid: string, userData: User) {
    return this.userCollection.doc(uid).update({
      displayName: userData.displayName,
      birthday: userData.birthday,
      hobby: userData.hobby
    })
  }

  // return the data for single note
  getNote(id: string): Observable<Note> {
    return this.noteCollection.doc<Note>(id).valueChanges().pipe(
      take(1),
      map(note => {
        note.id = id;
        return note;
      })
    );
  }

  // Add note to the collection
  addNote(note: Note): Promise<DocumentReference> {
    return this.noteCollection.add(note);
  }

  // Update note in the collection
  updateNote(note: Note): Promise<void> {
    return this.noteCollection.doc(note.id).update({
      title: note.title,
      content: note.content
    });
  }

  // Delete note
  deleteNote(id: string): Promise<void> {
    return this.noteCollection.doc(id).delete();
  }

  async addUserData(uid: string, userData: User): Promise<void> {
    await this.userCollection.doc(uid).set(userData);
  }
}
