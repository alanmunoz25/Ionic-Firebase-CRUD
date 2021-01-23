import { FirebaseService } from 'src/app/services/firebase.service';
import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { AlertController } from '@ionic/angular';
import { User } from 'src/app/models/User';

@Component({
  selector: 'app-register-user',
  templateUrl: './register-user.page.html',
  styleUrls: ['./register-user.page.scss'],
})
export class RegisterUserPage implements OnInit {

  constructor(
    public authService: AuthService,
    public router: Router,
    public alertCtrl: AlertController,
    public firebaseService: FirebaseService
  ) {

   }

  ngOnInit() {
  }

  signUp(email, password, displayName, birthday, hobby) {
    const user: any = {
      displayName: displayName.value,
      birthday: birthday.value,
      hobby: hobby.value
    };

    this.authService.registerUser(email.value, password.value)
      .then( async (res) => {
        const alert = this.alertCtrl.create({
          header: 'Success',
          message: 'User created success',
          buttons: [
            {
              text: 'Ok',
              handler: () => {
                // console.log('res:', res);
                this.firebaseService.addUserData(res.user.uid, user);
                this.authService.sendVerificationMail();
                this.router.navigateByUrl('/login');
              }
            }
          ]
        });
        (await alert).present();
      }).catch( async (error) => {
        const alert = this.alertCtrl.create({
          header: 'Error',
          message: error.message,
          buttons: [
            {
              text: 'Ok',
              handler: () => {
                return;
              }
            }
          ]
        });
        (await alert).present();
      });
  }

}
