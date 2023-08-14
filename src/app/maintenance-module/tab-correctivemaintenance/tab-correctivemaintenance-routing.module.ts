import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TabCorrectivemaintenancePage } from './tab-correctivemaintenance.page';

const routes: Routes = [
  {
    path: '',
    component: TabCorrectivemaintenancePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TabCorrectivemaintenancePageRoutingModule {}
