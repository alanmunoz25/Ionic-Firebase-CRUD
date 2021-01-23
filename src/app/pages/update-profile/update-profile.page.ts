import { AlertController } from '@ionic/angular';
import { Router } from '@angular/router';
import { User } from 'src/app/models/User';
import { FirebaseService } from 'src/app/services/firebase.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-update-profile',
  templateUrl: './update-profile.page.html',
  styleUrls: ['./update-profile.page.scss'],
})
export class UpdateProfilePage implements OnInit {


  user = JSON.parse(localStorage.getItem('user'));

  userData: any = {
    displayName: '',
    hobby: '',
    birthday: '',
  }

  constructor(
    private firebaseService: FirebaseService,
    private router: Router,
    private alertController: AlertController
    ) {

    if (this.isLoggedIn) {
      
      console.log('local store id', this.user.uid);
      
      this.firebaseService.getUserData(this.user.uid).subscribe(data => {
        this.userData = data;
        console.log('user update', data);
      });
    } else {
      this.router.navigateByUrl('/login');
    }
   }

  ngOnInit() {
  }

  updateUser() {
    
    this.firebaseService.updateUser(this.user.uid, this.userData).then( async () => {
      const alert = this.alertController.create({
        message: 'User profile updated',
        buttons: [
          {
            text: 'Ok',
            handler: () => {
              this.router.navigateByUrl('/home');
            }
          }
        ]
      });
      (await alert).present();
    }, err => {});
  }

  get isLoggedIn(): boolean {
    return (this.user !== null && this.user.emailVerified !== false) ? true : false;
  }

}
