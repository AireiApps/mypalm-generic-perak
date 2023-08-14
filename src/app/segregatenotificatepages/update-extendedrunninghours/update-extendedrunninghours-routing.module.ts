import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { UpdateExtendedrunninghoursPage } from './update-extendedrunninghours.page';

const routes: Routes = [
  {
    path: '',
    component: UpdateExtendedrunninghoursPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UpdateExtendedrunninghoursPageRoutingModule {}
