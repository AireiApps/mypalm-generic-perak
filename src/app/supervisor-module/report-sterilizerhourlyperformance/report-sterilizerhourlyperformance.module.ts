import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

import { IonicModule } from "@ionic/angular";

import { ReportSterilizerhourlyperformancePageRoutingModule } from "./report-sterilizerhourlyperformance-routing.module";

import { ReportSterilizerhourlyperformancePage } from "./report-sterilizerhourlyperformance.page";

import { TranslateModule } from "@ngx-translate/core";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TranslateModule,
    ReactiveFormsModule,
    ReportSterilizerhourlyperformancePageRoutingModule,
  ],
  declarations: [ReportSterilizerhourlyperformancePage],
})
export class ReportSterilizerhourlyperformancePageModule {}
