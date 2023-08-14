import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { OillossRecomandationModalPage } from './oilloss-recomandation-modal.page';

const routes: Routes = [
  {
    path: '',
    component: OillossRecomandationModalPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class OillossRecomandationModalPageRoutingModule {}
