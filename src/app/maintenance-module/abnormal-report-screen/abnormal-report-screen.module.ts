import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AbnormalReportScreenPageRoutingModule } from './abnormal-report-screen-routing.module';

import { AbnormalReportScreenPage } from './abnormal-report-screen.page';

import { TranslateModule } from "@ngx-translate/core";


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TranslateModule,
    ReactiveFormsModule,
    AbnormalReportScreenPageRoutingModule
  ],
  declarations: [AbnormalReportScreenPage]
})
export class AbnormalReportScreenPageModule {}
