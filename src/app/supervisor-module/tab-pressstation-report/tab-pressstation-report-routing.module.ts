import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TabPressstationReportPage } from './tab-pressstation-report.page';

const routes: Routes = [
  {
    path: '',
    component: TabPressstationReportPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TabPressstationReportPageRoutingModule {}
