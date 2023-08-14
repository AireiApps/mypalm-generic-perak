import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RopmMultipartSavePage } from './ropm-multipart-save.page';

const routes: Routes = [
  {
    path: '',
    component: RopmMultipartSavePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RopmMultipartSavePageRoutingModule {}
