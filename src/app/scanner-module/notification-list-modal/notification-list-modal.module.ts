import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

import { IonicModule } from "@ionic/angular";

import { NotificationListModalPageRoutingModule } from "./notification-list-modal-routing.module";

import { NotificationListModalPage } from "./notification-list-modal.page";

import { TranslateModule } from "@ngx-translate/core";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    TranslateModule,
    NotificationListModalPageRoutingModule,
  ],
  declarations: [NotificationListModalPage],
})
export class NotificationListModalPageModule {}
