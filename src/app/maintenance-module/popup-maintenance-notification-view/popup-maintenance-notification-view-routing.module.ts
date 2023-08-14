import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PopupMaintenanceNotificationViewPage } from './popup-maintenance-notification-view.page';

const routes: Routes = [
  {
    path: '',
    component: PopupMaintenanceNotificationViewPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PopupMaintenanceNotificationViewPageRoutingModule {}
