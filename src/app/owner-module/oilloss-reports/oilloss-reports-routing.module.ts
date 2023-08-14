import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { OillossReportsPage } from './oilloss-reports.page';

const routes: Routes = [
  {
    path: '',
    component: OillossReportsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class OillossReportsPageRoutingModule {}
