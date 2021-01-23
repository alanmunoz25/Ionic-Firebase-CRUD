import { Note } from '../../models/Note';
import { FirebaseService } from 'src/app/services/firebase.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-update-note',
  templateUrl: './update-note.page.html',
  styleUrls: ['./update-note.page.scss'],
})
export class UpdateNotePage implements OnInit {

  note: Note = {
    id: '',
    title: '',
    content: '',
    createdAt: ''
  };

  constructor(
    private firebaseService: FirebaseService,
    private activatedRoute: ActivatedRoute,
    private router: Router
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

  updateNote() {
    this.firebaseService.updateNote(this.note).then( () => {
      this.router.navigateByUrl('/');
    }, err => {});
  }

}
