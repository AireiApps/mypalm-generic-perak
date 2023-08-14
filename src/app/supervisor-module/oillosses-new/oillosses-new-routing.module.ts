import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { OillossesNewPage } from './oillosses-new.page';

const routes: Routes = [
  {
    path: '',
    component: OillossesNewPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class OillossesNewPageRoutingModule {}
