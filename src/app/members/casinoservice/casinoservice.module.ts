import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { CasinoservicePage } from './casinoservice.page';

const routes: Routes = [
  {
    path: '',
    component: CasinoservicePage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [CasinoservicePage]
})
export class CasinoservicePageModule {}
