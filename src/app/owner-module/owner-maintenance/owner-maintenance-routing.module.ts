import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { OwnerMaintenancePage } from './owner-maintenance.page';

const routes: Routes = [
  {
    path: '',
    component: OwnerMaintenancePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class OwnerMaintenancePageRoutingModule {}
