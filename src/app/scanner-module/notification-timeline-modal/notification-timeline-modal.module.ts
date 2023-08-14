import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { NotificationTimelineModalPageRoutingModule } from './notification-timeline-modal-routing.module';

import { NotificationTimelineModalPage } from './notification-timeline-modal.page';
import { TranslateModule } from "@ngx-translate/core";


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TranslateModule,
    NotificationTimelineModalPageRoutingModule
  ],
  declarations: [NotificationTimelineModalPage]
})
export class NotificationTimelineModalPageModule {}
