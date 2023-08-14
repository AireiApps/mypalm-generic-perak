import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TabOillossesNewPage } from './tab-oillosses-new.page';

const routes: Routes = [
  {
    path: '',
    component: TabOillossesNewPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TabOillossesNewPageRoutingModule {}
