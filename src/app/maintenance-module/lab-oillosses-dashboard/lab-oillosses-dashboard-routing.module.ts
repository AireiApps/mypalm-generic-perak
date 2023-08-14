import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LabOillossesDashboardPage } from './lab-oillosses-dashboard.page';

const routes: Routes = [
  {
    path: '',
    component: LabOillossesDashboardPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LabOillossesDashboardPageRoutingModule {}
