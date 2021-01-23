import { AngularFireAuth } from '@angular/fire/auth';
import { Note } from '../../models/Note';
import { Observable } from 'rxjs';
import { Component, OnInit } from '@angular/core';
import { FirebaseService } from 'src/app/services/firebase.service';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {

  notes: Observable<Note[]>;

  constructor(
    private firebaseService: FirebaseService, 
    public authService: AuthService,
    private firebaseAuth: AngularFireAuth
    ) {
      console.log('Status login:', this.firebaseAuth.authState);
    }

  ngOnInit(): void {
    this.notes = this.firebaseService.getNotes();
    console.log(this.notes);
  }

  getItems() {

  }
}
