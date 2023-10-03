import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { WeighbridgeUpdateScreenPage } from './weighbridge-update-screen.page';

const routes: Routes = [
  {
    path: '',
    component: WeighbridgeUpdateScreenPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class WeighbridgeUpdateScreenPageRoutingModule {}
