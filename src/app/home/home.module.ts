import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { ChartsModule } from 'ng2-charts';

import { HomePage } from './home.page';
import { AuthGuardService } from '../auth-guard.service';
import { GridsterModule } from 'angular-gridster2';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild([
      {
        path: '',
        component: HomePage,
        canActivate: [AuthGuardService]
      }
    ]),
    GridsterModule,
    ChartsModule 
  ],
  declarations: [HomePage]
})
export class HomePageModule {}
