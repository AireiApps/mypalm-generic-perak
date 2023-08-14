import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

import { IonicModule } from "@ionic/angular";

import { OwnerMaintenancePageRoutingModule } from "./owner-maintenance-routing.module";

import { OwnerMaintenancePage } from "./owner-maintenance.page";

import { TranslateModule } from "@ngx-translate/core";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TranslateModule,
    OwnerMaintenancePageRoutingModule,
  ],
  declarations: [OwnerMaintenancePage],
})
export class OwnerMaintenancePageModule {}
