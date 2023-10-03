import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { WeighbridgeReportScreenPageRoutingModule } from './weighbridge-report-screen-routing.module';

import { WeighbridgeReportScreenPage } from './weighbridge-report-screen.page';

import { TranslateModule } from "@ngx-translate/core";


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule,
    TranslateModule,
    WeighbridgeReportScreenPageRoutingModule
  ],
  declarations: [WeighbridgeReportScreenPage]
})
export class WeighbridgeReportScreenPageModule {}
