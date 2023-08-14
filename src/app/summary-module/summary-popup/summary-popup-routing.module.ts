import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SummaryPopupPage } from './summary-popup.page';

const routes: Routes = [
  {
    path: '',
    component: SummaryPopupPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SummaryPopupPageRoutingModule {}
