import { Injectable, NgZone } from '@angular/core';
import { User } from '../models/User';
import { Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  userData: any;

  constructor(
    public angularFirestore: AngularFirestore,
    public ngFireAuth: AngularFireAuth,
    public router: Router,
    public ngZone: NgZone
  ) { 
    this.ngFireAuth.authState.subscribe(user => {
      if (user) {
        this.userData = user;
        localStorage.setItem('user', JSON.stringify(this.userData));
        JSON.parse(localStorage.getItem('user'));
      }
    })
  }

  singIn(email, password): Promise<any> {
    return this.ngFireAuth.signInWithEmailAndPassword(email, password);
  }

  registerUser(email, password): Promise<any> {
    return this.ngFireAuth.createUserWithEmailAndPassword(email, password);
  }

  async sendVerificationMail(): Promise<any> {
    (await this.ngFireAuth.currentUser).sendEmailVerification()
      .then( () => {
        this.router.navigate(['login']);
      });
  }

  passwordRecover(passwordResetEmail) {
    return this.ngFireAuth.sendPasswordResetEmail(passwordResetEmail)
      .then( () => {
        window.alert('Password reset email sent');
      }).catch( (error) => {
        window.alert(error);
      })
  }

  get isLoggedIn(): boolean {
    const user = JSON.parse(localStorage.getItem('user'));
    return (user !== null && user.emailVerified !== false) ? true : false;
  }
  
  get isEmailVerified(): boolean {
    const user = JSON.parse(localStorage.getItem('user'));
    return (user.emailVerified !== false) ? true : false;
  }

  // // Sign in with Gmail
  // GoogleAuth() {
  //   return this.authLogin(new auth.GoogleAuthProvider());
  // }

  authLogin(provider) {
    return this.ngFireAuth.signInWithPopup(provider)
      .then( (result) => {
        this.ngZone.run( () => {
          this.router.navigate(['home']);
        })
        this.setUserData(result.user);
      }).catch( (error) => {
        window.alert(error);
      })
  }

  setUserData(user) {
    const userRef: AngularFirestoreDocument<any> = this.angularFirestore.doc(`users/${user.id}`);
    const userData: any = {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL,
      emailVerified: user.emailVerified
    }
    return userRef.set(userData, {
      merge: true
    })
  }

  signOut() {
    return this.ngFireAuth.signOut().then( () => {
      localStorage.removeItem('user');
      this.router.navigate(['login']);
    })
  }
}
