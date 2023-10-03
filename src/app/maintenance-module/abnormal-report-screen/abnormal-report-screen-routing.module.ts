import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AbnormalReportScreenPage } from './abnormal-report-screen.page';

const routes: Routes = [
  {
    path: '',
    component: AbnormalReportScreenPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AbnormalReportScreenPageRoutingModule {}
