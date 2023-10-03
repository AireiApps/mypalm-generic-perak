import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { WeighbridgeHomeScreenPage } from './weighbridge-home-screen.page';

const routes: Routes = [
  {
    path: '',
    component: WeighbridgeHomeScreenPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class WeighbridgeHomeScreenPageRoutingModule {}
