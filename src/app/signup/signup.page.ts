import { Component } from '@angular/core';
import { AuthService } from '../auth.service';
import { User } from '../models/user';
import { Address } from '../models/address';
import { FormGroup, FormControl, Validators  } from '@angular/forms';
import { NavController, LoadingController, AlertController } from '@ionic/angular';
import { delay } from 'q';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.page.html',
  styleUrls: ['./signup.page.scss'],
})
export class SignupPage {
  form = new FormGroup({
    password: new FormControl('', Validators.compose([Validators.required, Validators.minLength(5)])),
    first_name: new FormControl('', Validators.compose([Validators.required, Validators.minLength(5)])),
    last_name: new FormControl('', Validators.compose([Validators.required, Validators.minLength(5)])),
    email: new FormControl('', Validators.compose([Validators.required, Validators.email, Validators.minLength(5)])),
    age: new FormControl('', Validators.compose([Validators.required, Validators.min(1), Validators.max(100)])),
    confirmPassword: new FormControl(''),
    city: new FormControl('', Validators.compose([Validators.required, Validators.minLength(5)])),
    country: new FormControl('', Validators.compose([Validators.required, Validators.minLength(5)])),
    pc: new FormControl('', Validators.compose([Validators.required,Validators.min(1000),Validators.max(1000)])),
    gender: new FormControl('female'),
    doctor: new FormControl(false),
  } )


  user: User;
  address: Address;
  err;
  constructor(
    public auth: AuthService, 
    public nav: NavController, 
    public loadingController: LoadingController, 
    public alertController: AlertController,
    ) { }

    get f() { return this.form.controls; }

    checkPasswords() {
    let pass = this.form.controls.password.value;
    let confirmPass = this.form.controls.confirmPassword.value;
  
    return pass === confirmPass ? true : false     
  }
  async presentAlert() {
    const alert = await this.alertController.create({
      header: 'Alert',
      message: this.err,
      buttons: ['OK']
    });
    await alert.present();
  }



  async register() {
    this.address = {
      city: this.form.controls.city.value,
      country: this.form.controls.country.value,
      pc: this.form.controls.pc.value
    }
    this.user = {
      first_name: this.form.controls.first_name.value,
      last_name: this.form.controls.last_name.value,
      email: this.form.controls.email.value,
      age: this.form.controls.age.value,
      password: this.form.controls.password.value,
      //confirmPassword: this.confirmPassword,
      address: this.address
    };
    console.log(this.user)
    const loading = await this.loadingController.create({
      message: 'Please wait...',
      duration: 2000

    });
    loading.present()

    this.auth.register(this.user).subscribe(res => {
      console.log(res);
      let x : any = res;
      //localStorage.setItem('token', x._token);
      delay(1000).then(()=>{
        this.nav.navigateForward('login');
      })    }, (err) => {
      console.log(err);
      this.err = err.error;
      loading.onDidDismiss().then(() => {
        this.presentAlert();
      });
    });

  }
}
