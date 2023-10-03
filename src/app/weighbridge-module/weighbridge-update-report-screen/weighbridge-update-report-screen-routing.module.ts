import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { WeighbridgeUpdateReportScreenPage } from './weighbridge-update-report-screen.page';

const routes: Routes = [
  {
    path: '',
    component: WeighbridgeUpdateReportScreenPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class WeighbridgeUpdateReportScreenPageRoutingModule {}
