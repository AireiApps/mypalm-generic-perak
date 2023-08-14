import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TabalertacknowledgePage } from './tabalertacknowledge.page';

const routes: Routes = [
  {
    path: '',
    component: TabalertacknowledgePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TabalertacknowledgePageRoutingModule {}
