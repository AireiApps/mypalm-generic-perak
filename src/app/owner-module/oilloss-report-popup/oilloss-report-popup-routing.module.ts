import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { OillossReportPopupPage } from './oilloss-report-popup.page';

const routes: Routes = [
  {
    path: '',
    component: OillossReportPopupPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class OillossReportPopupPageRoutingModule {}
