import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

import { IonicModule } from "@ionic/angular";

import { TabPreventivemaintenanceNewPageRoutingModule } from "./tab-preventivemaintenance-new-routing.module";

import { TabPreventivemaintenanceNewPage } from "./tab-preventivemaintenance-new.page";

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
    TabPreventivemaintenanceNewPageRoutingModule,
  ],
  declarations: [TabPreventivemaintenanceNewPage],
})
export class TabPreventivemaintenanceNewPageModule {}
