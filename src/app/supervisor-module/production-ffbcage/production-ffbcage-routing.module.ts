import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ProductionFfbcagePage } from './production-ffbcage.page';

const routes: Routes = [
  {
    path: '',
    component: ProductionFfbcagePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProductionFfbcagePageRoutingModule {}
