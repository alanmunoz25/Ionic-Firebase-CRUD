import { Note } from '../../models/Note';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FirebaseService } from '../../services/firebase.service';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-add-note',
  templateUrl: './add-note.page.html',
  styleUrls: ['./add-note.page.scss'],
})
export class AddNotePage implements OnInit {

  note: Note = {
    title: '',
    content: '',
    createdAt: new Date().getTime()
  };

  constructor(
    private activateRoute: ActivatedRoute,
    private firebaseService: FirebaseService,
    private toastCtrl: ToastController,
    private router: Router
  ) { }

  ngOnInit() {
  }

  addNote() {
    this.firebaseService.addNote(this.note).then( () => {
      this.router.navigateByUrl('/');
    }, err => {});
  }

}
