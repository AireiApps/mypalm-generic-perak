import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TabPreventivemaintenancePage } from './tab-preventivemaintenance.page';

const routes: Routes = [
  {
    path: '',
    component: TabPreventivemaintenancePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TabPreventivemaintenancePageRoutingModule {}
