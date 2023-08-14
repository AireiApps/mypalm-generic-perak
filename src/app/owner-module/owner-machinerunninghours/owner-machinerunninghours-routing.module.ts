import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { OwnerMachinerunninghoursPage } from './owner-machinerunninghours.page';

const routes: Routes = [
  {
    path: '',
    component: OwnerMachinerunninghoursPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class OwnerMachinerunninghoursPageRoutingModule {}
