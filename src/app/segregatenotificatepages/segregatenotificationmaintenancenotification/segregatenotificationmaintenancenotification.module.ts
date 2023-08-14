import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

import { IonicModule } from "@ionic/angular";

import { SegregatenotificationmaintenancenotificationPageRoutingModule } from "./segregatenotificationmaintenancenotification-routing.module";

import { SegregatenotificationmaintenancenotificationPage } from "./segregatenotificationmaintenancenotification.page";

import { TranslateModule } from "@ngx-translate/core";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    TranslateModule,
    SegregatenotificationmaintenancenotificationPageRoutingModule,
  ],
  declarations: [SegregatenotificationmaintenancenotificationPage],
})
export class SegregatenotificationmaintenancenotificationPageModule {}
