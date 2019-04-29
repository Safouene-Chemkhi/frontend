import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot } from '@angular/router';
import { CanActivate } from '@angular/router';
import { NavController, AlertController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService implements CanActivate {
  constructor(public nav: NavController, public alertController: AlertController) { }

  async presentAlert() {
    const alert = await this.alertController.create({
      header: 'Alert',
      message: 'You should be logged in...',
      buttons: ['OK']
    });
    await alert.present();
  }

  canActivate(route: ActivatedRouteSnapshot): boolean {

    console.log(route);

    let authInfo = {
      authenticated: localStorage.getItem('token')
    };

    if (!authInfo.authenticated) {
      this.nav.navigateRoot('login');
      return false;
    }

    return true;

  }

  
}
