import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TabLaboillossReportPage } from './tab-laboilloss-report.page';

const routes: Routes = [
  {
    path: '',
    component: TabLaboillossReportPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TabLaboillossReportPageRoutingModule {}
