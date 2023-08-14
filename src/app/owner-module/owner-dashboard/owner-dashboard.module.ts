import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

import { IonicModule } from "@ionic/angular";

import { OwnerDashboardPageRoutingModule } from "./owner-dashboard-routing.module";

import { OwnerDashboardPage } from "./owner-dashboard.page";

import { Ng2SearchPipeModule } from "ng2-search-filter";

import { TranslateModule } from "@ngx-translate/core";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    Ng2SearchPipeModule,
    IonicModule,
    TranslateModule,
    OwnerDashboardPageRoutingModule,
  ],
  declarations: [OwnerDashboardPage],
})
export class OwnerDashboardPageModule {}
