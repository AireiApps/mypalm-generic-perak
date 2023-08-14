import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { OillossReportPopupPageRoutingModule } from './oilloss-report-popup-routing.module';

import { OillossReportPopupPage } from './oilloss-report-popup.page';

import { TranslateModule } from "@ngx-translate/core";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TranslateModule,
    OillossReportPopupPageRoutingModule
  ],
  declarations: [OillossReportPopupPage]
})
export class OillossReportPopupPageModule {}
