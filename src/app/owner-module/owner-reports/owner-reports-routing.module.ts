import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { OwnerReportsPage } from './owner-reports.page';

const routes: Routes = [
  {
    path: '',
    component: OwnerReportsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class OwnerReportsPageRoutingModule {}
