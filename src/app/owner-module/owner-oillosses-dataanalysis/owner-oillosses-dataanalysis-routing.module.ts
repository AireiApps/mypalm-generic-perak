import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { OwnerOillossesDataanalysisPage } from './owner-oillosses-dataanalysis.page';

const routes: Routes = [
  {
    path: '',
    component: OwnerOillossesDataanalysisPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class OwnerOillossesDataanalysisPageRoutingModule {}
