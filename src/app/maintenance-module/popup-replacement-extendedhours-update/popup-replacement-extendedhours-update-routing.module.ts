import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PopupReplacementExtendedhoursUpdatePage } from './popup-replacement-extendedhours-update.page';

const routes: Routes = [
  {
    path: '',
    component: PopupReplacementExtendedhoursUpdatePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PopupReplacementExtendedhoursUpdatePageRoutingModule {}
