import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

import { IonicModule } from "@ionic/angular";

import { MaintenanceForemanPvClosePageRoutingModule } from "./maintenance-foreman-pv-close-routing.module";

import { MaintenanceForemanPvClosePage } from "./maintenance-foreman-pv-close.page";

import { TranslateModule } from "@ngx-translate/core";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    TranslateModule,
    MaintenanceForemanPvClosePageRoutingModule,
  ],
  declarations: [MaintenanceForemanPvClosePage],
})
export class MaintenanceForemanPvClosePageModule {}
