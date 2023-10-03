import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

import { IonicModule } from "@ionic/angular";

import { WeighbridgeUpdateReportScreenPageRoutingModule } from "./weighbridge-update-report-screen-routing.module";

import { WeighbridgeUpdateReportScreenPage } from "./weighbridge-update-report-screen.page";

import { TranslateModule } from "@ngx-translate/core";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    TranslateModule,
    WeighbridgeUpdateReportScreenPageRoutingModule,
  ],
  declarations: [WeighbridgeUpdateReportScreenPage],
})
export class WeighbridgeUpdateReportScreenPageModule {}
