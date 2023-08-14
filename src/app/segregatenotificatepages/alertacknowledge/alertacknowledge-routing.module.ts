import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AlertacknowledgePage } from './alertacknowledge.page';

const routes: Routes = [
  {
    path: '',
    component: AlertacknowledgePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AlertacknowledgePageRoutingModule {}
