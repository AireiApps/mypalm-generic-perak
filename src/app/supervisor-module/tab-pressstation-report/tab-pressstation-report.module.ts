import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

import { IonicModule } from "@ionic/angular";

import { TabPressstationReportPageRoutingModule } from "./tab-pressstation-report-routing.module";

import { TabPressstationReportPage } from "./tab-pressstation-report.page";

import { TranslateModule } from "@ngx-translate/core";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    TranslateModule,
    TabPressstationReportPageRoutingModule,
  ],
  declarations: [TabPressstationReportPage],
})
export class TabPressstationReportPageModule {}
