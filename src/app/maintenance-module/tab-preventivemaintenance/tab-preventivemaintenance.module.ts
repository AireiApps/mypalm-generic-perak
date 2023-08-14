import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

import { IonicModule } from "@ionic/angular";

import { TabPreventivemaintenancePageRoutingModule } from "./tab-preventivemaintenance-routing.module";

import { TabPreventivemaintenancePage } from "./tab-preventivemaintenance.page";

import { Ng2SearchPipeModule } from "ng2-search-filter";

import { TranslateModule } from "@ngx-translate/core";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    Ng2SearchPipeModule,
    TranslateModule,
    TabPreventivemaintenancePageRoutingModule,
  ],
  declarations: [TabPreventivemaintenancePage],
})
export class TabPreventivemaintenancePageModule {}
