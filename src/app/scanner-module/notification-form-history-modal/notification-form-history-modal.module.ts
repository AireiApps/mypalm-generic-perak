import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { NotificationFormHistoryModalPageRoutingModule } from './notification-form-history-modal-routing.module';

import { NotificationFormHistoryModalPage } from './notification-form-history-modal.page';
import { TranslateModule } from "@ngx-translate/core";


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    TranslateModule,
    IonicModule,
    NotificationFormHistoryModalPageRoutingModule
  ],
  declarations: [NotificationFormHistoryModalPage]
})
export class NotificationFormHistoryModalPageModule {}
