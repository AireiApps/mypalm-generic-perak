import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

import { IonicModule } from "@ionic/angular";

import { LabOillossesDashboardPageRoutingModule } from "./lab-oillosses-dashboard-routing.module";

import { LabOillossesDashboardPage } from "./lab-oillosses-dashboard.page";

import { TranslateModule } from "@ngx-translate/core";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    TranslateModule,
    LabOillossesDashboardPageRoutingModule,
  ],
  declarations: [LabOillossesDashboardPage],
})
export class LabOillossesDashboardPageModule {}
