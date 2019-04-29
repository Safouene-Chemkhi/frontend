import { Component, OnInit } from '@angular/core';
import { NavController, LoadingController, AlertController } from '@ionic/angular';
import { AuthService } from '../auth.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { delay } from 'q';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  err: any = 'This is an alert message.';
  constructor(
    public auth: AuthService,
    public nav: NavController,
    public loadingController: LoadingController,
    public alertController: AlertController
  ) { }

  async ngOnInit() {
    if (localStorage.getItem('token')) {
      const loading = await this.loadingController.create({
        message: 'Please wait...',
        duration: 1000
      });
      loading.present()
      delay(1000).then(() => {
        this.nav.navigateForward('home');
      })
    };
  }

  form = new FormGroup({
    username: new FormControl('', Validators.compose([Validators.required, Validators.email, Validators.minLength(5)])),
    password: new FormControl('', Validators.compose([Validators.required, Validators.minLength(5)]))
  })

  get f() { return this.form.controls; }

  async presentAlert() {
    const alert = await this.alertController.create({
      header: 'Alert',
      message: JSON.stringify(this.err),
      buttons: ['OK']
    });
    await alert.present();
  }

  async login() {
    let credentials = {
      email: this.form.controls.username.value,
      password: this.form.controls.password.value
    };
    const loading = await this.loadingController.create({
      message: 'Please wait...',
      duration: 1500
    });
    loading.present()
    this.auth.login(credentials).subscribe(res => {
      console.log(res);
      let x: any = res;
      localStorage.setItem('token', x._token);
      localStorage.setItem('user', JSON.stringify(x.user));
      delay(1000).then(() => {
        this.nav.navigateForward('home');
      })
    }, (err) => {
      if (err.error.isTrusted){
        delay(1000).then(() => {
          let x: any = 'res';
          localStorage.setItem('token', x);
          localStorage.setItem('user', JSON.stringify(x));
          this.nav.navigateRoot('/home');
        })
        return ;
      }
      console.log(err);
      this.err = err.error;
      loading.onDidDismiss().then(() => {
        this.presentAlert();
      });
    });




  }

  launchSignup() {
    this.nav.navigateForward('signup')
  }

}
