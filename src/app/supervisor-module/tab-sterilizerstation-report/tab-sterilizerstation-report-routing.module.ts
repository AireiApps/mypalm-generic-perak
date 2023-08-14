import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TabSterilizerstationReportPage } from './tab-sterilizerstation-report.page';

const routes: Routes = [
  {
    path: '',
    component: TabSterilizerstationReportPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TabSterilizerstationReportPageRoutingModule {}
