import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RepmMultipartSavePage } from './repm-multipart-save.page';

const routes: Routes = [
  {
    path: '',
    component: RepmMultipartSavePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RepmMultipartSavePageRoutingModule {}
