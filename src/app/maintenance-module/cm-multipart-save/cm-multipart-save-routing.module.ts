import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CmMultipartSavePage } from './cm-multipart-save.page';

const routes: Routes = [
  {
    path: '',
    component: CmMultipartSavePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CmMultipartSavePageRoutingModule {}
