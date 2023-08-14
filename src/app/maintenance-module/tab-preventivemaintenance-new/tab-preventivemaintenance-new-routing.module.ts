import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TabPreventivemaintenanceNewPage } from './tab-preventivemaintenance-new.page';

const routes: Routes = [
  {
    path: '',
    component: TabPreventivemaintenanceNewPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TabPreventivemaintenanceNewPageRoutingModule {}
