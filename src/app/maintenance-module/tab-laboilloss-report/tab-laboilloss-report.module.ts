import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

import { IonicModule } from "@ionic/angular";

import { TabLaboillossReportPageRoutingModule } from "./tab-laboilloss-report-routing.module";

import { TabLaboillossReportPage } from "./tab-laboilloss-report.page";

import { TranslateModule } from "@ngx-translate/core";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    TranslateModule,
    TabLaboillossReportPageRoutingModule,
  ],
  declarations: [TabLaboillossReportPage],
})
export class TabLaboillossReportPageModule {}
