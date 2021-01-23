import { FirebaseService } from 'src/app/services/firebase.service';
import { AlertController } from '@ionic/angular';
import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  constructor(
    public authService: AuthService,
    public router: Router,
    public alertController: AlertController,
    public firebaseService: FirebaseService
  ) { }

  ngOnInit() {
  }

  singIn(email, password) {
    this.authService.singIn(email.value, password.value)
      // .then( (login) => {
      //   console.log('login:', login);
      // })
      .then( async (res) => {
        if (res.user.emailVerified) {
          console.log('user id:', res);
          
          this.firebaseService.getUserData(res.user.uid).subscribe( user => {
            console.log('current user:', user);
            
          });
          this.router.navigate(['home']);
        } else {
          const alert = this.alertController.create({
            message: 'Email is not verified',
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
        }
      }).catch( async (error) => {
        const alert = this.alertController.create({
          header: 'Error',
          message: error.message,
          buttons: ['Ok']
        });
        (await alert).present();
      });
  }

}
