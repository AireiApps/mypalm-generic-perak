import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

import { IonicModule } from "@ionic/angular";

import { TabCorrectivemaintenancePageRoutingModule } from "./tab-correctivemaintenance-routing.module";

import { TabCorrectivemaintenancePage } from "./tab-correctivemaintenance.page";

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
    TabCorrectivemaintenancePageRoutingModule,
  ],
  declarations: [TabCorrectivemaintenancePage],
})
export class TabCorrectivemaintenancePageModule {}
