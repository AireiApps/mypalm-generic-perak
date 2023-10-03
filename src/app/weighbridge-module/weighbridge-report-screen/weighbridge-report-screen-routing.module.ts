import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { WeighbridgeReportScreenPage } from './weighbridge-report-screen.page';

const routes: Routes = [
  {
    path: '',
    component: WeighbridgeReportScreenPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class WeighbridgeReportScreenPageRoutingModule {}
