import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { OwnerOillossPage } from './owner-oilloss.page';

const routes: Routes = [
  {
    path: '',
    component: OwnerOillossPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class OwnerOillossPageRoutingModule {}
