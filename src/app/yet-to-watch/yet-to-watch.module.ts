import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { YetToWatchPage } from './yet-to-watch.page';

const routes: Routes = [
  {
    path: '',
    component: YetToWatchPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [YetToWatchPage]
})
export class YetToWatchPageModule {}
