import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ProductionOillossPage } from './production-oilloss.page';

const routes: Routes = [
  {
    path: '',
    component: ProductionOillossPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProductionOillossPageRoutingModule {}
