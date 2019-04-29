import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { ListPage } from './list.page';
import {  Geolocation } from '@ionic-native/geolocation/ngx';
import {  GoogleMaps } from '@ionic-native/google-maps/ngx';
import { AuthGuardService } from '../auth-guard.service';
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild([
      {
        path: '',
        component: ListPage,
        canActivate: [AuthGuardService]
      }
    ])   
  ],
  declarations: [ListPage],
  providers: [Geolocation, GoogleMaps]
})
export class ListPageModule {}
