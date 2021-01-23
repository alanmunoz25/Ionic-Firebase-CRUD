import { Note } from '../../models/Note';
import { FirebaseService } from './../../services/firebase.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-view-note',
  templateUrl: './view-note.page.html',
  styleUrls: ['./view-note.page.scss'],
})
export class ViewNotePage implements OnInit {

  note: Note = {
    id: '',
    title: '',
    content: '',
    createdAt: ''
  };

  constructor(
    private firebaseService: FirebaseService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    public alertCtrl: AlertController
    ) { }

  ngOnInit() {
  }
  
  ngAfterViewInit(): void {
    const id = this.activatedRoute.snapshot.paramMap.get('id');
    if (id) {
      this.firebaseService.getNote(id).subscribe(data => {
        this.note = data;
      });
    }
  }

  async deleteNote() {

    const confirm = this.alertCtrl.create({
      message: 'Are you sure?',
      buttons: [
        {
          text: 'Cancelar',
          handler: () => {
            return;
          }
        },
        {
          text: 'Ok',
          handler: () => {
            this.firebaseService.deleteNote(this.note.id).then( () => {
              this.router.navigateByUrl('/');
            }, err => {});
          }
        }
      ]
    });
    (await confirm).present();
  }

}
