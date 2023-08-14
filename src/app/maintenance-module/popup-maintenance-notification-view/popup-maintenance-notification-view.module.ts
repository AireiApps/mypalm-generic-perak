import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";

import { IonicModule } from "@ionic/angular";

import { PopupMaintenanceNotificationViewPageRoutingModule } from "./popup-maintenance-notification-view-routing.module";

import { PopupMaintenanceNotificationViewPage } from "./popup-maintenance-notification-view.page";

import { TranslateModule } from "@ngx-translate/core";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TranslateModule,
    PopupMaintenanceNotificationViewPageRoutingModule,
  ],
  declarations: [PopupMaintenanceNotificationViewPage],
})
export class PopupMaintenanceNotificationViewPageModule {}
