import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { OwnerProductionPage } from './owner-production.page';

const routes: Routes = [
  {
    path: '',
    component: OwnerProductionPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class OwnerProductionPageRoutingModule {}
