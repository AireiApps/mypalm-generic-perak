import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

import { IonicModule } from "@ionic/angular";

import { TabSterilizerstationReportPageRoutingModule } from "./tab-sterilizerstation-report-routing.module";

import { TabSterilizerstationReportPage } from "./tab-sterilizerstation-report.page";

import { TranslateModule } from "@ngx-translate/core";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    TranslateModule,
    TabSterilizerstationReportPageRoutingModule,
  ],
  declarations: [TabSterilizerstationReportPage],
})
export class TabSterilizerstationReportPageModule {}
