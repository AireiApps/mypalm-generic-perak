import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MaintenanceForemanPvClosePage } from './maintenance-foreman-pv-close.page';

const routes: Routes = [
  {
    path: '',
    component: MaintenanceForemanPvClosePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MaintenanceForemanPvClosePageRoutingModule {}
